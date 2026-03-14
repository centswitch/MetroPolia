#!/bin/bash
# Get the latest changes from GitHub
# This keeps your project up to date

echo "📥 Getting the latest changes..."
git pull --rebase origin main

echo "✅ All up to date!"
