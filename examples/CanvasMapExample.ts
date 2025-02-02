import {CanvasMap} from "../src/CanvasMap";

export class CanvasMapExample extends CanvasMap {
    renderFrame() {
        super.renderFrame();
        this.dFillTextWorld(100, 100, "Test", 16, "#000", "Arial");
    }
}

customElements.define('tivins-canvas-map-example', CanvasMapExample)

document.addEventListener('DOMContentLoaded', () => {
    const canvas = new CanvasMapExample();
    document.body.style.margin = '0';
    document.body.append(canvas);
    canvas.run()
})
