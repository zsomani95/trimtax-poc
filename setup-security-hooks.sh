#!/bin/bash
# TrimTax Security Hooks Setup
# Run this script to install security pre-commit hooks
# Usage: bash setup-security-hooks.sh

echo "🔐 TrimTax Security Hooks Setup"
echo "==============================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not in a git repository. Run this from the project root."
    exit 1
fi

HOOKS_DIR=".git/hooks"

echo "Installing pre-commit hook..."

# Create hooks directory if it doesn't exist
mkdir -p "$HOOKS_DIR"

# Copy pre-commit hook
if [ -f "pre-commit" ]; then
    cp "pre-commit" "$HOOKS_DIR/pre-commit"
    chmod +x "$HOOKS_DIR/pre-commit"
    echo "✓ Pre-commit hook installed at $HOOKS_DIR/pre-commit"
else
    echo "⚠ pre-commit file not found in current directory"
    echo "  Make sure you're running this from the project root"
    exit 1
fi

# Configure git to use hooks
git config core.hooksPath ".git/hooks"
echo "✓ Git configured to use hooks"

echo ""
echo "✅ Security hooks installed successfully!"
echo ""
echo "What's now protected:"
echo "  • .env files cannot be committed"
echo "  • API keys and secrets cannot be committed"
echo "  • Database passwords cannot be committed"
echo "  • AWS credentials cannot be committed"
echo "  • Firebase configs cannot be committed"
echo ""
echo "To test the hook:"
echo "  1. Try: echo 'DATABASE_URL=postgres://user:password@host' > test.txt"
echo "  2. Try: git add test.txt"
echo "  3. Try: git commit -m 'test'"
echo "  4. The commit should be blocked"
echo "  5. Clean up: git reset HEAD test.txt && rm test.txt"
echo ""
echo "To bypass (only in emergencies):"
echo "  git commit --no-verify"
echo ""
