export class Point {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    static fromCoordinate(coordinate: Point): Point {
        return new Point(coordinate.x, coordinate.y);
    }
    fromCoordinate(coordinate: Point): this {
        this.x = coordinate.x;
        this.y = coordinate.y;
        return this;
    }

    set(x: number, y: number): this {
        this.x = x;
        this.y = y;
        return this;
    }

    add(pt: Point): this {
        this.x += pt.x;
        this.y += pt.y;
        return this;
    }
}