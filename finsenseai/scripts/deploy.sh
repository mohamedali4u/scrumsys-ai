#!/bin/bash

# AI Agent Widget Deployment Script
set -e

echo "🚀 Starting AI Agent Widget Deployment..."

# Check if required tools are installed
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Aborting." >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed. Aborting." >&2; exit 1; }

# Get deployment target from argument
DEPLOY_TARGET=${1:-"netlify"}

echo "📦 Installing dependencies..."
npm ci

echo "🧪 Running tests..."
npm run lint

echo "🏗️  Building widget for production..."
npm run build:widget

echo "📊 Analyzing bundle size..."
if command -v bundlesize >/dev/null 2>&1; then
    npx bundlesize
else
    echo "⚠️  bundlesize not found, skipping bundle analysis"
fi

echo "✅ Build completed successfully!"
echo "📁 Built files are in the 'dist' directory:"
ls -la dist/

case $DEPLOY_TARGET in
    "netlify")
        echo "🌐 Deploying to Netlify..."
        if command -v netlify >/dev/null 2>&1; then
            netlify deploy --prod --dir dist
        else
            echo "📋 Netlify CLI not found. Manual deployment steps:"
            echo "1. Go to https://app.netlify.com"
            echo "2. Drag and drop the 'dist' folder"
            echo "3. Or connect your Git repository"
        fi
        ;;
    "vercel")
        echo "▲ Deploying to Vercel..."
        if command -v vercel >/dev/null 2>&1; then
            vercel --prod
        else
            echo "📋 Vercel CLI not found. Install with: npm i -g vercel"
        fi
        ;;
    "docker")
        echo "🐳 Building Docker image..."
        docker build -f docker/Dockerfile -t ai-agent-widget .
        echo "✅ Docker image built successfully!"
        echo "🚀 To run: docker run -p 80:80 ai-agent-widget"
        ;;
    "s3")
        echo "☁️  Deploying to AWS S3..."
        if command -v aws >/dev/null 2>&1; then
            read -p "Enter S3 bucket name: " BUCKET_NAME
            aws s3 sync dist/ s3://$BUCKET_NAME --delete
            echo "✅ Deployed to S3 bucket: $BUCKET_NAME"
        else
            echo "📋 AWS CLI not found. Install and configure AWS CLI first."
        fi
        ;;
    *)
        echo "❓ Unknown deployment target: $DEPLOY_TARGET"
        echo "📋 Available targets: netlify, vercel, docker, s3"
        echo "📁 Built files are ready in 'dist' directory for manual deployment"
        ;;
esac

echo ""
echo "🎉 Deployment process completed!"
echo ""
echo "📋 Next steps:"
echo "1. Test the deployed widget"
echo "2. Update integration documentation with new URLs"
echo "3. Notify integration partners"
echo ""
echo "🔗 Integration examples:"
echo "Script tag: <script src=\"YOUR_CDN_URL/widget.umd.cjs\" data-ai-widget></script>"
echo "ES module: import { AIWidget } from 'YOUR_CDN_URL/widget.js'"
echo "Iframe: <iframe src=\"YOUR_DOMAIN/chat\"></iframe>"