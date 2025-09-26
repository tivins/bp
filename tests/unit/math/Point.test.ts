import { Point } from '../../../src/math/Point';

describe('Point', () => {
  describe('constructor', () => {
    test('should create point with x and y coordinates', () => {
      const point = new Point(10, 20);
      expect(point.x).toBe(10);
      expect(point.y).toBe(20);
    });

    test('should create point with default values', () => {
      const point = new Point();
      expect(point.x).toBe(0);
      expect(point.y).toBe(0);
    });

    test('should create point from another Point instance', () => {
      const originalPoint = new Point(5, 15);
      const newPoint = new Point(originalPoint);
      expect(newPoint.x).toBe(5);
      expect(newPoint.y).toBe(15);
    });
  });

  describe('fromCoordinate', () => {
    test('should copy coordinates from another point', () => {
      const point = new Point(1, 2);
      const otherPoint = new Point(10, 20);
      
      const result = point.fromCoordinate(otherPoint);
      
      expect(point.x).toBe(10);
      expect(point.y).toBe(20);
      expect(result).toBe(point); // Should return this for chaining
    });
  });

  describe('set', () => {
    test('should set new coordinates', () => {
      const point = new Point(1, 2);
      
      const result = point.set(30, 40);
      
      expect(point.x).toBe(30);
      expect(point.y).toBe(40);
      expect(result).toBe(point); // Should return this for chaining
    });
  });

  describe('add', () => {
    test('should add another point coordinates', () => {
      const point = new Point(10, 20);
      const otherPoint = new Point(5, 15);
      
      const result = point.add(otherPoint);
      
      expect(point.x).toBe(15);
      expect(point.y).toBe(35);
      expect(result).toBe(point); // Should return this for chaining
    });

    test('should handle negative coordinates', () => {
      const point = new Point(10, 20);
      const otherPoint = new Point(-5, -15);
      
      point.add(otherPoint);
      
      expect(point.x).toBe(5);
      expect(point.y).toBe(5);
    });
  });

  describe('chaining', () => {
    test('should support method chaining', () => {
      const point = new Point(1, 2);
      
      const result = point
        .set(10, 20)
        .add(new Point(5, 5));
      
      expect(point.x).toBe(15);
      expect(point.y).toBe(25);
      expect(result).toBe(point);
    });
  });
});
