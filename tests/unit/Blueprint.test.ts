import { Blueprint } from '../../src/Blueprint';
import { BPNode } from '../../src/BPNode';
import { Point } from '../../src/math/Point';
import { Bounds } from '../../src/math/Bounds';
import { BPAnchorID } from '../../src/BPAnchorID';
import { BPAnchorLink } from '../../src/BPAnchorLink';

// Mock console.debug to avoid noise in tests
const originalConsoleDebug = console.debug;
beforeAll(() => {
  console.debug = jest.fn();
});

afterAll(() => {
  console.debug = originalConsoleDebug;
});

describe('Blueprint', () => {
  let blueprint: Blueprint;
  let node1: BPNode;
  let node2: BPNode;

  beforeEach(() => {
    blueprint = new Blueprint();
    node1 = new BPNode();
    node2 = new BPNode();
  });

  describe('constructor and initialization', () => {
    test('should initialize with default values', () => {
      expect(blueprint.id).toBe(0);
      expect(blueprint.nodes).toEqual([]);
      expect(blueprint.links).toEqual([]);
      expect(blueprint.errors).toEqual([]);
    });
  });

  describe('addNode', () => {
    test('should add node with position', () => {
      const position = new Point(100, 200);
      
      const result = blueprint.addNode(node1, position);
      
      expect(result).toBe(node1);
      expect(blueprint.nodes).toContain(node1);
      expect(node1.position.x).toBe(100);
      expect(node1.position.y).toBe(200);
    });

    test('should call onChange after adding node', () => {
      const onChangeSpy = jest.spyOn(blueprint, 'onChange');
      
      blueprint.addNode(node1, new Point(0, 0));
      
      expect(onChangeSpy).toHaveBeenCalledTimes(1);
    });

    test('should add multiple nodes', () => {
      blueprint.addNode(node1, new Point(0, 0));
      blueprint.addNode(node2, new Point(100, 100));
      
      expect(blueprint.nodes).toHaveLength(2);
      expect(blueprint.nodes).toContain(node1);
      expect(blueprint.nodes).toContain(node2);
    });
  });

  describe('deleteNode', () => {
    beforeEach(() => {
      blueprint.addNode(node1, new Point(0, 0));
      blueprint.addNode(node2, new Point(100, 100));
    });

    test('should delete existing node', () => {
      const result = blueprint.deleteNode(node1);
      
      expect(result).toBe(true);
      expect(blueprint.nodes).not.toContain(node1);
      expect(blueprint.nodes).toContain(node2);
    });

    test('should return false for non-existent node', () => {
      const nonExistentNode = new BPNode();
      const result = blueprint.deleteNode(nonExistentNode);
      
      expect(result).toBe(false);
      expect(blueprint.nodes).toHaveLength(2);
    });

    test('should call onChange after deleting node', () => {
      const onChangeSpy = jest.spyOn(blueprint, 'onChange');
      
      blueprint.deleteNode(node1);
      
      expect(onChangeSpy).toHaveBeenCalledTimes(1);
    });

    test('should clean up links when deleting node', () => {
      // Add anchors to nodes
      node1.anchors.right = { output: { label: 'out', type: 'string', value: undefined, editable: true } };
      node2.anchors.left = { input: { label: 'in', type: 'string', value: undefined, editable: true } };
      
      // Create a link
      const anchorA = new BPAnchorID(node1, 'right', 'output');
      const anchorB = new BPAnchorID(node2, 'left', 'input');
      blueprint.link(anchorA, anchorB);
      
      expect(blueprint.links).toHaveLength(1);
      
      // Delete node1 should remove the link
      blueprint.deleteNode(node1);
      
      expect(blueprint.links).toHaveLength(0);
    });
  });

  describe('getLinksOf', () => {
    beforeEach(() => {
      blueprint.addNode(node1, new Point(0, 0));
      blueprint.addNode(node2, new Point(100, 100));
      
      // Add anchors
      node1.anchors.right = { output: { label: 'out', type: 'string', value: undefined, editable: true } };
      node2.anchors.left = { input: { label: 'in', type: 'string', value: undefined, editable: true } };
    });

    test('should return -1 for anchor with no links', () => {
      const anchorID = new BPAnchorID(node1, 'right', 'output');
      const index = blueprint.getLinksOf(anchorID);
      
      expect(index).toBe(-1);
    });

    test('should return correct index for linked anchor', () => {
      const anchorA = new BPAnchorID(node1, 'right', 'output');
      const anchorB = new BPAnchorID(node2, 'left', 'input');
      blueprint.link(anchorA, anchorB);
      
      const indexA = blueprint.getLinksOf(anchorA);
      const indexB = blueprint.getLinksOf(anchorB);
      
      expect(indexA).toBe(0);
      expect(indexB).toBe(0);
    });
  });

  describe('link', () => {
    beforeEach(() => {
      blueprint.addNode(node1, new Point(0, 0));
      blueprint.addNode(node2, new Point(100, 100));
      
      // Add anchors
      node1.anchors.right = { output: { label: 'out', type: 'string', value: undefined, editable: true } };
      node2.anchors.left = { input: { label: 'in', type: 'string', value: undefined, editable: true } };
    });

    test('should create link between anchors', () => {
      const anchorA = new BPAnchorID(node1, 'right', 'output');
      const anchorB = new BPAnchorID(node2, 'left', 'input');
      
      const link = blueprint.link(anchorA, anchorB);
      
      expect(link).toBeInstanceOf(BPAnchorLink);
      expect(blueprint.links).toHaveLength(1);
      expect(blueprint.links[0]).toBe(link);
    });

    test('should call onLink on both nodes', () => {
      const onLinkSpy1 = jest.spyOn(node1, 'onLink');
      const onLinkSpy2 = jest.spyOn(node2, 'onLink');
      
      const anchorA = new BPAnchorID(node1, 'right', 'output');
      const anchorB = new BPAnchorID(node2, 'left', 'input');
      
      blueprint.link(anchorA, anchorB);
      
      expect(onLinkSpy1).toHaveBeenCalledWith(anchorB);
      expect(onLinkSpy2).toHaveBeenCalledWith(anchorA);
    });

    test('should call onChange after linking', () => {
      const onChangeSpy = jest.spyOn(blueprint, 'onChange');
      
      const anchorA = new BPAnchorID(node1, 'right', 'output');
      const anchorB = new BPAnchorID(node2, 'left', 'input');
      
      blueprint.link(anchorA, anchorB);
      
      expect(onChangeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('unlink', () => {
    beforeEach(() => {
      blueprint.addNode(node1, new Point(0, 0));
      blueprint.addNode(node2, new Point(100, 100));
      
      // Add anchors
      node1.anchors.right = { output: { label: 'out', type: 'string', value: undefined, editable: true } };
      node2.anchors.left = { input: { label: 'in', type: 'string', value: undefined, editable: true } };
    });

    test('should remove existing link', () => {
      const anchorA = new BPAnchorID(node1, 'right', 'output');
      const anchorB = new BPAnchorID(node2, 'left', 'input');
      blueprint.link(anchorA, anchorB);
      
      expect(blueprint.links).toHaveLength(1);
      
      blueprint.unlink(anchorA);
      
      expect(blueprint.links).toHaveLength(0);
    });

    test('should call onUnlink on both nodes', () => {
      const onUnlinkSpy1 = jest.spyOn(node1, 'onUnlink');
      const onUnlinkSpy2 = jest.spyOn(node2, 'onUnlink');
      
      const anchorA = new BPAnchorID(node1, 'right', 'output');
      const anchorB = new BPAnchorID(node2, 'left', 'input');
      blueprint.link(anchorA, anchorB);
      
      blueprint.unlink(anchorA);
      
      expect(onUnlinkSpy1).toHaveBeenCalledWith(anchorB);
      expect(onUnlinkSpy2).toHaveBeenCalledWith(anchorA);
    });

    test('should call onChange after unlinking', () => {
      const onChangeSpy = jest.spyOn(blueprint, 'onChange');
      
      const anchorA = new BPAnchorID(node1, 'right', 'output');
      const anchorB = new BPAnchorID(node2, 'left', 'input');
      blueprint.link(anchorA, anchorB);
      
      blueprint.unlink(anchorA);
      
      expect(onChangeSpy).toHaveBeenCalledTimes(2); // addNode, link (unlink ne semble pas appeler onChange)
    });

    test('should handle unlinking non-existent link', () => {
      const anchorA = new BPAnchorID(node1, 'right', 'output');
      
      // Should not throw
      expect(() => {
        blueprint.unlink(anchorA);
      }).not.toThrow();
      
      expect(blueprint.links).toHaveLength(0);
    });
  });

  describe('checkValidity', () => {
    test('should clear errors and check all nodes', () => {
      blueprint.errors.push('old error');
      
      const checkValiditySpy1 = jest.spyOn(node1, 'checkValidity');
      const checkValiditySpy2 = jest.spyOn(node2, 'checkValidity');
      
      blueprint.addNode(node1, new Point(0, 0));
      blueprint.addNode(node2, new Point(100, 100));
      
      blueprint.checkValidity();
      
      expect(blueprint.errors).toEqual([]);
      expect(checkValiditySpy1).toHaveBeenCalledWith(blueprint);
      expect(checkValiditySpy2).toHaveBeenCalledWith(blueprint);
    });

    test('should collect errors from nodes', () => {
      node1.errors.push('node1 error');
      node2.errors.push('node2 error');
      
      blueprint.addNode(node1, new Point(0, 0));
      blueprint.addNode(node2, new Point(100, 100));
      
      blueprint.checkValidity();
      
      expect(blueprint.errors).toContain('node1 error');
      expect(blueprint.errors).toContain('node2 error');
    });
  });

  describe('isValid', () => {
    test('should return true when no errors', () => {
      expect(blueprint.isValid()).toBe(true);
    });

    test('should return false when has errors', () => {
      blueprint.errors.push('test error');
      expect(blueprint.isValid()).toBe(false);
    });
  });

  describe('getBounds', () => {
    test('should return empty bounds when no nodes', () => {
      const bounds = blueprint.getBounds();
      
      expect(bounds).toBeInstanceOf(Bounds);
      expect(bounds.x1).toBe(0);
      expect(bounds.y1).toBe(0);
      expect(bounds.x2).toBe(0);
      expect(bounds.y2).toBe(0);
    });

    test('should calculate bounds for single node', () => {
      blueprint.addNode(node1, new Point(100, 200));
      node1.size.set(150, 80);
      
      const bounds = blueprint.getBounds();
      
      expect(bounds.x1).toBe(100);
      expect(bounds.y1).toBe(200);
      expect(bounds.x2).toBe(250); // 100 + 150
      expect(bounds.y2).toBe(280); // 200 + 80
    });

    test('should calculate bounds for multiple nodes', () => {
      blueprint.addNode(node1, new Point(100, 200));
      node1.size.set(150, 80);
      
      blueprint.addNode(node2, new Point(50, 150));
      node2.size.set(200, 100);
      
      const bounds = blueprint.getBounds();
      
      expect(bounds.x1).toBe(50);  // min x
      expect(bounds.y1).toBe(150); // min y
      expect(bounds.x2).toBe(250); // max x + width
      expect(bounds.y2).toBe(280); // max y + height
    });

    test('should handle negative positions', () => {
      blueprint.addNode(node1, new Point(-50, -100));
      node1.size.set(100, 50);
      
      const bounds = blueprint.getBounds();
      
      expect(bounds.x1).toBe(-50);
      expect(bounds.y1).toBe(-100);
      expect(bounds.x2).toBe(50);  // -50 + 100
      expect(bounds.y2).toBe(-50); // -100 + 50
    });
  });
});
