import {Anchor, BPNode} from "../../../src/BPNode";
import {BPTypes} from "../BPTypes";
import {Blueprint} from "../../../src/Blueprint";
import {BPAnchorID} from "../../../src/BPAnchorID";

export class EndNode extends BPNode {
    node_id = "end"
    name = "End"
    icon = "\uf1e6"
    nodeColor = '#960'

    anchors = {
        left: {
            in: new Anchor("In", BPTypes.branch)
        }, right: {
        }
    }

    constructor() {
        super();
        this.size.width = 100;
        this.size.height = 70;
    }

    checkValidity(blueprint: Blueprint) {
        super.checkValidity(blueprint);
        if (blueprint.getLinksOf(new BPAnchorID(this, 'left', 'in')) === -1) {
            this.errors.push("'in' is not linked")
        }
    }
}