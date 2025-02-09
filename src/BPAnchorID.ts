import {BPNode} from "./BPNode";

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