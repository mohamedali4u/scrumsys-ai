# AI Agent Widget

A modular, embeddable AI financial assistant widget built with React and TypeScript. This widget can be embedded on any website using multiple integration methods.

## Features

- 🤖 **Intelligent Financial Assistant** - AI-powered responses for financial queries
- 💬 **Modern Chat Interface** - Beautiful, responsive chat UI with typing indicators
- 📱 **Mobile Responsive** - Optimized for all device sizes
- 🔒 **Privacy Focused** - Local storage for conversation history
- ⭐ **Message Management** - Favorite messages, search, and grouping
- 🎨 **Customizable** - Configurable themes, colors, and positioning
- 🚀 **Multiple Embedding Options** - Script tag, React SDK, and iframe support
- ♿ **Accessible** - ARIA labels and keyboard navigation

## Integration Methods

### 1. Script Tag Embedding (Easiest)

```html
<script src="https://cdn.example.com/ai-widget.js" 
        data-ai-widget
        data-api-key="your-api-key"
        data-theme="light"
        data-position="bottom-right"
        data-company-name="Your Company"
        data-welcome-message="Hello! How can I help you today?">
</script>
```

### 2. React SDK

```bash
npm install ai-agent-widget
```

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

### 3. Iframe Embedding

```html
<iframe src="https://widget.example.com/ai-chat?apiKey=your-key&theme=light" 
        width="100%" 
        height="600px" 
        frameborder="0">
</iframe>
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | string | - | Your API key for the AI service |
| `theme` | 'light' \| 'dark' | 'light' | Widget color theme |
| `size` | 'compact' \| 'standard' \| 'large' \| 'custom' | 'standard' | Widget size preset |
| `position` | 'bottom-right' \| 'bottom-left' | 'bottom-right' | Floating button position |
| `welcomeMessage` | string | Default greeting | Initial message displayed |
| `companyName` | string | 'Financial AI' | Company name in header |
| `primaryColor` | string | '#2563EB' | Primary brand color |
| `customWidth` | string | - | Custom width (when size='custom') |
| `customHeight` | string | - | Custom height (when size='custom') |
| `minWidth` | string | - | Minimum width constraint |
| `maxWidth` | string | - | Maximum width constraint |

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Build widget bundle
npm run build:widget

# Serve built widget for testing
npm run serve
```

## Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Quick Deploy to Netlify

1. **Build the widget:**
   ```bash
   npm run build:widget
   ```

2. **Deploy to Netlify:**
   - Drag and drop the `dist/` folder to [Netlify](https://app.netlify.com)
   - Or connect your GitHub repository with build command: `npm run build:widget`
   - Set publish directory: `dist`

3. **Update integration URLs:**
   Replace `https://cdn.example.com/ai-widget.js` with your Netlify URL in integration examples.

### Production Configuration

Before deploying, update the API service in `src/services/api.ts`:

```typescript
// Replace mock API with your actual endpoint
this.baseUrl = 'https://your-api-endpoint.com';
```

Set environment variables:
```bash
VITE_API_BASE_URL=https://your-api.com
VITE_API_KEY=your-default-api-key
```

## API Integration

The widget expects responses in this format:

```typescript
interface ApiResponse {
  content: string;
  suggestions?: string[];
}
```

Replace the mock API service in `src/services/api.ts` with your actual API endpoint.

## Customization

### Styling
The widget uses Tailwind CSS for styling. You can customize colors by modifying the configuration or overriding CSS classes.

### Prompting
Enhance the AI prompting system in `src/services/api.ts` to include context and sophisticated financial advisory capabilities.

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## License

MIT License - see LICENSE file for details.