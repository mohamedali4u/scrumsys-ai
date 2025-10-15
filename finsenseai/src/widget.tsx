import React from 'react';
import { createRoot } from 'react-dom/client';
import { AIWidget } from './components/Widget/AIWidget';
import type { WidgetConfig } from './types/chat';
import './index.css';

// Widget class for script tag embedding
class AIAgentWidget {
  private root: any;
  private container: HTMLElement;

  constructor(config: Partial<WidgetConfig> = {}) {
    this.container = document.createElement('div');
    this.container.id = 'ai-agent-widget';
    document.body.appendChild(this.container);

    this.root = createRoot(this.container);
    this.root.render(<AIWidget config={config} />);
  }

  destroy() {
    if (this.root) {
      this.root.unmount();
    }
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }

  updateConfig(config: Partial<WidgetConfig>) {
    this.root.render(<AIWidget config={config} />);
  }
}

// Global widget instance
let widgetInstance: AIAgentWidget | null = null;

// Global functions for script tag usage
(window as any).AIAgentWidget = {
  init: (config: Partial<WidgetConfig> = {}) => {
    if (widgetInstance) {
      widgetInstance.destroy();
    }
    widgetInstance = new AIAgentWidget(config);
    return widgetInstance;
  },
  destroy: () => {
    if (widgetInstance) {
      widgetInstance.destroy();
      widgetInstance = null;
    }
  }
};

// Auto-init if data attributes are present
document.addEventListener('DOMContentLoaded', () => {
  const script = document.querySelector('script[data-ai-widget]');
  if (script) {
    const config: Partial<WidgetConfig> = {};
    
    // Parse data attributes
    if (script.getAttribute('data-api-key')) {
      config.apiKey = script.getAttribute('data-api-key')!;
    }
    if (script.getAttribute('data-theme')) {
      config.theme = script.getAttribute('data-theme') as 'light' | 'dark';
    }
    if (script.getAttribute('data-position')) {
      config.position = script.getAttribute('data-position') as 'bottom-right' | 'bottom-left';
    }
    if (script.getAttribute('data-size')) {
      config.size = script.getAttribute('data-size') as 'compact' | 'standard' | 'large' | 'custom';
    }
    if (script.getAttribute('data-custom-width')) {
      config.customWidth = script.getAttribute('data-custom-width')!;
    }
    if (script.getAttribute('data-custom-height')) {
      config.customHeight = script.getAttribute('data-custom-height')!;
    }
    if (script.getAttribute('data-welcome-message')) {
      config.welcomeMessage = script.getAttribute('data-welcome-message')!;
    }
    if (script.getAttribute('data-company-name')) {
      config.companyName = script.getAttribute('data-company-name')!;
    }

    (window as any).AIAgentWidget.init(config);
  }
});

// Export for React SDK usage
export { AIWidget, AIAgentWidget };
export type { WidgetConfig };