import {CanvasMap} from "../src/CanvasMap";
import {BPColors} from "../src/BPColors";

export class CanvasMapExample extends CanvasMap {
    renderFrame() {
        super.renderFrame();
        this.renderGrid()
        this.dFillTextWorld(100, 100, "Test", 16, "#000", "Arial");
    }
}

customElements.define('tivins-canvas-map-example', CanvasMapExample)

document.addEventListener('DOMContentLoaded', () => {
    // API.setToken('yolo').setBaseUrl('');
    // API.get('/examples/data.json').then(console.log);

    const canvas = new CanvasMapExample(new BPColors());
    document.body.style.margin = '0';
    document.body.append(canvas);
    canvas.run()
})
