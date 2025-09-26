import { UID } from '../../src/UID';

describe('UID', () => {
  beforeEach(() => {
    UID.reset();
  });

  describe('constructor', () => {
    test('should assign unique IDs sequentially', () => {
      const uid1 = new UID();
      const uid2 = new UID();
      const uid3 = new UID();

      expect(uid1.uid).toBe(1);
      expect(uid2.uid).toBe(2);
      expect(uid3.uid).toBe(3);
    });

    test('should start from 1 after reset', () => {
      UID.reset();
      const uid = new UID();
      expect(uid.uid).toBe(1);
    });
  });

  describe('forceUID', () => {
    test('should set specific UID', () => {
      const uid = new UID();
      uid.forceUID(100);
      
      expect(uid.uid).toBe(100);
    });

    test('should update global UID counter when forced UID is higher', () => {
      const uid1 = new UID();
      const uid2 = new UID();
      
      uid1.forceUID(50);
      
      const uid3 = new UID();
      expect(uid3.uid).toBe(51);
    });

    test('should not update global UID counter when forced UID is lower', () => {
      const uid1 = new UID();
      const uid2 = new UID();
      
      uid1.forceUID(1); // Lower than current global counter
      
      const uid3 = new UID();
      expect(uid3.uid).toBe(3); // Should continue from previous global counter
    });

    test('should handle zero UID', () => {
      const uid = new UID();
      uid.forceUID(0);
      
      expect(uid.uid).toBe(0);
    });

    test('should handle negative UID', () => {
      const uid = new UID();
      uid.forceUID(-5);
      
      expect(uid.uid).toBe(-5);
    });
  });

  describe('reset', () => {
    test('should reset global UID counter to 0', () => {
      new UID(); // Creates UID with value 1
      new UID(); // Creates UID with value 2
      
      UID.reset();
      
      const uid = new UID();
      expect(uid.uid).toBe(1);
    });

    test('should work multiple times', () => {
      UID.reset();
      UID.reset();
      UID.reset();
      
      const uid = new UID();
      expect(uid.uid).toBe(1);
    });
  });

  describe('edge cases', () => {
    test('should handle very large UIDs', () => {
      const uid = new UID();
      uid.forceUID(Number.MAX_SAFE_INTEGER);
      
      expect(uid.uid).toBe(Number.MAX_SAFE_INTEGER);
    });

    test('should maintain uniqueness after forceUID', () => {
      const uid1 = new UID();
      const uid2 = new UID();
      
      uid1.forceUID(1000);
      
      const uid3 = new UID();
      const uid4 = new UID();
      
      expect(uid1.uid).toBe(1000);
      expect(uid2.uid).toBe(2);
      expect(uid3.uid).toBe(1001);
      expect(uid4.uid).toBe(1002);
    });
  });
});
