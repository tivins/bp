import {CanvasBP} from "../src/CanvasBP";
import {Blueprint} from "../src/Blueprint";

import {BPColors} from "../src/BPColors";

export class CanvasBPExample extends CanvasBP {
}
customElements.define('tivins-canvas-bp-example', CanvasBPExample)

document.addEventListener('DOMContentLoaded', () => {
    document.body.style.margin = '0';

    const canvas = new CanvasBPExample(new Blueprint(), new BPColors());
    document.body.append(canvas);
    canvas.resize();
    canvas.center();
    canvas.run();
})
