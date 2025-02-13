import {CanvasMap} from "./CanvasMap";
import {Blueprint} from "./Blueprint";
import {Anchor, BPNode} from "./BPNode";
import {Toasts} from "./components/Toasts";
import {Geom} from "./math/Geom";
import {BPColors} from "./BPColors";
import {ContextMenu} from "./ContextMenu";
import {Point} from "./math/Point";
import {BPAnchorID} from "./BPAnchorID";
import {BPAnchorLink} from "./BPAnchorLink";
import {BPTypes} from "../examples/bpProgram/BPTypes";
import {DOMUtil} from "./DOMUtil";


export class BPContextItem {
    public label: string;
    public callback: () => BPNode;
    constructor(label: string, callback: () => BPNode) {
        this.label = label;
        this.callback = callback;
    }
}


export class CanvasBP extends CanvasMap {
    blueprint: Blueprint;
    private overNode: BPNode | null = null;
    overAnchor: BPAnchorID | null = null;
    dragElementOrigin = new Point();
    dragElement = false;
    createLinkAnchor: BPAnchorID | null = null;
    selectedNodes: BPNode[] = [];
    mousePosition: Point = new Point();
    private readonly ctxContainer: HTMLDivElement;


    constructor(blueprint: Blueprint, colors: BPColors) {
        super(colors);

        this.blueprint = blueprint;
        this.colors = colors;

        this.style.position = 'relative'
        this.style.display = 'block'


        this.ctxContainer = document.createElement('div')
        this.ctxContainer.style.padding = '.5rem';
        this.ctxContainer.style.background = 'rgb(0,0,0,85%)';
        this.ctxContainer.style.position = 'absolute';
        this.ctxContainer.style.bottom = '5px';
        this.ctxContainer.style.right = '5px';
        this.ctxContainer.innerHTML = ''


        const style = document.createElement('style');
        // style.textContent = '@import "/front/theme/main.css';
        if (this.shadowRoot) {
            this.shadowRoot.append(this.ctxContainer);
            this.shadowRoot.append(style);
        }
    }

    setBlueprint(blueprint: Blueprint) {
        this.blueprint = blueprint
    }

    centerViewport(node: BPNode) {
        const worldCenter = new Point(node.position.x + node.size.width * .5, node.position.y + node.size.height * .5);
        this.centerViewportPoint(worldCenter);
    }

    centerViewportPoint(worldCenter: Point) {
        this.targetOffset = new Point(-this.dimWorldToScreen(worldCenter.x) + this.element.width / 2, -this.dimWorldToScreen(worldCenter.y) + this.element.height / 2);
    }

    center() {
        const bounds = this.blueprint.getBounds();
        this.centerViewportPoint(new Point(bounds.x1 + (bounds.x2 - bounds.x1) * .5, bounds.y1 + (bounds.y2 - bounds.y1) * .5))
    }

    renderBounds() {
        const bounds = this.blueprint.getBounds();

        this.ctx.lineWidth = this.dimWorldToScreen(4);
        this.ctx.setLineDash([this.dimWorldToScreen(20), this.dimWorldToScreen(5), this.dimWorldToScreen(5), this.dimWorldToScreen(5)]);
        this.dFillRoundRectWorld(bounds.x1 - 20, bounds.y1 - 20, bounds.x2 - bounds.x1 + 40, bounds.y2 - bounds.y1 + 40, 'rgb(255,255,255,.01)', 'rgb(255,255,255,.3)', 0, this.dimWorldToScreen(10));
        this.ctx.setLineDash([]);
        this.ctx.lineWidth = 1;
    }

    renderWarn() {
        if (!this.blueprint.isValid()) {
            this.ctx.textAlign = "left"
            this.dFillTextScreen(50, 50, "\uf071", 16, '#fc0', "FontAwesome");
            this.dFillTextScreen(70, 50, "Blueprint is invalid", 16, '#fc0');
            this.dFillTextScreen(70, 70, JSON.stringify(this.blueprint.errors), 16, '#fc0');
        } else {
            this.ctx.textAlign = "left"
            this.dFillTextScreen(50, 50, "\uf00c", 16, '#6C6', "FontAwesome");
            this.dFillTextScreen(70, 50, "Blueprint is valid !", 16, '#6C6');

        }
    }

    deleteNode(node: BPNode) {
        if (this.blueprint.deleteNode(node)) {
            const idx = this.selectedNodes.indexOf(node);
            if (idx !== -1) {
                this.selectedNodes.splice(idx, 1)
                this.ctxContainer.innerHTML = '';
            }
            Toasts.instance.addToastDefault('node deleted');
        }
    }

    isNodeVisible(node: BPNode) {
        if (!node) return false;
        const ptScreen = this.ptWorldToScreen(node.position)
        const sizeScreen = this.sizeWorldToScreen(node.size)
        return ptScreen.x + sizeScreen.width > 10 && ptScreen.x < this.element.width - 10 && ptScreen.y + sizeScreen.height > 10 && ptScreen.y < this.element.height - 10;
    }

    validateLinking(emitToasts = false) {
        if (!this.createLinkAnchor || !this.overAnchor) return false;
        return true;
    }

    renderFrame() {
        super.renderFrame();
        this.renderGrid();
        this.renderBounds();
        this.dPrintInfo();
        for (let i = 0; i < this.blueprint.links.length; i++) {
            const link = this.blueprint.links[i]
            const a1pos = link.a.node.getAnchorPos(link.a.side, link.a.name);
            const a2pos = link.b.node.getAnchorPos(link.b.side, link.b.name);
            if (a1pos && a2pos) {

                const ptAnchorScreen = this.ptWorldToScreen(a1pos)
                const ptAnchor2Screen = this.ptWorldToScreen(a2pos)
                let anchorStart = link.a.object
                let anchorEnd = link.b.object

                if (this.isNodeVisible(link.a.node) || this.isNodeVisible(link.b.node)) {
                    this.ctx.beginPath();
                    this.ctx.lineWidth = this.dimWorldToScreen(anchorStart.type === 'branch' ? 2 : 1);
                    this.ctx.moveTo(ptAnchorScreen.x, ptAnchorScreen.y);
                    Geom.bezier(this.ctx, ptAnchorScreen, ptAnchor2Screen, link.a.side === 'right', link.a.side === 'left');
                    this.ctx.strokeStyle = '#fff';
                    this.ctx.stroke();
                    this.ctx.lineWidth = 1;
                }
            }
        }
        for (let i = 0; i < this.blueprint.nodes.length; i++) {
            const n = this.blueprint.nodes[i]
            if (this.isNodeVisible(n)) {
                n.render(this);
            }
        }
        if (this.createLinkAnchor) {
            const p = this.createLinkAnchor.node.getAnchorPos(this.createLinkAnchor.side, this.createLinkAnchor.name);
            if (p) {

                const ptAnchorScreen = this.ptWorldToScreen(p);
                this.ctx.setLineDash([this.dimWorldToScreen(5), this.dimWorldToScreen(2)]);
                this.ctx.strokeStyle = this.overAnchor ? this.validateLinking(false) ? '#fff' : '#f00' : "#fc0";
                this.ctx.lineWidth = this.dimWorldToScreen(2);
                this.ctx.beginPath();
                this.ctx.moveTo(ptAnchorScreen.x, ptAnchorScreen.y);
                // this.ctx.lineTo(this.mousePosition.x, this.mousePosition.y);
                Geom.bezier(this.ctx, ptAnchorScreen, this.mousePosition, this.createLinkAnchor.side === 'right', this.overAnchor !== null && this.overAnchor.side === 'right');
                this.ctx.stroke();
                this.ctx.setLineDash([]);
                this.ctx.lineWidth = 1;
            }
        }
        this.renderWarn();
    }

    onContextMenu(e: MouseEvent) {
        super.onContextMenu(e);

        const rect = this.element.getBoundingClientRect();

        const menu = ContextMenu.getInstance();
        menu.menuElement.innerHTML = '';
        if (this.overAnchor) {
            const a = this.overAnchor;
            menu.addItem('Delete anchor links', () => {
                this.blueprint.unlink(a);
            });
        } else if (this.overNode) {
            const a = this.overNode
            // menu.addItem(`Add output value`, () => {});
            menu.addItem(`Delete node "${this.overNode.name}#${this.overNode.uid}"`, () => this.deleteNode(a));
        } else {
            const elements = this.getContextElements();
            if (elements.length > 0) {
                const pt = this.ptScreenToWorld(new Point(
                    e.clientX - rect.left,
                    e.clientY - rect.top
                ))
                elements.forEach((el) => {
                    menu.addItem(el.label,  () => this.addNode(el.callback(), pt));
                });
            }
        }
        menu.show(e.pageX, e.pageY);
    }

    // Todo
    async loadNode(nodeName: string, path: string) {
        const {classNode} = await import(path);
        console.log(classNode);
    }

    addNode(node: BPNode, pos: Point) {
        this.blueprint.addNode(node, pos);
    }

    /**
     * Must be overridden.
     */
    getContextElements(): BPContextItem[] {
        return [];
    }

    onMouseUp(e:MouseEvent):undefined {
        const isOnCanvas = e.composedPath().includes(this.element);
        let was_drag = this.dragStarted;

        super.onMouseUp(e);
        this.dragElement = false;

        if (this.createLinkAnchor && this.overAnchor && this.validateLinking(true)) {
            this.onNodeLinked(this.blueprint.link(this.createLinkAnchor, this.overAnchor));
        }
        this.createLinkAnchor = null;
        if (isOnCanvas) {
            if (this.overNode) {
                this.selectedNodes = [this.overNode];
                this.showNodeForm(this.overNode);
            } else if (!was_drag) {
                this.selectedNodes = [];
                this.ctxContainer.innerHTML = '';
            }
        }
    }

    showFormField(node:BPNode,anchor:Anchor,side:string,name:string) {

        if (!anchor.editable) {
            return;
        }
        if (anchor.type === BPTypes.branch) {
            return;
        }

        const index_link = this.blueprint.getLinksOf(new BPAnchorID(node, side, name));
        const link = index_link > -1 ? this.blueprint.links[index_link] : null;
        const remote_anchor = link ? (link.a.node === node ? link.b : link.a) : null;
        const type_is_nullable = anchor.type.substring(0, 1) === '?';
        const final_value = remote_anchor ? remote_anchor.object.value : (anchor.value ?? '');
        const is_linked = side === 'left' && index_link > -1;

        const wrap = DOMUtil.element('div', {
            className: `flex p-05 flex-align ${is_linked || !anchor.editable ? `disabled muted` : ''}`
        });
        const label = DOMUtil.element('div', {className: 'pr-1 text-sm', textContent: anchor.label});
        label.style.width = "200px";

        // -- nullCheck
        const nullCheck = DOMUtil.element('input', {type: "checkbox"}) as HTMLInputElement;
        nullCheck.checked = anchor.value === null;
        nullCheck.style.display = type_is_nullable ? '' : 'none';
        nullCheck.addEventListener('change', e => {
            input.style.display = nullCheck.checked ? 'none' : '';
        });

        // -- Input
        const input = DOMUtil.element('input', {}) as HTMLInputElement;
        switch (anchor.type) {
            case BPTypes.float:
                input.pattern = "[0-9]*\.[0-9]*";
                input.value = final_value;
                break;
            case BPTypes.int:
                input.pattern = "[1-9][0-9]*"
                input.value = final_value;
                break;
            case BPTypes.image:
                input.type = 'file';
                break;
            default:
                input.value = final_value;
        }
        if (!is_linked) input.required = true;
        input.style.padding = '2px 5px';
        if (anchor.value === null) input.style.display = 'none';
        const onChange =  (e:Event|null) => {
            if (anchor.type === BPTypes.int) {
                anchor.value = parseInt(input.value)
            } else {
                anchor.value = input.value
            }
        }
        input.addEventListener('change', (e:Event) => onChange(e));
        onChange(null);

        // -- add to DOM
        wrap.append(label, nullCheck, input)
        this.ctxContainer.append(wrap)
    }
    showNodeForm(node:BPNode) {
        this.ctxContainer.innerHTML = '';
        for (let side in node.anchors) {
            for (let name in node.anchors[side]) {
                const anchor = node.anchors[side][name];
                this.showFormField(node,anchor,side,name);
            }
        }
    }

    onNodeLinked(link:BPAnchorLink) {
        if (link.a.object.type === 'any') {
            link.a.object.type = link.b.object.type;
        }
        if (link.b.object.type === 'any') {
            link.b.object.type = link.a.object.type;
        }
    }

    onMouseMove(e:MouseEvent) {
        super.onMouseMove(e);
        const rect = this.element.getBoundingClientRect();
        this.mousePosition.set(
            e.clientX - rect.left,
            e.clientY - rect.top
        )

        if (this.dragElement && this.overNode) {
            this.overNode.position.x += this.dimScreenToWorld(e.clientX - this.dragElementOrigin.x);
            this.overNode.position.y += this.dimScreenToWorld(e.clientY - this.dragElementOrigin.y);
            this.dragElementOrigin.set(e.clientX, e.clientY);
            return;
        }

        const mouseWorldPos = this.ptScreenToWorld(this.mousePosition);
        this.overNode = null;
        this.overAnchor = null;
        for (let i = 0; i < this.blueprint.nodes.length; i++) {
            const node = this.blueprint.nodes[i];
            if (mouseWorldPos.x > node.position.x - 10 &&
                mouseWorldPos.x < node.position.x + node.size.width + 10 &&
                mouseWorldPos.y > node.position.y - 10 &&
                mouseWorldPos.y < node.position.y + node.size.height + 10
            ) {
                if (mouseWorldPos.x > node.position.x &&
                    mouseWorldPos.x < node.position.x + node.size.width &&
                    mouseWorldPos.y > node.position.y &&
                    mouseWorldPos.y < node.position.y + node.size.height
                ) {
                    this.overNode = node;
                }
                ['left', 'right'].forEach(side => {
                    // @ts-ignore
                    for (let anchorName in node.anchors[side]) {
                        if (anchorName.substring(0, 1) === '_') {
                            continue;
                        }
                        const anchorPos = node.getAnchorPos(side, anchorName)
                        if (anchorPos &&
                            mouseWorldPos.x > anchorPos.x - 10 &&
                            mouseWorldPos.x < anchorPos.x + 10 &&
                            mouseWorldPos.y > anchorPos.y - 10 &&
                            mouseWorldPos.y < anchorPos.y + 10
                        ) {
                            this.overNode = node;
                            this.overAnchor = new BPAnchorID(node, side, anchorName);
                        }
                    }
                });
            }
        }
        this.element.style.cursor = (this.overAnchor || this.overNode) ? (this.overAnchor ? (this.createLinkAnchor ? (this.validateLinking() ? 'cell' : 'not-allowed') : 'crosshair') : 'move') : 'default';

    }

    onMouseDown(e:MouseEvent): undefined {
        let catchDrag = false;
        if (e.button === 0) {
            if (this.overAnchor) {
                this.createLinkAnchor = this.overAnchor;
                catchDrag = true;
            } else if (this.overNode) {
                catchDrag = true;
                this.dragElementOrigin.set(e.clientX, e.clientY);
                this.dragElement = true;
            }
        }
        if (!catchDrag) super.onMouseDown(e)
    }

    onDblClick(e:MouseEvent) {
        super.onDblClick(e);
        if (this.overNode) {
            this.centerViewport(this.overNode)
        }
    }
}
customElements.define('tivins-canvas-bp', CanvasBP);