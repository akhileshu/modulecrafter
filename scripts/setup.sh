#!/bin/bash

set -e # ⛔ Exit immediately if a command exits with a non-zero status

echo "📦 Installing dependencies..."
npm install

echo "⚙️ Performing Prebuild process..."
npx ts-node scripts/prebuild.ts

echo "⚙️ Building the project..."
npm run build

echo "🔐 Making CLI executable..."
chmod +x dist/index.js

echo "🔗 Linking the project globally..."
npm link

echo "✅ Setup complete!"
