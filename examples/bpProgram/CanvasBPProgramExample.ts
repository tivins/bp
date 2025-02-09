import {BPContextItem, CanvasBP} from "../../src/CanvasBP";
import {Blueprint} from "../../src/Blueprint";
import {BPColors} from "../../src/BPColors";
import {Toasts} from "../../src/components/Toasts";
import {NopNode} from "./nodes/NopNode";
import {PrintNode} from "./nodes/PrintNode";
import {EntryNode} from "./nodes/EntryNode";
import {EndNode} from "./nodes/EndNode";
import {ConstNode} from "./nodes/ConstNode";

class CanvasBPProgramExample extends CanvasBP {
    getContextElements(): BPContextItem[] {
        const elements = super.getContextElements();
        elements.push(new BPContextItem("Nop", () => new NopNode()));
        elements.push(new BPContextItem("PrintNode", () => new PrintNode()));
        elements.push(new BPContextItem("EntryNode", () => new EntryNode()));
        elements.push(new BPContextItem("EndNode", () => new EndNode()));
        elements.push(new BPContextItem("ConstNode", () => new ConstNode()));
        return elements;
    }
}
customElements.define('canvas-bp-program-example', CanvasBPProgramExample);

document.addEventListener('DOMContentLoaded', () => {
    document.body.style.margin = '0';

    Toasts.instance.addToastDefault("<tivins-icon icon='lightbulb' outline></tivins-icon> Use RMB to create a new node.", 0)
    Toasts.instance.addToastDefault("BP Program Example.");

    const canvas = new CanvasBPProgramExample(new Blueprint(), new BPColors());
    document.body.append(canvas);
    canvas.resize();
    canvas.center();
    canvas.run();
})
