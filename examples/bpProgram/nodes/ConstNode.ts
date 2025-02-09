import {Anchor, BPNode} from "../../../src/BPNode";
import {BPTypes} from "../BPTypes";
import {BPAnchorID} from "../../../src/BPAnchorID";

export class ConstNode extends BPNode {
    node_id = "constant"
    name = "Constant"
    icon = "\uf492"
    nodeColor = '#513'
    anchors = {
        left: {},
        right: {
            out: new Anchor("Value", BPTypes.any)
        }
    };

    constructor() {
        super();
        this.size.width = 150;
        this.size.height = 100;
    }

    onUnlink(anchorID:BPAnchorID) {
        super.onUnlink(anchorID);
        this.anchors.right.out.type = 'any';
    }
}