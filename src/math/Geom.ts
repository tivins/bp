import {Point} from "./Point";


export class Geom {

    static squareDistance(a: Point, b: Point) {
        return Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2);
    }

    static bezier(ctx: CanvasRenderingContext2D, pt1: Point, pt2: Point, d1: boolean, d2: boolean) {
        const d = this.squareDistance(pt1, pt2);
        let anchorDist = Math.sqrt(d) / 2;
        let cp1 = new Point(pt1.x + (d1 ? anchorDist : -anchorDist), pt1.y);
        let cp2 = new Point(pt2.x - (d2 ? -anchorDist : anchorDist), pt2.y);
        ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, pt2.x, pt2.y);
    }
}
