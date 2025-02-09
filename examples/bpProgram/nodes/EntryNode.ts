import {Anchor, BPNode, BPSide} from "../../../src/BPNode";
import {BPTypes} from "../BPTypes";
import {Blueprint} from "../../../src/Blueprint";
import {BPAnchorID} from "../../../src/BPAnchorID";

export class EntryNode extends BPNode {
    node_id = "entry"
    name = "Entry"
    icon = "\uf1e6"
    nodeColor = '#960'

    anchors = {
        left: {}, right: {
            out: new Anchor("Out", BPTypes.branch)
        }
    }

    constructor() {
        super();
        this.size.width = 100;
        this.size.height = 70;
    }

    checkValidity(blueprint: Blueprint) {
        super.checkValidity(blueprint);
        if (blueprint.getLinksOf(new BPAnchorID(this, BPSide.right, 'out')) === -1) {
            this.errors.push("'out' is not linked")
        }
    }
}