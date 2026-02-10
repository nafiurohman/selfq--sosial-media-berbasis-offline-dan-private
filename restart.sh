#!/bin/bash
echo "Cleaning cache..."
rm -rf node_modules/.vite
rm -rf dist
echo "Cache cleared!"
echo ""
echo "Please restart your dev server with: npm run dev"
