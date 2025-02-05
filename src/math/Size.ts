export class Size {
    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    fromSize(size: Size): this {
        this.width = size.width;
        this.height = size.height;
        return this;
    }

    set(width: number, height: number) {
        this.width = width;
        this.height = height;
        return this;
    }
}