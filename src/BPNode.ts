import {UID} from "./UID";
import {Blueprint} from "./Blueprint";
import {CanvasBP} from "./CanvasBP";
import {Point} from "./math/Point";
import {Size} from "./math/Size";

export const BPAnchorSpace = 40;

export class BPNode extends UID {
    node_id = "node";
    name = "Module Name";
    private _position = new Point();
    size = new Size(200, 100);
    nodeColor = '#153'
    errors = []
    anchors = {};

    set position(pos: Point) {
        this._position.fromCoordinate(pos);
    }

    onUnlink(anchorID:BPAnchorID) {
    }

    onLink(anchorID:BPAnchorID) {
    }
    getAnchorPos(side:string, name:string) {
        let y = 45;
        // @ts-ignore
        for (let n in this.anchors[side]) {
            if (n === name) {
                return new Point(
                    this.position.x + (side === 'right' ? this.size.width : 0),
                    this.position.y + y
                );
            }
            y += BPAnchorSpace;
        }
        return null;
    }
    toJSON() {
        return {
            id: this.uid,
            node_id: this.node_id,
            pos: this._position,
        }
    }

    render(canvas:CanvasBP) {
        const ss = canvas.selectedNodes.indexOf(this) !== -1 ? '#fff' : this.nodeColor; // canvas.overNode === this ? this.nodeColor : null
        const radScreen = canvas.dimWorldToScreen(5)
        canvas.ctx.lineWidth = canvas.dimWorldToScreen(1)
        canvas.dFillRoundRectWorld(this.position.x, this.position.y, this.size.width, this.size.height, 'rgb(0, 0, 0, 40%)', ss, 15, radScreen)
        canvas.ctx.lineWidth = 1
        canvas.dFillRoundRectWorld(this.position.x, this.position.y, this.size.width, 30, this.nodeColor, '', 0, [radScreen, radScreen, 0, 0])
    }

    isValid(canvas:CanvasBP) {
        return this.errors.length === 0;
    }

    checkValidity(bp: Blueprint) {
    }
}

export class BPAnchorID {
    node: BPNode;
    side;
    name;

    constructor(node: BPNode, side: string, name: string) {
        this.node = node;
        this.side = side;
        this.name = name;
    }

    get object() {
        // todo
        // @ts-ignore
        return this.node.anchors[this.side][this.name]
    }
}

export class BPAnchorLink {
    a: BPAnchorID;
    b: BPAnchorID;

    constructor(a: BPAnchorID, b: BPAnchorID) {
        this.a = a;
        this.b = b;
    }
}