#!/bin/bash
# Save and push your work to GitHub
# Usage: ./save.sh "your message here"

MESSAGE="${1:-Update changes}"

echo "🔍 Checking for external changes..."

# Fetch remote changes without merging
git fetch origin main > /dev/null 2>&1

# Check if local branch is behind remote
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" != "$REMOTE" ]; then
    echo "⚠️  WARNING: There are new changes on GitHub!"
    echo ""
    echo "Please run this first to get them:"
    echo "  ./update.sh"
    echo ""
    echo "Then try saving again."
    exit 1
fi

echo "✅ No conflicts - saving your changes..."
git add -A

# Check if there are actually changes to commit
if git diff --cached --quiet; then
    echo "ℹ️  Nothing to save - no changes detected."
    exit 0
fi

git commit -m "$MESSAGE"
git push origin main

echo "✅ Done! Your work is saved."
