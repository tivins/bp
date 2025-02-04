import {CanvasMap} from "../src/CanvasMap";
import {API} from "../src/API";

export class CanvasMapExample extends CanvasMap {
    renderFrame() {
        super.renderFrame();
        this.renderGrid(20, '#ccc', '#666')
        this.dFillTextWorld(100, 100, "Test", 16, "#000", "Arial");
    }
}

customElements.define('tivins-canvas-map-example', CanvasMapExample)

document.addEventListener('DOMContentLoaded', () => {
    API.setToken('yolo').setBaseUrl('');
    API.get('/examples/data.json').then(console.log);

    const canvas = new CanvasMapExample();
    document.body.style.margin = '0';
    document.body.append(canvas);
    canvas.run()
})
