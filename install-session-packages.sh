#!/bin/bash

echo "🔧 Installing session and cookie management packages..."

# Backend packages
echo "📦 Installing backend packages..."
cd backend
npm install connect-mongo express-session cookie-parser

# Frontend packages (if needed)
echo "📦 Installing frontend packages..."
cd ../frontend
npm install js-cookie

echo "✅ All packages installed successfully!"
echo ""
echo "📋 Installed packages:"
echo "Backend:"
echo "  - connect-mongo (MongoDB session store)"
echo "  - express-session (session middleware)"
echo "  - cookie-parser (cookie parsing)"
echo ""
echo "Frontend:"
echo "  - js-cookie (cookie utilities - optional, we have custom utils)"
echo ""
echo "🚀 You can now use the enhanced session and cookie management!"