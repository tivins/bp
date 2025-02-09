import {Anchor, BPNode, Nodes} from "../../../src/BPNode";
import {Size} from "../../../src/math/Size";
import {BPTypes} from "../BPTypes";

export class NopNode extends BPNode {
    node_id = "nop";
    name = "Nop";
    size = new Size(150, 120);
    anchors: Nodes = {
        left: {
            in: new Anchor("In", BPTypes.branch),
        },
        right: {
            out: new Anchor("Out", BPTypes.branch),
        }
    };
}