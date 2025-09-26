#!/bin/bash
# Bash script to run unit tests in WSL
# Usage: bash run-tests-wsl.sh

echo "🧪 Starting BP unit tests (WSL)..."
echo ""

# Check if Node.js is installed
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js version: $NODE_VERSION"
else
    echo "❌ Node.js not found. Please install Node.js."
    exit 1
fi

# Check if npm is installed
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm version: $NPM_VERSION"
else
    echo "❌ npm not found. Please install npm."
    exit 1
fi

echo ""

# Check dependencies
echo "📦 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "✅ node_modules found"
else
    echo "⚠️  Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

echo ""

# Check Jest configuration
echo "🔧 Checking Jest configuration..."
if [ -f "jest.config.cjs" ]; then
    echo "✅ jest.config.cjs found"
else
    echo "❌ jest.config.cjs missing"
    exit 1
fi

# Check test files
echo "📁 Checking test files..."
TEST_FILES=(
    "tests/unit/simple.test.ts"
    "tests/unit/math/Point.test.ts"
    "tests/unit/math/Size.test.ts"
    "tests/unit/math/Bounds.test.ts"
    "tests/unit/math/Geom.test.ts"
    "tests/unit/UID.test.ts"
    "tests/unit/BPNode.test.ts"
    "tests/unit/Blueprint.test.ts"
    "tests/unit/API.test.ts"
)

TEST_COUNT=0
for file in "${TEST_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
        ((TEST_COUNT++))
    else
        echo "  ❌ $file"
    fi
done

echo "📊 $TEST_COUNT test files found"
echo ""

# Run tests
echo "🚀 Running unit tests..."
echo ""

# Run Jest with configuration
npm run test:unit

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ All tests passed!"
else
    echo ""
    echo "❌ Some tests failed"
    echo "💡 Check the logs above for more details"
fi

echo ""
echo "🏁 Script completed"

