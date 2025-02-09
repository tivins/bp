import {Canvas, Renderer} from "./Canvas";
import {Point} from "./math/Point";
import {BPColors} from "./BPColors";

/**
 *
 *
 * @example
 * class CanvasMapExample extends CanvasMap {
 *     renderFrame() {
 *         super.renderFrame();
 *         this.renderGrid(20, '#ccc', '#666')
 *         this.dFillTextWorld(100, 100, "Test", 16, "#000", "Arial");
 *     }
 * }
 * customElements.define('my-canvas-map-example', CanvasMapExample)
 */
export class CanvasMap extends Canvas {
    #targetOffset = new Point();
    #offset = new Point();
    #dragOrigin = new Point();
    #drag = false;
    #dragStarted = false;
    #zoom = 1.15
    #targetZoom = 1.15
    colors: BPColors;

    constructor(colors: BPColors) {
        super();
        this.colors = colors;
        // this.centerViewportByCoordinate(makePoint(0, 0));
        this.element.style.background = this.colors.background;
    }

    get offset() {
        return this.#offset;
    }

    set offset(pt) {
        this.#offset = pt;
    }

    get dragStarted() {
        return this.#dragStarted;
    }

    get targetOffset() {
        return this.#targetOffset;
    }

    set targetOffset(p) {
        this.#targetOffset = p;
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('mouseup', e => this.onMouseUp(e));
        this.element.addEventListener('mousedown', e => this.onMouseDown(e));
        window.addEventListener('mousemove', e => this.onMouseMove(e));
        this.element.addEventListener('wheel', e => this.onMouseWheel(e));
        window.addEventListener('keydown', e => this.onKeyDown(e));
        window.addEventListener('keyup', e => this.onKeyUp(e));
        this.element.addEventListener('dblclick', e => this.onDblClick(e))
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        // TODO does not remove the registered methods, because registered functions are anonymous ones.
        window.removeEventListener('mouseup', this.onMouseUp);
        this.element.removeEventListener('mousedown', this.onMouseDown);
        window.removeEventListener('mousemove', this.onMouseMove);
        this.element.removeEventListener('wheel', this.onMouseWheel);
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
    }

    centerViewportByCoordinate(point: Point) {
        const size = this.canvasSize;
        const pt = this.ptScreenToWorld(point);
        this.#targetOffset = new Point(-pt.x + size.width / 2, -pt.y + size.height / 2);
    }

    // --------------------

    ptWorldToScreen(pt: Point) {
        return new Point(pt.x * this.#zoom + this.#offset.x, pt.y * this.#zoom + this.#offset.y);
    }

    ptScreenToWorld(pt: Point) {
        return new Point((pt.x - this.#offset.x) / this.#zoom, (pt.y - this.#offset.y) / this.#zoom);
    }

    sizeWorldToScreen(sz: { width: number, height: number }) {
        return {
            width: this.dimWorldToScreen(sz.width), height: this.dimWorldToScreen(sz.height),
        }
    }

    dimWorldToScreen(v: number) {
        return v * this.#zoom;
    }

    dimScreenToWorld(v: number) {
        return v / this.#zoom;
    }

    getWorldViewport() {
        const rect = this.element.getBoundingClientRect();
        const topLeftWorld = this.ptScreenToWorld(new Point(rect.left, rect.top));
        const bottomRightWorld = this.ptScreenToWorld(new Point(rect.right, rect.bottom));
        return {topLeft: topLeftWorld, bottomRight: bottomRightWorld};
    }

    //

    onDblClick(e: MouseEvent) {
    }

    renderFrame() {
        super.renderFrame();
        this.#offset.x += (this.#targetOffset.x - this.#offset.x) * 0.2;
        this.#offset.y += (this.#targetOffset.y - this.#offset.y) * 0.2;
    }

    onMouseWheel(e: WheelEvent) {
        e.preventDefault();
        const zoomFactor = 1.15;

        const rect = this.element.getBoundingClientRect();
        const canvasMousePos = new Point(e.clientX - rect.left, e.clientY - rect.top);
        const worldPosBeforeZoom = this.ptScreenToWorld(canvasMousePos);

        const isDown = e.deltaY > 0;
        this.#zoom *= isDown ? 1 / zoomFactor : zoomFactor;
        if (this.#zoom < 0.01) this.#zoom = 0.01;
        // if (this.#zoom > 50) this.#zoom = 50;

        const worldPosAfterZoom = this.ptScreenToWorld(canvasMousePos);

        // Update offset to keep cursor on the same position in the world.
        this.#offset.x += (worldPosAfterZoom.x - worldPosBeforeZoom.x) * this.#zoom;
        this.#offset.y += (worldPosAfterZoom.y - worldPosBeforeZoom.y) * this.#zoom;

        // Update target offset
        this.#targetOffset.fromCoordinate(this.#offset);
    }

    onMouseMove(e: MouseEvent) {
        if (this.#drag) {
            this.#offset.x += e.clientX - this.#dragOrigin.x;
            this.#offset.y += e.clientY - this.#dragOrigin.y;
            this.#targetOffset.fromCoordinate(this.#offset);
            this.#dragOrigin.set(e.clientX, e.clientY);
            this.#dragStarted = true;
        }
    }

    onMouseDown(e: MouseEvent) {
        if (e.button === 0) {
            this.#drag = true;
            this.#dragOrigin = new Point(e.clientX, e.clientY);
        }
        return undefined;
    }

    onMouseUp(e: MouseEvent) {
        if (e.button === 2) {
            this.onRightClick(e);
        }
        if (e.button === 0) {
            this.#drag = false;
            this.#dragStarted = false;
        }
        return undefined;
    }

    onRightClick(e: MouseEvent) {
    }

    onKeyDown(e: KeyboardEvent) {
        return undefined;
    }

    onKeyUp(e: KeyboardEvent) {
        return undefined;
    }

    // ------------------------
    // draw
    // ------------------------
    renderGrid(stepWorldSize = 20) {

        let stepScreenWidth = this.dimWorldToScreen(stepWorldSize);
        if (stepScreenWidth > 50) stepWorldSize = 10;
        if (stepScreenWidth < 10) stepWorldSize = 100;
        if (stepScreenWidth < 5) stepWorldSize = 200;
        if (stepScreenWidth < 3) stepWorldSize = 2000;
        else if (stepScreenWidth < 1) stepWorldSize = 3000;
        // console.debug("stepScreenWidth", stepScreenWidth)

        let topLeftScreenWorld = this.ptScreenToWorld(new Point());
        let bottomRightScreenWorld = this.ptScreenToWorld(new Point(this.element.width, this.element.height));
        for (let y = (Math.floor(topLeftScreenWorld.y / stepWorldSize) * stepWorldSize); y < (Math.ceil(bottomRightScreenWorld.y / stepWorldSize) * stepWorldSize); y += stepWorldSize) {
            this.dLineWorld(topLeftScreenWorld.x, y, bottomRightScreenWorld.x, y, y % 200 === 0 ? this.colors.linesColorHigh : this.colors.linesColor);
        }
        for (let x = (Math.floor(topLeftScreenWorld.x / stepWorldSize) * stepWorldSize); x < (Math.ceil(bottomRightScreenWorld.x / stepWorldSize) * stepWorldSize); x += stepWorldSize) {
            this.dLineWorld(x, topLeftScreenWorld.y, x, bottomRightScreenWorld.y, x % 200 === 0 ? this.colors.linesColorHigh : this.colors.linesColor);
        }
    }

    dFillTextScreen(x: number, y: number, text: string, fontSize: number, fs: string, family = 'Source Sans 3') {
        this.ctx.font = `${fontSize.toFixed(5)}px "${family}"`;
        this.ctx.fillStyle = fs;
        const lines = text.split('\n');
        lines.forEach((line, i) => {
            this.ctx.fillText(line, x, y + fontSize * i);
        })
    }

    dFillTextWorld(x: number, y: number, text: string, fontSize: number, fs: string, family = 'Source Sans 3') {
        this.dFillTextScreen(this.#zoom * x + this.#offset.x, this.#zoom * y + this.#offset.y, text, this.#zoom * fontSize, fs, family);
    }

    /**
     * Draw a "world" line from A to B.
     *
     * @param x {number} Abscissa value of A in world coordinates.
     * @param y {number} Ordinate value of A in world coordinates.
     * @param x2 {number} Abscissa value of B in world coordinates.
     * @param y2 {number} Ordinate value of B in world coordinates.
     * @param ss {string} Stroke style.
     * @param lineWidth {number} Line width in word coordinates.
     */
    dLineWorld(x: number, y: number, x2: number, y2: number, ss: string, lineWidth: number = 1) {
        const lineWidthScreen = this.dimWorldToScreen(lineWidth);
        this.ctx.beginPath();
        this.ctx.lineWidth = lineWidthScreen;
        this.ctx.moveTo(this.#zoom * x + this.#offset.x + .5, this.#zoom * y + this.#offset.y + .5);
        this.ctx.lineTo(this.#zoom * x2 + this.#offset.x + .5, this.#zoom * y2 + this.#offset.y + .5);
        this.ctx.closePath();
        Renderer.applyStyle('', ss)
    }

    dFillRectWorld(x: number, y: number, w: number, h: number, fs: string, ss: string, blur: number) {
        let ptScreen = this.ptWorldToScreen(new Point(x, y));
        if (blur) {
            this.ctx.shadowBlur = blur;
            this.ctx.shadowColor = "#000";
        }
        Renderer.assignStyle(fs, ss)
        if (fs) Renderer.dFillRect(ptScreen.x, ptScreen.y, w * this.#zoom, h * this.#zoom);
        if (ss) Renderer.dStrokeRect(ptScreen.x, ptScreen.y, w * this.#zoom, h * this.#zoom);
        if (blur) this.ctx.shadowBlur = 0;
    }

    dFillRoundRectWorld(x: number, y: number, w: number, h: number, fs: string, ss: string, blur: number, radius: number|number[]) {
        let ptScreen = this.ptWorldToScreen(new Point(x, y));
        if (blur) {
            this.ctx.shadowBlur = blur;
            this.ctx.shadowColor = "#000";
        }
        Renderer.dRoundRect(ptScreen.x, ptScreen.y, w * this.#zoom, h * this.#zoom, radius, fs, ss);
        if (blur) this.ctx.shadowBlur = 0;
    }

    dTriangleWorld(x: number, y: number, r: number, fs: string, ss: string) {
        let ptScreen = this.ptWorldToScreen(new Point(x, y));
        Renderer.dTriangle(ptScreen.x, ptScreen.y, r, fs, ss)
    }

    // dCircleWorld(x, y, r, fs, ss) {
    //     let ptScreen = this.ptWorldToScreen(new Coordinate(x, y));
    //     Renderer.dTriangle(ptScreen.x, ptScreen.y, r, fs, ss)
    // }

    dCircle(x: number, y: number, r: number, fs: string, ss: string) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 2 * Math.PI);
        Renderer.applyStyle(fs, ss);
    }

    dCircleWorld(x: number, y: number, r: number, fs: string, ss: string) {
        this.dCircle(x * this.#zoom + this.#offset.x, this.#zoom * y + this.#offset.y, this.dimWorldToScreen(r), fs, ss);
    }

    dPrintInfo(lines = []) {
        this.ctx.textAlign = 'left'
        this.ctx.textBaseline = 'top'


        const bounds = this.getWorldViewport();

        let y = 10;
        this.dFillTextScreen(10, y, `Offset=${this.#targetOffset.x.toFixed(2)},${this.#targetOffset.y.toFixed(2)};`
            + `\nWorldView[${JSON.stringify(bounds)};`
            + `\nZoom=${this.#zoom.toFixed(2)}`, 12, '#39c', 'consolas');
        lines.forEach(line => {
            y += 16;
            this.dFillTextScreen(10, y, line, 12, '#069', 'consolas');
        })
    }

}

customElements.define('canvas-map', CanvasMap)
