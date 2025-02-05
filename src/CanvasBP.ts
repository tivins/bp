import {CanvasMap} from "./CanvasMap";
import {Blueprint} from "./Blueprint";
import {BPAnchorID, BPNode} from "./BPNode";
import {Point} from "./Point";
import {Toasts} from "./components/Toasts";
import {Geom} from "./math/Geom";
import {BPColors} from "./BPColors";
import {ContextMenu} from "./ContextMenu";


export class CanvasBP extends CanvasMap {
    private blueprint: Blueprint;
    private overNode: BPNode | null = null;
    private overAnchor: BPAnchorID | null = null;
    dragElementOrigin = {};
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
        style.textContent = '@import "/front/theme/main.css';
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

    // renderGrid() {
    //     super.renderGrid(20, this.colors.linesColor, this.colors.linesColorHigh);
    // }

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
        if (!this.createLinkAnchor) return false;
        if (!this.overAnchor) return false;

        let anchorStart = this.createLinkAnchor.object
        let anchorEnd = this.overAnchor.object

        if (this.createLinkAnchor.node === this.overAnchor.node) {
            if (emitToasts) {
                Toasts.instance.addToastDefault('Not possible to link anchor of the same node. This will be changed in the future', 5, 'error')
            }
            return false;
        }

        if ((anchorStart.type === 'branch' && anchorEnd.type !== 'branch') || (anchorStart.type !== 'branch' && anchorEnd.type === 'branch')) {
            if (emitToasts) Toasts.instance.addToastDefault('Branch should be linked together', 5, 'error')
            return false;
        }
        if (anchorStart.type === 'branch' && anchorEnd.type === 'branch') {
            const linkStartID = this.blueprint.getLinksOf(this.createLinkAnchor);
            const linkEndID = this.blueprint.getLinksOf(this.overAnchor);
            if (linkStartID > -1 || linkEndID > -1) {
                if (emitToasts) {
                    const msg = document.createElement('div');
                    msg.className = 'p-1';
                    msg.textContent = 'Branch cannot be lined twice';
                    const a = document.createElement('a');
                    a.href = '#';
                    a.className = 'button empty squared';
                    a.textContent = 'Unlink';

                    const tmpOverAnchor = this.overAnchor;
                    const tmpCreateAnchor = this.createLinkAnchor;
                    a.addEventListener('click', (e: MouseEvent) => {
                        e.preventDefault();
                        this.blueprint.unlink(tmpOverAnchor);
                        this.blueprint.link(tmpOverAnchor, tmpCreateAnchor);
                    });
                    Toasts.instance.addToast([msg, a], 5, 'error');
                }
                return false;
            }
            if (this.createLinkAnchor.side === this.overAnchor.side) {
                if (emitToasts) Toasts.instance.addToastDefault(`A branch 'out' cannot be linked to a branch 'in', and vice-versa.`, 5, 'error')
                return false;
            }
        }

        if (anchorStart.type !== 'any' && anchorEnd.type !== 'any' && anchorStart.type !== anchorEnd.type) {
            if (emitToasts) Toasts.instance.addToastDefault('Types mismatch', 5, 'error')
            return false;
        }

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
        const pt = this.ptScreenToWorld(new Point(
            e.clientX - rect.left,
            e.clientY - rect.top
        ))
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
            this.getContextElements().forEach((el) => {

                // menu.addItem('Entry point', () => this.addNode(BPNodeAI_Entry, pt));
            })
        }
        menu.show(e.pageX, e.pageY);
    }

    getContextElements(): Object[] {
        return [];
    }
}
customElements.define('tivins-canvas-bp', CanvasBP);