import {Anchor, BPNode, BPSide} from "../../../src/BPNode";
import {BPTypes} from "../BPTypes";
import {Blueprint} from "../../../src/Blueprint";
import {BPAnchorID} from "../../../src/BPAnchorID";

export class CompareNode extends BPNode {
    node_id = "compare"
    name = "Compare";
    icon = "\uf031";
    anchors = {
        left: {
            in: new Anchor("In", BPTypes.branch),
            a: new Anchor("A", BPTypes.any),
            b: new Anchor("B", BPTypes.any),
        },
        right: {
            out: new Anchor("Out", BPTypes.branch),
            result: new Anchor("Result", BPTypes.int),
        },
    };

    constructor() {
        super();

        this.size.width = 150;
        this.size.height = 200;
    }

    checkValidity(blueprint:Blueprint) {
        super.checkValidity(blueprint);
        if (blueprint.getLinksOf(new BPAnchorID(this, BPSide.left, 'in')) === -1) {
            this.errors.push('"in" is not linked');
        }
        if (blueprint.getLinksOf(new BPAnchorID(this, BPSide.left, 'a')) === -1) {
            this.errors.push('"a" is not linked');
        }
        if (blueprint.getLinksOf(new BPAnchorID(this, BPSide.left, 'b')) === -1) {
            this.errors.push('"b" is not linked');
        }
    }
}