import {BPContextItem, CanvasBP} from "../src/CanvasBP";
import {Blueprint} from "../src/Blueprint";

import {BPColors} from "../src/BPColors";
import {Toasts} from "../src/components/Toasts";
import {BPNode} from "../src/BPNode";
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
    name = "Nop";
    size = new Size(250,250);
    anchors = {
        left: {
            in: {label: "In", type: BPTypes.branch},
            template: {label: "Template", type: BPTypes.string, value: "best quality, {prompt}"},
            vars: {label: "Vars", type: BPTypes.string + '[]'}
        },
        right: {
            out: {label: "Out", type: BPTypes.branch},
            result: {label: "Result", type: BPTypes.string, editable: false}
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
