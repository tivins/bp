import { Bounds } from '../../../src/math/Bounds';

describe('Bounds', () => {
  describe('constructor', () => {
    test('should create bounds with default values', () => {
      const bounds = new Bounds();
      expect(bounds.x1).toBe(0);
      expect(bounds.y1).toBe(0);
      expect(bounds.x2).toBe(0);
      expect(bounds.y2).toBe(0);
    });

    test('should create bounds with specified coordinates', () => {
      const bounds = new Bounds(10, 20, 30, 40);
      expect(bounds.x1).toBe(10);
      expect(bounds.y1).toBe(20);
      expect(bounds.x2).toBe(30);
      expect(bounds.y2).toBe(40);
    });
  });

  describe('fromBounds', () => {
    test('should copy coordinates from another bounds', () => {
      const bounds = new Bounds(1, 2, 3, 4);
      const otherBounds = new Bounds(10, 20, 30, 40);
      
      bounds.fromBounds(otherBounds);
      
      expect(bounds.x1).toBe(10);
      expect(bounds.y1).toBe(20);
      expect(bounds.x2).toBe(30);
      expect(bounds.y2).toBe(40);
    });

    test('should handle negative coordinates', () => {
      const bounds = new Bounds(0, 0, 0, 0);
      const otherBounds = new Bounds(-10, -20, -5, -15);
      
      bounds.fromBounds(otherBounds);
      
      expect(bounds.x1).toBe(-10);
      expect(bounds.y1).toBe(-20);
      expect(bounds.x2).toBe(-5);
      expect(bounds.y2).toBe(-15);
    });
  });

  describe('edge cases', () => {
    test('should handle same coordinates', () => {
      const bounds = new Bounds(5, 5, 5, 5);
      expect(bounds.x1).toBe(5);
      expect(bounds.y1).toBe(5);
      expect(bounds.x2).toBe(5);
      expect(bounds.y2).toBe(5);
    });

    test('should handle zero bounds', () => {
      const bounds = new Bounds(0, 0, 0, 0);
      expect(bounds.x1).toBe(0);
      expect(bounds.y1).toBe(0);
      expect(bounds.x2).toBe(0);
      expect(bounds.y2).toBe(0);
    });
  });
});
