import { Geom } from '../../../src/math/Geom';
import { Point } from '../../../src/math/Point';

describe('Geom', () => {
  describe('squareDistance', () => {
    test('should calculate square distance between two points', () => {
      const point1 = new Point(0, 0);
      const point2 = new Point(3, 4);
      
      const distance = Geom.squareDistance(point1, point2);
      
      expect(distance).toBe(25); // 3² + 4² = 9 + 16 = 25
    });

    test('should return 0 for same points', () => {
      const point1 = new Point(5, 10);
      const point2 = new Point(5, 10);
      
      const distance = Geom.squareDistance(point1, point2);
      
      expect(distance).toBe(0);
    });

    test('should handle negative coordinates', () => {
      const point1 = new Point(-2, -3);
      const point2 = new Point(1, 1);
      
      const distance = Geom.squareDistance(point1, point2);
      
      expect(distance).toBe(25); // (1-(-2))² + (1-(-3))² = 3² + 4² = 25
    });

    test('should handle decimal coordinates', () => {
      const point1 = new Point(1.5, 2.5);
      const point2 = new Point(4.5, 6.5);
      
      const distance = Geom.squareDistance(point1, point2);
      
      expect(distance).toBe(25); // (4.5-1.5)² + (6.5-2.5)² = 3² + 4² = 25
    });
  });

  describe('bezier', () => {
    let mockContext: jest.Mocked<CanvasRenderingContext2D>;

    beforeEach(() => {
      mockContext = {
        bezierCurveTo: jest.fn()
      } as any;
    });

    test('should call bezierCurveTo with correct parameters', () => {
      const pt1 = new Point(0, 0);
      const pt2 = new Point(100, 0);
      
      Geom.bezier(mockContext, pt1, pt2, true, true);
      
      expect(mockContext.bezierCurveTo).toHaveBeenCalledTimes(1);
      
      const [cp1x, cp1y, cp2x, cp2y, endX, endY] = mockContext.bezierCurveTo.mock.calls[0];
      
      expect(endX).toBe(100);
      expect(endY).toBe(0);
      expect(cp1x).toBeGreaterThan(0); // Control point 1 should be to the right
      expect(cp2x).toBeGreaterThan(0); // Control point 2 should also be to the right (d2=true)
    });

    test('should handle different direction flags', () => {
      const pt1 = new Point(0, 0);
      const pt2 = new Point(100, 0);
      
      Geom.bezier(mockContext, pt1, pt2, false, false);
      
      expect(mockContext.bezierCurveTo).toHaveBeenCalledTimes(1);
    });

    test('should calculate anchor distance based on point distance', () => {
      const pt1 = new Point(0, 0);
      const pt2 = new Point(200, 0);
      
      Geom.bezier(mockContext, pt1, pt2, true, true);
      
      const [cp1x, cp1y, cp2x, cp2y, endX, endY] = mockContext.bezierCurveTo.mock.calls[0];
      
      // Anchor distance should be half the distance between points
      const expectedAnchorDist = 100; // sqrt(200²) / 2 = 200 / 2 = 100
      expect(cp1x).toBe(expectedAnchorDist);
      expect(cp2x).toBe(200 + expectedAnchorDist); // d2=true, so it's pt2.x + anchorDist
    });

    test('should handle vertical points', () => {
      const pt1 = new Point(0, 0);
      const pt2 = new Point(0, 100);
      
      Geom.bezier(mockContext, pt1, pt2, true, true);
      
      expect(mockContext.bezierCurveTo).toHaveBeenCalledTimes(1);
      
      const [cp1x, cp1y, cp2x, cp2y, endX, endY] = mockContext.bezierCurveTo.mock.calls[0];
      
      // For vertical points, the control points should be offset horizontally
      const expectedAnchorDist = 50; // sqrt(100²) / 2 = 50
      expect(cp1x).toBe(expectedAnchorDist); // d1=true, so pt1.x + anchorDist
      expect(cp2x).toBe(expectedAnchorDist); // d2=true, so pt2.x + anchorDist
      expect(endX).toBe(0);
      expect(endY).toBe(100);
    });
  });
});
