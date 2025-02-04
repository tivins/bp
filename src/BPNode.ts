import {UID} from "./UID";
import {Point} from "./Point";

export class BPNode extends UID {
    node_id = "node";
    private pos = new Point();
    #size = {width: 200, height: 100};
    nodeColor = '#153'

    errors = []
}