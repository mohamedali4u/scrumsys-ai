import React from 'react';
import { AIWidget } from './components/Widget/AIWidget';

function App() {
  const config = {
    apiKey: 'demo-key',
    theme: 'light' as const,
    position: 'bottom-right' as const,
    welcomeMessage: 'Hello! I\'m your AI financial assistant. How can I help you manage your finances today?',
    companyName: 'FinSense AI'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Demo page content */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Financial Assistant Widget Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience our intelligent financial assistant that helps you make informed decisions about your money. 
            Click the floating button in the bottom-right corner to start chatting.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">Investment Advice</h3>
            <p className="text-gray-600">
              Get personalized investment recommendations based on your risk tolerance and financial goals.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-green-600">Retirement Planning</h3>
            <p className="text-gray-600">
              Plan for your future with comprehensive retirement planning strategies and calculations.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-amber-600">Budget Management</h3>
            <p className="text-gray-600">
              Learn how to create and maintain budgets that align with your lifestyle and financial objectives.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Integration Options</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Script Tag Embedding</h3>
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="text-sm text-gray-800 overflow-x-auto">
{`<script src="https://cdn.example.com/ai-widget.js" 
        data-ai-widget
        data-api-key="your-api-key"
        data-theme="light"
        data-size="standard"
        data-position="bottom-right"
        data-company-name="Your Company">
</script>`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">React SDK</h3>
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="text-sm text-gray-800 overflow-x-auto">
{`import { AIWidget } from 'ai-agent-widget';

function App() {
  return (
    <div>
      <AIWidget config={{
        apiKey: 'your-api-key',
        theme: 'light',
        size: 'standard',
        position: 'bottom-right',
        companyName: 'Your Company'
      }} />
    </div>
  );
}`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Iframe Embedding</h3>
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="text-sm text-gray-800 overflow-x-auto">
{`<iframe src="https://widget.example.com/ai-chat?apiKey=your-key&theme=light" 
        width="100%" 
        height="600px" 
        frameborder="0">
</iframe>`}
                </pre>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Size Configuration</h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="text-sm text-gray-800 overflow-x-auto">
{`// Predefined sizes
size: 'compact'   // 320x384px (mobile-friendly)
size: 'standard'  // 512x576px (recommended default)
size: 'large'     // 640x704px (desktop optimized)

// Custom size with CSS units
size: 'custom'
customWidth: '600px'
customHeight: '500px'
minWidth: '320px'
maxWidth: '800px'`}
              </pre>
            </div>
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Recommended:</strong> Use 'standard' size for most websites. 
                'Compact\' for mobile-first designs, 'large\' for desktop-heavy applications.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Widget */}
      <AIWidget config={config} />
    </div>
  );
}

export default App;