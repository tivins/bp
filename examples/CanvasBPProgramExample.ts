import {BPContextItem, CanvasBP} from "../src/CanvasBP";
import {Blueprint} from "../src/Blueprint";
import {BPColors} from "../src/BPColors";
import {Toasts} from "../src/components/Toasts";
import {Anchor, BPNode, Nodes} from "../src/BPNode";
import {Size} from "../src/math/Size";

export const BPTypes = {
    any: "any",
    branch: "branch",
    string: "string",
    int: "int",
    image: "image",
    float: "float",
    bool: "bool",
}
class NopNode extends BPNode {
    node_id = "nop";
    name = "Nopss";
    size = new Size(250,250);
    anchors:Nodes = {
        left: {
            in: new Anchor("In", BPTypes.branch),
        },
        right: {
            out: new Anchor("Out", BPTypes.branch),
            result: new Anchor("Result", BPTypes.string, null, false)
        }
    };
}

class CanvasBPExample extends CanvasBP {
    getContextElements(): BPContextItem[] {
        const elements = super.getContextElements();
        elements.push(new BPContextItem("Nop", () => new NopNode()));
        return elements;
    }
}
customElements.define('tivins-canvas-bp-example', CanvasBPExample);

document.addEventListener('DOMContentLoaded', () => {
    document.body.style.margin = '0';

    Toasts.instance.addToastDefault("BP Example")

    const canvas = new CanvasBPExample(new Blueprint(), new BPColors());
    document.body.append(canvas);
    canvas.resize();
    canvas.center();
    canvas.run();
})
