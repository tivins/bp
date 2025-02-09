import {BPNode} from "./BPNode";
import {Point} from "./math/Point";
import {Bounds} from "./math/Bounds";
import {BPAnchorID} from "./BPAnchorID";
import {BPAnchorLink} from "./BPAnchorLink";

export class Blueprint {
    id = 0;
    nodes: BPNode[] = [];
    links: BPAnchorLink[] = [];
    errors = [];

    addNode(obj: BPNode, pos: Point) {
        obj.position = pos;
        this.nodes.push(obj);
        this.onChange();
        return obj;
    }

    deleteNode(node: BPNode) {
        let index = this.nodes.indexOf(node)
        if (index > -1) {
            for (let side in node.anchors) {
                // todo fix
                // @ts-ignore
                for (let name in node.anchors[side]) {
                    let ii;
                    do {
                        ii = this.getLinksOf(new BPAnchorID(node, side, name))
                        if (ii > -1) this.links.splice(ii, 1)
                    } while (ii > -1);
                }
            }
            this.nodes.splice(index, 1);
            this.onChange();
            return true;
        }
        return false;
    }

    getLinksOf(anchorID: BPAnchorID) {
        for (let i = 0; i < this.links.length; i++) {
            if ((this.links[i].a.node === anchorID.node && this.links[i].a.side === anchorID.side && this.links[i].a.name === anchorID.name) || (this.links[i].b.node === anchorID.node && this.links[i].b.side === anchorID.side && this.links[i].b.name === anchorID.name)) {
                return i;
            }
        }
        return -1;
    }

    unlink(a: BPAnchorID) {
        let index = this.getLinksOf(a);
        if (index > -1) {
            this.links[index].a.node.onUnlink(this.links[index].b);
            this.links[index].b.node.onUnlink(this.links[index].a);
            this.links.splice(index, 1);
            this.onChange();
        }
    }

    link(a: BPAnchorID, b: BPAnchorID) {
        const link = new BPAnchorLink(a, b);
        this.links.push(link);
        a.node.onLink(b);
        b.node.onLink(a);
        this.onChange();
        return link;
    }

    onChange() {
        console.debug("Changed");
        this.checkValidity()
    }

    checkValidity() {
        this.errors = [];
        this.nodes.forEach(node => {
            node.checkValidity(this);
            node.errors.forEach(e => this.errors.push(e));
        });
    }

    isValid() {
        return this.errors.length === 0;
    }

    getBounds() {
        if (this.nodes.length === 0) {
            return new Bounds();
        }
        const worldBounds = new Bounds(999999, 999999, -999999, -999999); // TODO

        this.nodes.forEach(node => {
            if (worldBounds.x1 > node.position.x) worldBounds.x1 = node.position.x;
            if (worldBounds.y1 > node.position.y) worldBounds.y1 = node.position.y;
            if (worldBounds.x2 < node.position.x + node.size.width) worldBounds.x2 = node.position.x + node.size.width;
            if (worldBounds.y2 < node.position.y + node.size.height) worldBounds.y2 = node.position.y + node.size.height;
        });

        return worldBounds;
    }
}