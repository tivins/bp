import {UID} from "./UID";
import {Blueprint} from "./Blueprint";
import {CanvasBP} from "./CanvasBP";
import {Point} from "./math/Point";
import {Size} from "./math/Size";
import {BPAnchorID} from "./BPAnchorID";

export const BPAnchorSpace = 40;

export class Anchor {
    label: string;
    type: string;
    value: any;
    editable: boolean

    constructor(label: string, type: string, value: any = undefined, editable = false) {
        this.label = label;
        this.type = type;
        this.value = value;
        this.editable = editable;
    }
}


export interface Nodes {
    [side: string]: {
        [name: string]: Anchor;
    };
}


export class BPNode extends UID {
    node_id = "node";
    name = "Module Name";
    icon = "\uf126";
    protected _position = new Point();
    size = new Size(200, 100);
    nodeColor = '#153'
    errors:string[] = []
    anchors: Nodes = {};

    set position(pos: Point) {
        this._position.fromCoordinate(pos);
    }

    get position(): Point {
        return this._position;
    }

    onUnlink(anchorID: BPAnchorID) {
    }

    onLink(anchorID: BPAnchorID) {
    }

    getAnchorPos(side: string, name: string) {
        let y = 45;
        for (let n in this.anchors[side]) {
            if (n === name) {
                return new Point(this.position.x + (side === 'right' ? this.size.width : 0), this.position.y + y);
            }
            y += BPAnchorSpace;
        }
        return null;
    }

    toJSON() {
        return {
            id: this.uid, node_id: this.node_id, pos: this._position,
        }
    }

    render(canvas: CanvasBP) {
        const ss = canvas.selectedNodes.indexOf(this) !== -1 ? '#fff' : this.nodeColor; // canvas.overNode === this ? this.nodeColor : null
        const radScreen = canvas.dimWorldToScreen(5)
        canvas.ctx.lineWidth = canvas.dimWorldToScreen(1)
        canvas.dFillRoundRectWorld(this.position.x, this.position.y, this.size.width, this.size.height, 'rgb(0, 0, 0, 40%)', ss, 15, radScreen)
        canvas.ctx.lineWidth = 1
        canvas.dFillRoundRectWorld(this.position.x, this.position.y, this.size.width, 30, this.nodeColor, '', 0, [radScreen, radScreen, 0, 0])

        //----------------

        canvas.ctx.textBaseline = 'hanging'
        canvas.ctx.shadowBlur = 2;
        canvas.ctx.shadowOffsetY = 1;
        canvas.ctx.textAlign = 'center'
        canvas.dFillTextWorld(this.position.x + 15, this.position.y + 10, this.icon, 16, "rgb(255,255,255,50%)", "FontAwesome")
        canvas.ctx.textAlign = 'left'
        canvas.dFillTextWorld(this.position.x + 35, this.position.y + 10, this.name, 16, "#ccc")
        canvas.dFillTextWorld(this.position.x - 10, this.position.y - 10, '#' + this.uid, 11, "#ccc")
        canvas.ctx.shadowBlur = 0;
        canvas.ctx.shadowOffsetY = 0;


        this.renderAnchors(canvas, this.anchors['left'], 'left');
        this.renderAnchors(canvas, this.anchors['right'], 'right');
    }

    renderAnchors(canvas: CanvasBP, anchors: Record<string, Anchor>, side: "left" | "right" = 'left') {
        if (!anchors) return;
        const isLeft = side === 'left';
        const mainColor = isLeft ? "#08c" : '#696'
        const font11HeightScreen = canvas.dimWorldToScreen(11);
        canvas.ctx.textAlign = side;
        let y = 45;
        const radius = canvas.dimWorldToScreen(5);
        for (let anchorName in anchors) {
            if (anchorName.substring(0, 1) === '_') {
                y += BPAnchorSpace;
                continue;
            }

            const anchor = anchors[anchorName]
            const anchorPos = this.getAnchorPos(side, anchorName);
            if (!anchorPos) {
                continue;
            }

            const x1 = isLeft ? (this.position.x + 10) : (this.position.x + this.size.width - 10);
            if (font11HeightScreen > 4) canvas.dFillTextWorld(x1, this.position.y + y - 4, anchor.label, 13, mainColor);
            if (font11HeightScreen > 8) canvas.dFillTextWorld(x1, this.position.y + y - 4 + 12, anchor.type, 11, "#666");

            if (anchor.value !== undefined && font11HeightScreen > 6) {
                canvas.dFillTextWorld(x1, this.position.y + y - 4 + 12 * 2, JSON.stringify(anchor.value), 11, "#fc0");
            }
            if (radius > 2) {
                let index = canvas.blueprint.getLinksOf(new BPAnchorID(this, side, anchorName))
                let fill = '#000'
                let border = mainColor;
                canvas.ctx.lineWidth = canvas.dimWorldToScreen(1);
                if (index > -1 || (canvas.overAnchor && canvas.overAnchor.node === this && canvas.overAnchor.side === side && canvas.overAnchor.name === anchorName) || (canvas.createLinkAnchor && canvas.createLinkAnchor.node === this && canvas.createLinkAnchor.side === side && canvas.createLinkAnchor.name === anchorName)) {
                    //canvas.ctx.shadowBlur = canvas.dimWorldToScreen(5);
                    //canvas.ctx.shadowColor = '#fff';
                    fill = mainColor
                    // border = 'black'
                    // canvas.ctx.lineWidth = canvas.dimWorldToScreen(2);
                }


                if (anchor.type === 'branch') {
                    canvas.dTriangleWorld(anchorPos.x, anchorPos.y, radius, fill, border)
                } else {
                    canvas.dCircleWorld(anchorPos.x, anchorPos.y, 5, fill, border)
                }

                canvas.ctx.lineWidth = 1;
                canvas.ctx.shadowBlur = 0;
            }
            y += BPAnchorSpace;
        }
    }


    isValid(canvas: CanvasBP) {
        return this.errors.length === 0;
    }

    checkValidity(bp: Blueprint) {
    }
}

