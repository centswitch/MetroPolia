#!/bin/bash
# Get the latest changes from GitHub
# This keeps your project up to date

git add .
git stash

echo "📥 Getting the latest changes..."
git pull --rebase origin main

git stash pop

echo "✅ All up to date!"
