import { Size } from '../../../src/math/Size';

describe('Size', () => {
  describe('constructor', () => {
    test('should create size with width and height', () => {
      const size = new Size(100, 200);
      expect(size.width).toBe(100);
      expect(size.height).toBe(200);
    });
  });

  describe('fromSize', () => {
    test('should copy dimensions from another size', () => {
      const size = new Size(10, 20);
      const otherSize = new Size(100, 200);
      
      const result = size.fromSize(otherSize);
      
      expect(size.width).toBe(100);
      expect(size.height).toBe(200);
      expect(result).toBe(size); // Should return this for chaining
    });
  });

  describe('set', () => {
    test('should set new dimensions', () => {
      const size = new Size(10, 20);
      
      const result = size.set(300, 400);
      
      expect(size.width).toBe(300);
      expect(size.height).toBe(400);
      expect(result).toBe(size); // Should return this for chaining
    });

    test('should handle zero dimensions', () => {
      const size = new Size(100, 200);
      
      size.set(0, 0);
      
      expect(size.width).toBe(0);
      expect(size.height).toBe(0);
    });

    test('should handle negative dimensions', () => {
      const size = new Size(100, 200);
      
      size.set(-50, -75);
      
      expect(size.width).toBe(-50);
      expect(size.height).toBe(-75);
    });
  });

  describe('chaining', () => {
    test('should support method chaining', () => {
      const size = new Size(10, 20);
      
      const result = size
        .set(100, 200)
        .fromSize(new Size(50, 75));
      
      expect(size.width).toBe(50);
      expect(size.height).toBe(75);
      expect(result).toBe(size);
    });
  });
});
