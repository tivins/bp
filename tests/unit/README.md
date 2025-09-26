# BP Unit Tests

This folder contains unit tests for the BP project, using Jest as the testing framework.

## Structure

```
tests/unit/
├── math/                    # Mathematical utilities tests
│   ├── Point.test.ts       # Point class tests
│   ├── Size.test.ts        # Size class tests
│   ├── Bounds.test.ts      # Bounds class tests
│   └── Geom.test.ts        # Geom class tests
├── BPNode.test.ts          # BPNode class tests
├── Blueprint.test.ts       # Blueprint class tests
├── API.test.ts             # API class tests
├── UID.test.ts             # UID class tests
└── simple.test.ts          # Basic test to verify Jest
```

## Commands

### Run all unit tests
```bash
npm run test:unit
```

### Run tests in watch mode
```bash
npm run test:unit:watch
```

### Run with code coverage
```bash
npm run test:unit:coverage
```

### Run all tests (unit + integration)
```bash
npm run test:all
```

## Code Coverage

Unit tests currently cover:

### ✅ Tested Classes
- **Point** : Constructor, manipulation methods, chaining
- **Size** : Constructor, manipulation methods, chaining
- **Bounds** : Constructor, bounds copying, edge cases
- **Geom** : Distance calculations, Bézier curves
- **UID** : Unique ID generation, global management, reset
- **BPNode** : Position, anchors, validation, serialization
- **Blueprint** : Node management, links, validation, bounds
- **API** : HTTP requests, token management, error handling

### 🎯 Coverage Goals
- **Code lines** : > 80%
- **Branches** : > 75%
- **Functions** : > 90%
- **Classes** : > 85%

## Testing Strategy

### 1. Mathematical Utilities Tests
- Constructor tests with different parameters
- Manipulation method tests (set, add, fromCoordinate)
- Method chaining tests
- Edge case tests (negative values, zero, decimals)

### 2. Main Classes Tests
- Creation and initialization tests
- Properties and getters/setters tests
- Public methods tests
- Error handling tests
- Serialization tests (toJSON)

### 3. Integration Tests
- Inter-class interaction tests
- Callback and event tests
- Cross-validation tests

## Mocks and Stubs

### Canvas Mock
To test classes that depend on Canvas, we use a mock:
```typescript
class MockCanvasBP {
  selectedNodes: BPNode[] = [];
  ctx = { /* mock context */ };
  // ... other mocked properties
}
```

### localStorage Mock
To test the API class:
```typescript
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  // ...
};
```

### fetch Mock
To test HTTP requests:
```typescript
global.fetch = jest.fn();
```

## Best Practices

### 1. Test Naming
- Use clear descriptions: `should return correct position for left anchor`
- Group tests by functionality with `describe`
- Use `test` or `it` for individual cases

### 2. Test Structure
```typescript
describe('ClassName', () => {
  describe('methodName', () => {
    test('should do something specific', () => {
      // Arrange
      const instance = new ClassName();
      
      // Act
      const result = instance.methodName();
      
      // Assert
      expect(result).toBe(expectedValue);
    });
  });
});
```

### 3. Setup and Cleanup
- Use `beforeEach` to reset state
- Use `afterEach` to clean up mocks
- Use `beforeAll`/`afterAll` for expensive operations

### 4. Assertions
- Prefer specific assertions: `toBe()` rather than `toEqual()`
- Test error cases with `toThrow()`
- Verify method calls with `toHaveBeenCalledWith()`

## Debugging

### Failing Tests
1. Check detailed error messages
2. Use `console.log` to debug
3. Verify mocks and their configurations
4. Ensure dependencies are correctly imported

### Slow Tests
1. Check timer mocks
2. Avoid unnecessary async operations
3. Use `jest.runOnlyPendingTimers()` if needed

## Next Steps

1. **Canvas component tests** : Canvas, CanvasMap, CanvasBP
2. **Utility tests** : DOMUtil, BPColors, ContextMenu
3. **Integration tests** : Complete workflows
4. **Performance tests** : Execution time measurement
5. **Regression tests** : Modification validation

## CI/CD Integration

Unit tests are integrated into the development pipeline:
- Automatic execution on each commit
- Code coverage reporting
- Pull request validation
- Failure notifications