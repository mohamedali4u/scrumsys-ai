# AI Agent Widget Deployment Guide

This guide provides step-by-step instructions for deploying the AI Agent Widget as a standalone embeddable component that can be integrated into any website.

## Table of Contents
1. [Build Process](#build-process)
2. [Deployment Options](#deployment-options)
3. [CDN Setup](#cdn-setup)
4. [Integration Methods](#integration-methods)
5. [Configuration](#configuration)
6. [Testing](#testing)
7. [Production Checklist](#production-checklist)

## Build Process

### Step 1: Prepare for Production Build
```bash
# Install dependencies
npm install

# Run tests (if available)
npm test

# Build the widget for production
npm run build:widget
```

### Step 2: Verify Build Output
After building, check the `dist/` directory for these files:
- `widget.js` - ES module version
- `widget.umd.cjs` - UMD version for script tags
- `widget.d.ts` - TypeScript definitions
- `style.css` - Bundled styles

## Deployment Options

### Option 1: CDN Deployment (Recommended)

#### Using Netlify
1. **Build the project:**
   ```bash
   npm run build:widget
   ```

2. **Deploy to Netlify:**
   - Drag and drop the `dist/` folder to Netlify
   - Or connect your GitHub repository
   - Set build command: `npm run build:widget`
   - Set publish directory: `dist`

3. **Configure custom domain (optional):**
   - Go to Domain settings in Netlify
   - Add your custom domain (e.g., `widget.yourcompany.com`)

#### Using Vercel
1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   npm run build:widget
   vercel --prod
   ```

#### Using AWS S3 + CloudFront
1. **Build and upload to S3:**
   ```bash
   npm run build:widget
   aws s3 sync dist/ s3://your-widget-bucket --delete
   ```

2. **Configure CloudFront distribution:**
   - Origin: Your S3 bucket
   - Behaviors: Cache CSS/JS files with long TTL
   - Custom domain: widget.yourcompany.com

### Option 2: Self-Hosted Deployment

#### Using Docker
1. **Create Dockerfile:**
   ```dockerfile
   FROM nginx:alpine
   COPY dist/ /usr/share/nginx/html/
   COPY nginx.conf /etc/nginx/nginx.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Build and run:**
   ```bash
   docker build -t ai-widget .
   docker run -p 80:80 ai-widget
   ```

#### Using Node.js Server
1. **Create server.js:**
   ```javascript
   const express = require('express');
   const path = require('path');
   const app = express();
   
   app.use(express.static('dist'));
   app.use((req, res, next) => {
     res.header('Access-Control-Allow-Origin', '*');
     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
     next();
   });
   
   const PORT = process.env.PORT || 3000;
   app.listen(PORT, () => {
     console.log(`Widget server running on port ${PORT}`);
   });
   ```

2. **Deploy:**
   ```bash
   npm run build:widget
   node server.js
   ```

## CDN Setup

### Step 1: Upload Files
Upload these files to your CDN:
- `widget.js` (or `widget.umd.cjs` for script tag usage)
- `widget.css` (if styles are separate)
- `embed.js` (for easy script tag integration)

### Step 2: Configure CORS
Ensure your CDN/server allows cross-origin requests:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### Step 3: Set Cache Headers
Configure appropriate cache headers:
```
Cache-Control: public, max-age=31536000  # 1 year for versioned files
Cache-Control: public, max-age=300       # 5 minutes for embed.js
```

## Integration Methods

### Method 1: Script Tag Embedding (Easiest)

**Basic Integration:**
```html
<script src="https://your-cdn.com/widget.umd.cjs" 
        data-ai-widget
        data-api-key="your-api-key"
        data-theme="light"
        data-position="bottom-right"
        data-company-name="Your Company"
        data-welcome-message="Hello! How can I help you today?">
</script>
```

**Advanced Integration:**
```html
<script>
  window.AIWidgetConfig = {
    apiKey: 'your-api-key',
    theme: 'light',
    position: 'bottom-right',
    companyName: 'Your Company',
    welcomeMessage: 'Hello! How can I help you today?',
    primaryColor: '#2563EB'
  };
</script>
<script src="https://your-cdn.com/widget.umd.cjs"></script>
```

### Method 2: React SDK Integration

**Installation:**
```bash
npm install ai-agent-widget
```

**Usage:**
```jsx
import { AIWidget } from 'ai-agent-widget';

function App() {
  return (
    <div>
      <AIWidget config={{
        apiKey: 'your-api-key',
        theme: 'light',
        position: 'bottom-right',
        companyName: 'Your Company',
        welcomeMessage: 'Hello! How can I help you today?'
      }} />
    </div>
  );
}
```

### Method 3: Angular Integration

The AI Agent Widget can be integrated into Angular applications using multiple approaches. Choose the method that best fits your project structure and requirements.

#### Option A: Script Tag Integration (Recommended for Quick Setup)

**Step 1: Add Script to index.html**
```html
<!-- src/index.html -->
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Your Angular App</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root></app-root>
  
  <!-- AI Widget Script -->
  <script>
    window.AIWidgetConfig = {
      apiKey: 'demo-key',
      theme: 'light',
      position: 'bottom-right',
      size: 'standard',
      companyName: 'FinSense AI',
      welcomeMessage: 'Hello! How can I help you with your finances today?'
    };
  </script>
  <script src="http://localhost:5173/dist/widget.umd.cjs"></script>
</body>
</html>
```

**Step 2: Configure Widget (Optional)**
Create a service to manage widget configuration:

```typescript
// src/app/services/ai-widget.service.ts
import { Injectable } from '@angular/core';

declare global {
  interface Window {
    AIAgentWidget: {
      init: (config: any) => any;
      destroy: () => void;
    };
  }
}

@Injectable({
  providedIn: 'root'
})
export class AiWidgetService {
  private widgetInstance: any = null;

  initWidget(config: any) {
    if (typeof window !== 'undefined' && window.AIAgentWidget) {
      this.widgetInstance = window.AIAgentWidget.init(config);
    }
  }

  destroyWidget() {
    if (typeof window !== 'undefined' && window.AIAgentWidget) {
      window.AIAgentWidget.destroy();
      this.widgetInstance = null;
    }
  }

  updateConfig(config: any) {
    if (this.widgetInstance) {
      this.destroyWidget();
      this.initWidget(config);
    }
  }
}
```

#### Option B: Dynamic Script Loading

**Step 1: Create Widget Component**
```typescript
// src/app/components/ai-widget/ai-widget.component.ts
import { Component, Input, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface WidgetConfig {
  apiKey?: string;
  theme?: 'light' | 'dark';
  position?: 'bottom-right' | 'bottom-left';
  size?: 'compact' | 'standard' | 'large' | 'custom';
  companyName?: string;
  welcomeMessage?: string;
  primaryColor?: string;
}

declare global {
  interface Window {
    AIAgentWidget: {
      init: (config: WidgetConfig) => any;
      destroy: () => void;
    };
  }
}

@Component({
  selector: 'app-ai-widget',
  template: `<!-- Widget will be injected by script -->`,
  styleUrls: ['./ai-widget.component.css']
})
export class AiWidgetComponent implements OnInit, OnDestroy {
  @Input() config: WidgetConfig = {
    apiKey: 'your-api-key',
    theme: 'light',
    position: 'bottom-right',
    size: 'standard',
    companyName: 'Your Company'
  };

  private widgetInstance: any = null;
  private scriptLoaded = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadWidget();
    }
  }

  ngOnDestroy() {
    this.destroyWidget();
  }

  private async loadWidget() {
    try {
      if (!this.scriptLoaded) {
        await this.loadScript('https://your-cdn.com/widget.umd.cjs');
        this.scriptLoaded = true;
      }
      
      if (window.AIAgentWidget) {
        this.widgetInstance = window.AIAgentWidget.init(this.config);
      }
    } catch (error) {
      console.error('Failed to load AI Widget:', error);
    }
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }

  private destroyWidget() {
    if (isPlatformBrowser(this.platformId) && window.AIAgentWidget) {
      window.AIAgentWidget.destroy();
      this.widgetInstance = null;
    }
  }

  updateConfig(newConfig: Partial<WidgetConfig>) {
    this.config = { ...this.config, ...newConfig };
    if (this.widgetInstance) {
      this.destroyWidget();
      this.loadWidget();
    }
  }
}
```

**Step 2: Add Component Styles**
```css
/* src/app/components/ai-widget/ai-widget.component.css */
:host {
  display: block;
}

/* Ensure widget doesn't interfere with Angular routing */
:host ::ng-deep #ai-agent-widget {
  position: fixed;
  z-index: 9999;
}
```

**Step 3: Use in Your Components**
```typescript
// src/app/app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <!-- Your app content -->
      <router-outlet></router-outlet>
      
      <!-- AI Widget -->
      <app-ai-widget [config]="widgetConfig"></app-ai-widget>
    </div>
  `
})
export class AppComponent {
  widgetConfig = {
    apiKey: 'your-api-key',
    theme: 'light' as const,
    position: 'bottom-right' as const,
    size: 'standard' as const,
    companyName: 'Your Company',
    welcomeMessage: 'Hello! How can I help you with your finances today?'
  };
}
```

#### Option C: NPM Package Integration (Advanced)

**Step 1: Install Package**
```bash
npm install ai-agent-widget
```

**Step 2: Create Angular Wrapper**
```typescript
// src/app/components/ai-widget-wrapper/ai-widget-wrapper.component.ts
import { 
  Component, 
  Input, 
  OnInit, 
  OnDestroy, 
  ViewChild, 
  ElementRef,
  Inject,
  PLATFORM_ID 
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-ai-widget-wrapper',
  template: `<div #widgetContainer></div>`
})
export class AiWidgetWrapperComponent implements OnInit, OnDestroy {
  @ViewChild('widgetContainer', { static: true }) widgetContainer!: ElementRef;
  @Input() config: any = {};

  private widgetInstance: any = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const { AIWidget } = await import('ai-agent-widget');
        // Note: This would require additional React integration setup
        console.log('AI Widget loaded', AIWidget);
      } catch (error) {
        console.error('Failed to load AI Widget:', error);
      }
    }
  }

  ngOnDestroy() {
    if (this.widgetInstance) {
      // Cleanup widget instance
    }
  }
}
```

#### Option D: Iframe Integration

**Step 1: Create Iframe Component**
```typescript
// src/app/components/ai-widget-iframe/ai-widget-iframe.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-ai-widget-iframe',
  template: `
    <div class="widget-iframe-container" [class.hidden]="!isVisible">
      <iframe 
        [src]="iframeSrc" 
        [style.width]="width"
        [style.height]="height"
        frameborder="0"
        allow="microphone; camera"
        class="ai-widget-iframe">
      </iframe>
      <button 
        class="close-button" 
        (click)="toggleVisibility()"
        aria-label="Close AI Assistant">
        ×
      </button>
    </div>
    
    <button 
      class="floating-button" 
      [class.hidden]="isVisible"
      (click)="toggleVisibility()"
      aria-label="Open AI Assistant">
      💬
    </button>
  `,
  styleUrls: ['./ai-widget-iframe.component.css']
})
export class AiWidgetIframeComponent implements OnInit {
  @Input() apiKey = 'your-api-key';
  @Input() theme = 'light';
  @Input() width = '400px';
  @Input() height = '600px';
  @Input() position = 'bottom-right';

  iframeSrc: SafeResourceUrl = '';
  isVisible = false;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    const params = new URLSearchParams({
      apiKey: this.apiKey,
      theme: this.theme,
      embedded: 'true'
    });
    
    const url = `https://your-widget-domain.com/chat?${params.toString()}`;
    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }
}
```

**Step 2: Add Iframe Styles**
```css
/* src/app/components/ai-widget-iframe/ai-widget-iframe.component.css */
.widget-iframe-container {
  position: fixed;
  bottom: 80px;
  right: 20px;
  z-index: 9999;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  background: white;
}

.widget-iframe-container.hidden {
  display: none;
}

.ai-widget-iframe {
  border: none;
  border-radius: 12px;
}

.floating-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #2563EB;
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  z-index: 9999;
  transition: all 0.3s ease;
}

.floating-button:hover {
  background: #1d4ed8;
  transform: scale(1.05);
}

.floating-button.hidden {
  display: none;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
}

.close-button:hover {
  background: rgba(0, 0, 0, 0.2);
}
```

### Angular-Specific Considerations

#### 1. Server-Side Rendering (SSR) Support
```typescript
// Always check for browser environment
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

ngOnInit() {
  if (isPlatformBrowser(this.platformId)) {
    // Widget initialization code
  }
}
```

#### 2. Lazy Loading
```typescript
// Lazy load widget only when needed
async loadWidget() {
  const { AIWidget } = await import('ai-agent-widget');
  // Initialize widget
}
```

#### 3. Environment Configuration
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  aiWidget: {
    apiKey: 'dev-api-key',
    cdnUrl: 'http://localhost:5173/dist/widget.umd.cjs'
  }
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  aiWidget: {
    apiKey: 'prod-api-key',
    cdnUrl: 'https://your-cdn.com/widget.umd.cjs'
  }
};
```

#### 4. Module Declaration
```typescript
// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AiWidgetComponent } from './components/ai-widget/ai-widget.component';

@NgModule({
  declarations: [
    AiWidgetComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

#### 5. TypeScript Declarations
```typescript
// src/types/ai-widget.d.ts
declare global {
  interface Window {
    AIAgentWidget: {
      init: (config: any) => any;
      destroy: () => void;
    };
    AIWidgetConfig: any;
  }
}

export {};
```

### Recommended Approach

For most Angular applications, **Option A (Script Tag Integration)** is recommended because:
- ✅ Easiest to implement and maintain
- ✅ No additional dependencies
- ✅ Works with all Angular versions
- ✅ Minimal bundle size impact
- ✅ Easy to update widget independently

### Local Development Setup

1. **Start the AI Widget development server:**
   ```bash
   # In the AI widget project directory
   npm run dev
   ```
   This will start the widget at `http://localhost:5173`

2. **Build the widget for integration testing:**
   ```bash
   npm run build:widget
   ```
   This creates the `dist/widget.umd.cjs` file needed for integration

3. **Test the integration:**
   - The widget will be available at `http://localhost:5173/dist/widget.umd.cjs`
   - Chat interface available at `http://localhost:5173/chat`
   - Use `demo-key` as the API key for local testing

Use **Option B (Dynamic Loading)** if you need:
- More control over widget lifecycle
- Conditional widget loading
- Custom configuration management

Use **Option D (Iframe)** if you need:
- Complete isolation from your Angular app
- Different domain hosting
- Maximum security separation

### Method 3: Iframe Embedding

**Basic Iframe:**
```html
<iframe src="https://your-widget-domain.com/chat?apiKey=your-key&theme=light" 
        width="100%" 
        height="600px" 
        frameborder="0"
        allow="microphone; camera">
</iframe>
```

**Responsive Iframe:**
```html
<div style="position: relative; width: 100%; height: 600px;">
  <iframe src="https://your-widget-domain.com/chat" 
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;">
  </iframe>
</div>
```

## Configuration

### Environment Variables
Set these environment variables for production:

```bash
# API Configuration
VITE_API_BASE_URL=https://your-api.com
VITE_API_KEY=your-default-api-key

# Widget Configuration
VITE_WIDGET_VERSION=1.0.0
VITE_CDN_URL=https://your-cdn.com

# Analytics (optional)
VITE_ANALYTICS_ID=your-analytics-id
```

### Widget Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | string | - | Your API key for the AI service |
| `theme` | 'light' \| 'dark' | 'light' | Widget color theme |
| `position` | 'bottom-right' \| 'bottom-left' | 'bottom-right' | Floating button position |
| `welcomeMessage` | string | Default greeting | Initial message displayed |
| `companyName` | string | 'Financial AI' | Company name in header |
| `primaryColor` | string | '#2563EB' | Primary brand color |
| `enableSmartPrompting` | boolean | true | Enable guided prompting |
| `promptSuggestions` | string[] | Default prompts | Custom prompt suggestions |
| `size` | 'compact' \| 'standard' \| 'large' \| 'custom' | 'standard' | Widget size preset |
| `customWidth` | string | - | Custom width (CSS units, when size='custom') |
| `customHeight` | string | - | Custom height (CSS units, when size='custom') |
| `minWidth` | string | - | Minimum width constraint |
| `maxWidth` | string | - | Maximum width constraint |

### API Integration
Replace the mock API service in `src/services/api.ts`:

```typescript
class ApiService {
  private baseUrl: string;
  private apiKey: string;

  constructor(apiKey: string = '') {
    this.baseUrl = process.env.VITE_API_BASE_URL || 'https://your-api.com';
    this.apiKey = apiKey;
  }

  async sendMessage(message: string, context: string[] = []): Promise<ApiResponse> {
    const response = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        message,
        context,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }
}
```

## Testing

### Step 1: Local Testing
```bash
# Start development server
npm run dev

# Test in different browsers
# - Chrome
# - Firefox
# - Safari
# - Edge

# Test on different devices
# - Desktop
# - Tablet
# - Mobile
```

### Step 2: Integration Testing
Create test HTML files for each integration method:

**test-script-tag.html:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Widget Test - Script Tag</title>
</head>
<body>
    <h1>Test Page</h1>
    <script src="http://localhost:5173/dist/widget.umd.cjs" 
            data-ai-widget
            data-api-key="test-key"
            data-theme="light">
    </script>
</body>
</html>
```

**test-react.html:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Widget Test - React</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
</head>
<body>
    <div id="root"></div>
    <script type="module">
        import { AIWidget } from 'http://localhost:5173/dist/widget.js';
        
        ReactDOM.render(
            React.createElement(AIWidget, {
                config: {
                    apiKey: 'test-key',
                    theme: 'light'
                }
            }),
            document.getElementById('root')
        );
    </script>
</body>
</html>
```

### Step 3: Performance Testing
```bash
# Bundle size analysis
npm run build:widget
npx bundlesize

# Lighthouse audit
npx lighthouse http://localhost:5173 --output html --output-path ./lighthouse-report.html

# Load testing
npx autocannon http://localhost:5173
```

## Production Checklist

### Pre-Deployment
- [ ] Update API endpoints to production URLs
- [ ] Set production environment variables
- [ ] Remove console.log statements
- [ ] Minify and optimize assets
- [ ] Test all integration methods
- [ ] Verify CORS configuration
- [ ] Check browser compatibility
- [ ] Test on mobile devices
- [ ] Validate accessibility (ARIA labels, keyboard navigation)
- [ ] Review security headers

### Deployment
- [ ] Build production bundle
- [ ] Upload to CDN/hosting service
- [ ] Configure custom domain
- [ ] Set up SSL certificate
- [ ] Configure cache headers
- [ ] Test live deployment
- [ ] Monitor error logs
- [ ] Set up analytics (optional)

### Post-Deployment
- [ ] Update documentation
- [ ] Notify integration partners
- [ ] Monitor performance metrics
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Create backup strategy
- [ ] Document rollback procedure

### Monitoring
- [ ] Set up uptime monitoring
- [ ] Configure error alerts
- [ ] Monitor API usage
- [ ] Track user engagement
- [ ] Monitor bundle size
- [ ] Check loading performance

## Troubleshooting

### Common Issues

**Widget not loading:**
- Check CORS headers
- Verify script URL is accessible
- Check browser console for errors
- Ensure API key is valid

**Styling issues:**
- Check CSS conflicts with host site
- Verify CSS is loading correctly
- Test in different browsers
- Check for CSS specificity issues

**API errors:**
- Verify API endpoint is accessible
- Check API key configuration
- Monitor API rate limits
- Check request/response format

**Performance issues:**
- Optimize bundle size
- Enable gzip compression
- Use CDN for static assets
- Implement lazy loading

### Support
For deployment support, create an issue in the repository with:
- Deployment method used
- Error messages
- Browser/device information
- Steps to reproduce

## Version Management

### Semantic Versioning
Follow semantic versioning for releases:
- `1.0.0` - Major version (breaking changes)
- `1.1.0` - Minor version (new features)
- `1.1.1` - Patch version (bug fixes)

### Release Process
1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create git tag
4. Build and deploy to CDN
5. Update documentation
6. Notify integration partners

### Backward Compatibility
Maintain backward compatibility for:
- Configuration options
- API interfaces
- CSS class names
- Event handlers

Breaking changes should only be introduced in major versions with proper migration guides.