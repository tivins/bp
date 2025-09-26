# PowerShell script to run unit tests
# Usage: .\run-tests.ps1

Write-Host "🧪 Starting BP unit tests..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found. Please install npm." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check dependencies
Write-Host "📦 Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✅ node_modules found" -ForegroundColor Green
} else {
    Write-Host "⚠️  Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# Check Jest configuration
Write-Host "🔧 Checking Jest configuration..." -ForegroundColor Yellow
if (Test-Path "jest.config.cjs") {
    Write-Host "✅ jest.config.cjs found" -ForegroundColor Green
} else {
    Write-Host "❌ jest.config.cjs missing" -ForegroundColor Red
    exit 1
}

# Check test files
Write-Host "📁 Checking test files..." -ForegroundColor Yellow
$testFiles = @(
    "tests/unit/simple.test.ts",
    "tests/unit/math/Point.test.ts",
    "tests/unit/math/Size.test.ts",
    "tests/unit/math/Bounds.test.ts",
    "tests/unit/math/Geom.test.ts",
    "tests/unit/UID.test.ts",
    "tests/unit/BPNode.test.ts",
    "tests/unit/Blueprint.test.ts",
    "tests/unit/API.test.ts"
)

$testCount = 0
foreach ($file in $testFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
        $testCount++
    } else {
        Write-Host "  ❌ $file" -ForegroundColor Red
    }
}

Write-Host "📊 $testCount test files found" -ForegroundColor Cyan
Write-Host ""

# Run tests
Write-Host "🚀 Running unit tests..." -ForegroundColor Green
Write-Host ""

try {
    # Run Jest with configuration
    npm run test:unit
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ All tests passed!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "❌ Some tests failed" -ForegroundColor Red
        Write-Host "💡 Check the logs above for more details" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error running tests: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🏁 Script completed" -ForegroundColor Cyan

