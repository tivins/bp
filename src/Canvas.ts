export class Renderer {

    static #ctx: CanvasRenderingContext2D;

    static setContext(ctx:CanvasRenderingContext2D) {
        this.#ctx = ctx
    }

    static assignStyle(fs: string, ss: string) {
        if (fs) {
            this.#ctx.fillStyle = fs;
        }
        if (ss) {
            this.#ctx.strokeStyle = ss;
        }
    }

    static applyStyle(fs: string, ss: string) {
        if (fs) {
            this.#ctx.fillStyle = fs;
            this.#ctx.fill();
        }
        if (ss) {
            this.#ctx.strokeStyle = ss;
            this.#ctx.stroke();
        }
    }

    static dFillRect(x:number, y:number, w:number, h:number) {
        this.#ctx.fillRect(x, y, w, h);
    }

    static dStrokeRect(x:number, y:number, w:number, h:number) {
        this.#ctx.strokeRect(x + .5, y + .5, w + .5, h + .5);
    }

    static dRoundRect(x:number, y:number, w:number, h:number, r:number, fs:string, ss:string) {
        this.#ctx.beginPath();
        this.#ctx.roundRect(x, y, w, h, r);
        // this.#ctx.closePath();
        this.applyStyle(fs, ss);
    }

    static dTriangle(x:number, y:number, r:number, fs:string, ss:string) {
        this.#ctx.beginPath();
        this.#ctx.moveTo(x - r, y - r);
        this.#ctx.lineTo(x - r, y + r);
        this.#ctx.lineTo(x + r, y);
        this.#ctx.closePath();
        this.applyStyle(fs, ss);
    }

    static dCircle(x:number, y:number, r:number, fs:string, ss:string) {
        this.#ctx.beginPath();
        this.#ctx.arc(x, y, r, 0, 2 * Math.PI);
        this.#ctx.closePath();
        this.applyStyle(fs, ss);
    }
}

/**
 * @version 2025-01-23
 * @see run()
 */
export class Canvas extends HTMLElement {
    protected readonly canvas: HTMLCanvasElement;
    protected readonly ctx: CanvasRenderingContext2D;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.canvas = document.createElement('canvas');
        this.canvas.style.display = 'block';
        this.canvas.style.width = '100vw';
        this.canvas.oncontextmenu = (e:MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            this.onContextMenu(e);
        }
        const ctx = this.canvas.getContext("2d");
        if (!ctx) {
            throw new Error("Canvas not supported");
        }
        this.ctx = ctx;
        // this.#ctx.imageSmoothingEnabled = false
        Renderer.setContext(this.ctx);
        this.shadowRoot?.appendChild(this.canvas);
    }

    connectedCallback() {
    }

    disconnectedCallback() {
    }

    get element() {
        return this.canvas
    }


    run() {
        const renderLoop = () => {
            this.render();
            requestAnimationFrame(renderLoop);
        };
        requestAnimationFrame(renderLoop);
    }

    resize() {
        if (!this.canvas) {
            return;
        }
        const newWidth = this.canvas.offsetWidth;
        const newHeight = window.innerHeight;
        // Redimensionner seulement si nécessaire
        if (this.canvas.width !== newWidth || this.canvas.height !== newHeight) {
            this.canvas.width = newWidth;
            this.canvas.height = newHeight;
        }
    }

    render() {
        this.resize();
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        }
        this.renderFrame();
    }

    renderFrame() {
        if (this.ctx) {
            this.ctx.font = "14px sans-serif";
        }
    }

    get canvasSize() {
        return {
            width: this.canvas?.width ?? 0,
            height: this.canvas?.height ?? 0
        }
    }

    onContextMenu(e: MouseEvent) {
    }
}

customElements.define('tivins-canvas', Canvas)
