import {Anchor, BPNode} from "../../../src/BPNode";
import {BPTypes} from "../BPTypes";

export class IfNode extends BPNode {
    node_id = "if"
    name = "If";
    icon = "\uf031";
    anchors = {
        left: {
            in: new Anchor("In", BPTypes.branch),
            condition: new Anchor("Condition", BPTypes.bool),
        }, right: {
            out: new Anchor("On success", BPTypes.branch),
            out_failure: new Anchor("On failure", BPTypes.branch),
        },
    };

    constructor() {
        super();

        this.size.width = 150;
        this.size.height = 200;
    }
}