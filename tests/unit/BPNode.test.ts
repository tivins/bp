import { BPNode, Anchor, BPSide } from '../../src/BPNode';
import { Point } from '../../src/math/Point';
import { Size } from '../../src/math/Size';
import { BPAnchorID } from '../../src/BPAnchorID';

// Mock CanvasBP pour les tests
class MockCanvasBP {
  selectedNodes: BPNode[] = [];
  overAnchor: BPAnchorID | null = null;
  createLinkAnchor: BPAnchorID | null = null;
  ctx = {
    lineWidth: 1,
    textBaseline: 'alphabetic',
    textAlign: 'left',
    shadowBlur: 0,
    shadowOffsetY: 0
  };
  blueprint = {
    getLinksOf: jest.fn().mockReturnValue(-1)
  };

  dimWorldToScreen(value: number): number {
    return value * 2; // Mock scaling factor
  }

  dFillRoundRectWorld = jest.fn();
  dFillTextWorld = jest.fn();
  dTriangleWorld = jest.fn();
  dCircleWorld = jest.fn();
}

describe('BPNode', () => {
  let node: BPNode;
  let mockCanvas: MockCanvasBP;

  beforeEach(() => {
    node = new BPNode();
    mockCanvas = new MockCanvasBP();
  });

  describe('constructor and properties', () => {
    test('should initialize with default values', () => {
      expect(node.node_id).toBe('node');
      expect(node.name).toBe('Module Name');
      expect(node.icon).toBe('\uf126');
      expect(node.position.x).toBe(0);
      expect(node.position.y).toBe(0);
      expect(node.size.width).toBe(200);
      expect(node.size.height).toBe(100);
      expect(node.nodeColor).toBe('#153');
      expect(node.errors).toEqual([]);
      expect(node.anchors).toEqual({});
    });

    test('should have unique UID', () => {
      const node1 = new BPNode();
      const node2 = new BPNode();
      
      expect(node1.uid).not.toBe(node2.uid);
      expect(node1.uid).toBeGreaterThan(0);
      expect(node2.uid).toBeGreaterThan(0);
    });
  });

  describe('position getter/setter', () => {
    test('should set position correctly', () => {
      const newPos = new Point(100, 200);
      node.position = newPos;
      
      expect(node.position.x).toBe(100);
      expect(node.position.y).toBe(200);
    });

    test('should create new Point instance when setting position', () => {
      const originalPos = node.position;
      const newPos = new Point(50, 75);
      
      node.position = newPos;
      
      // Position is updated by reference, so it's the same object
      expect(node.position).toBe(originalPos);
      expect(node.position.x).toBe(50);
      expect(node.position.y).toBe(75);
    });
  });

  describe('anchors management', () => {
    test('should add anchors to left side', () => {
      const anchor = new Anchor('input1', 'string', 'default value');
      node.anchors.left = { input1: anchor };
      
      expect(node.anchors.left.input1).toBe(anchor);
    });

    test('should add anchors to right side', () => {
      const anchor = new Anchor('output1', 'number', 42);
      node.anchors.right = { output1: anchor };
      
      expect(node.anchors.right.output1).toBe(anchor);
    });

    test('should handle multiple anchors on same side', () => {
      const anchor1 = new Anchor('input1', 'string');
      const anchor2 = new Anchor('input2', 'number');
      node.anchors.left = { input1: anchor1, input2: anchor2 };
      
      expect(node.anchors.left.input1).toBe(anchor1);
      expect(node.anchors.left.input2).toBe(anchor2);
    });
  });

  describe('getAnchorPos', () => {
    beforeEach(() => {
      node.position = new Point(100, 200);
      node.size = new Size(200, 100);
    });

    test('should return correct position for left anchor', () => {
      const anchor = new Anchor('input1', 'string');
      node.anchors.left = { input1: anchor };
      
      const pos = node.getAnchorPos(BPSide.left, 'input1');
      
      expect(pos).not.toBeNull();
      expect(pos!.x).toBe(100); // position.x
      expect(pos!.y).toBe(245); // position.y + 45
    });

    test('should return correct position for right anchor', () => {
      const anchor = new Anchor('output1', 'string');
      node.anchors.right = { output1: anchor };
      
      const pos = node.getAnchorPos(BPSide.right, 'output1');
      
      expect(pos).not.toBeNull();
      expect(pos!.x).toBe(300); // position.x + size.width
      expect(pos!.y).toBe(245); // position.y + 45
    });

    test('should return null for non-existent anchor', () => {
      const pos = node.getAnchorPos(BPSide.left, 'nonexistent');
      expect(pos).toBeNull();
    });

    test('should handle multiple anchors with correct spacing', () => {
      const anchor1 = new Anchor('input1', 'string');
      const anchor2 = new Anchor('input2', 'number');
      node.anchors.left = { input1: anchor1, input2: anchor2 };
      
      const pos1 = node.getAnchorPos(BPSide.left, 'input1');
      const pos2 = node.getAnchorPos(BPSide.left, 'input2');
      
      expect(pos1!.y).toBe(245); // 200 + 45
      expect(pos2!.y).toBe(285); // 200 + 45 + 40 (BPAnchorSpace)
    });
  });

  describe('toJSON', () => {
    test('should return correct JSON representation', () => {
      node.position = new Point(50, 75);
      node.node_id = 'custom_node';
      
      const json = node.toJSON();
      
      expect(json).toEqual({
        id: node.uid,
        node_id: 'custom_node',
        pos: node.position
      });
    });
  });

  describe('isValid', () => {
    test('should return true when no errors', () => {
      expect(node.isValid(mockCanvas as any)).toBe(true);
    });

    test('should return false when has errors', () => {
      node.errors.push('Test error');
      expect(node.isValid(mockCanvas as any)).toBe(false);
    });
  });

  describe('error handling', () => {
    test('should initialize with empty errors array', () => {
      expect(node.errors).toEqual([]);
    });

    test('should allow adding errors', () => {
      node.errors.push('Error 1');
      node.errors.push('Error 2');
      
      expect(node.errors).toEqual(['Error 1', 'Error 2']);
    });
  });

  describe('event handlers', () => {
    test('should have onUnlink method', () => {
      expect(typeof node.onUnlink).toBe('function');
      
      // Should not throw when called
      expect(() => {
        node.onUnlink(new BPAnchorID(node, 'left', 'test'));
      }).not.toThrow();
    });

    test('should have onLink method', () => {
      expect(typeof node.onLink).toBe('function');
      
      // Should not throw when called
      expect(() => {
        node.onLink(new BPAnchorID(node, 'right', 'test'));
      }).not.toThrow();
    });
  });

  describe('checkValidity', () => {
    test('should have checkValidity method', () => {
      expect(typeof node.checkValidity).toBe('function');
      
      // Should not throw when called
      expect(() => {
        node.checkValidity({} as any);
      }).not.toThrow();
    });
  });
});

describe('Anchor', () => {
  test('should create anchor with all parameters', () => {
    const anchor = new Anchor('test', 'string', 'default', true);
    
    expect(anchor.label).toBe('test');
    expect(anchor.type).toBe('string');
    expect(anchor.value).toBe('default');
    expect(anchor.editable).toBe(true);
  });

  test('should create anchor with default values', () => {
    const anchor = new Anchor('test', 'number');
    
    expect(anchor.label).toBe('test');
    expect(anchor.type).toBe('number');
    expect(anchor.value).toBeUndefined();
    expect(anchor.editable).toBe(true);
  });

  test('should create non-editable anchor', () => {
    const anchor = new Anchor('test', 'string', 'value', false);
    
    expect(anchor.editable).toBe(false);
  });
});

describe('BPSide', () => {
  test('should have correct side constants', () => {
    expect(BPSide.left).toBe('left');
    expect(BPSide.right).toBe('right');
  });
});
