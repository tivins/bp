import {Anchor, BPNode, Nodes} from "../../../src/BPNode";
import {Size} from "../../../src/math/Size";
import {BPTypes} from "../BPTypes";

export class PrintNode extends BPNode {
    node_id = "print";
    name = "Print";
    size = new Size(150, 120);
    anchors: Nodes = {
        left: {
            in: new Anchor("In", BPTypes.branch),
            msg: new Anchor("Input", BPTypes.string),
        },
        right: {
            out: new Anchor("Out", BPTypes.branch),
        }
    };
}