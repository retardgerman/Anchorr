#!/bin/bash
# Fork Synchronization Script
# This script completes the synchronization of retardgerman/Anchorr with nairdahh/Anchorr

set -e  # Exit on error

echo "=========================================="
echo "Fork Synchronization Script"
echo "=========================================="
echo ""
echo "This script will:"
echo "  1. Checkout the main branch"
echo "  2. Force-push to origin/main"
echo ""
echo "⚠️  WARNING: This is a force-push operation!"
echo "   Any commits on origin/main not in upstream will be lost."
echo ""
read -p "Do you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Synchronization cancelled."
    exit 0
fi

echo ""
echo "Switching to main branch..."
git checkout main

echo ""
echo "Current status:"
echo "  Local main: $(git rev-parse HEAD)"
echo "  Origin main: $(git rev-parse origin/main)"
echo "  Upstream main: $(git rev-parse upstream/main)"

echo ""
echo "Force-pushing to origin/main..."
git push --force origin main

echo ""
echo "=========================================="
echo "✅ Synchronization complete!"
echo "=========================================="
echo ""
echo "Verifying..."
git fetch origin

if [ "$(git rev-parse origin/main)" == "$(git rev-parse upstream/main)" ]; then
    echo "✅ SUCCESS: Your fork's main branch is now identical to upstream!"
    echo ""
    echo "Current state:"
    git log --oneline origin/main -3
else
    echo "⚠️  WARNING: Verification failed. Please check the state manually."
    exit 1
fi
