import {BPAnchorID} from "./BPAnchorID";

export class BPAnchorLink {
    a: BPAnchorID;
    b: BPAnchorID;

    constructor(a: BPAnchorID, b: BPAnchorID) {
        this.a = a;
        this.b = b;
    }
}