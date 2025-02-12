import {Anchor, BPNode} from "../../../src/BPNode";
import {BPTypes} from "../BPTypes";
import {Size} from "../../../src/math/Size";

export class FlipFlopNode extends BPNode {
    node_id = "flipFlop";
    name = "FlipFlop";
    icon = "\uf126";
    size = new Size(150, 160);
    anchors = {
        left: {
            in: new Anchor("In", BPTypes.branch)
        },
        right: {
            out_on: new Anchor("Out ON", BPTypes.branch),
            out_off: new Anchor("Out OFF", BPTypes.branch),
            state: new Anchor("State", BPTypes.bool),
        },
    };
}