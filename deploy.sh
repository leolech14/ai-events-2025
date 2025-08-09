#!/bin/bash

echo "Building Next.js app..."
npm run build

echo "Copying build output to root..."
cp -r out/* .

echo "Adding files to git..."
git add -A

echo "Committing deployment files..."
git commit -m "Deploy: Update static files from Next.js build"

echo "Pushing to GitHub..."
git push

echo "✅ Deployment complete! Site will be live at https://finally.gold in a few minutes."