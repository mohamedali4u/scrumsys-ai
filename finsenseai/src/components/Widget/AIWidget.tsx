import React from 'react';
import { ChatWindow } from '../Chat/ChatWindow';
import { FloatingButton } from './FloatingButton';
import { useChatStore } from '../../stores/chatStore';
import type { WidgetConfig } from '../../types/chat';

interface AIWidgetProps {
  config?: Partial<WidgetConfig>;
}

export const AIWidget: React.FC<AIWidgetProps> = ({ config = {} }) => {
  const { isOpen, setIsOpen, updateConfig, messages, showGroupPanel, showTaskPanel } = useChatStore();

  // Update config when props change
  React.useEffect(() => {
    if (Object.keys(config).length > 0) {
      updateConfig(config);
    }
  }, [config, updateConfig]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const hasUnreadMessages = messages.some(msg => 
    msg.role === 'assistant' && 
    Date.now() - msg.timestamp.getTime() < 5000
  );

  // Get widget dimensions based on size setting and visible panels
  const getWidgetDimensions = () => {
    const panels = [showGroupPanel, showTaskPanel].filter(Boolean).length;
    
    const sizeConfig = {
      compact: {
        base: { width: 'w-80', height: 'h-96' }, // 320px x 384px
        withOnePanel: { width: 'w-[40rem]', height: 'h-[28rem]' }, // 640px x 448px
        withTwoPanels: { width: 'w-[56rem]', height: 'h-[32rem]' } // 896px x 512px
      },
      standard: {
        base: { width: 'w-[32rem]', height: 'h-[36rem]' }, // 512px x 576px
        withOnePanel: { width: 'w-[48rem]', height: 'h-[36rem]' }, // 768px x 576px
        withTwoPanels: { width: 'w-[64rem]', height: 'h-[36rem]' } // 1024px x 576px
      },
      large: {
        base: { width: 'w-[40rem]', height: 'h-[44rem]' }, // 640px x 704px
        withOnePanel: { width: 'w-[56rem]', height: 'h-[44rem]' }, // 896px x 704px
        withTwoPanels: { width: 'w-[72rem]', height: 'h-[44rem]' } // 1152px x 704px
      },
      custom: {
        base: { width: config.customWidth || 'w-[32rem]', height: config.customHeight || 'h-[36rem]' },
        withOnePanel: { width: config.customWidth || 'w-[48rem]', height: config.customHeight || 'h-[36rem]' },
        withTwoPanels: { width: config.customWidth || 'w-[64rem]', height: config.customHeight || 'h-[36rem]' }
      }
    };
    
    const size = config.size || 'standard';
    const sizeSettings = sizeConfig[size];
    
    if (panels === 2) {
      return `${sizeSettings.withTwoPanels.width} ${sizeSettings.withTwoPanels.height}`;
    } else if (panels === 1) {
      return `${sizeSettings.withOnePanel.width} ${sizeSettings.withOnePanel.height}`;
    } else {
      return `${sizeSettings.base.width} ${sizeSettings.base.height}`;
    }
  };
  
  // Get custom styles for custom size
  const getCustomStyles = () => {
    if (config.size === 'custom') {
      return {
        width: config.customWidth,
        height: config.customHeight,
        minWidth: config.minWidth,
        minHeight: config.minHeight,
        maxWidth: config.maxWidth,
        maxHeight: config.maxHeight
      };
    }
    return {};
  };

  return (
    <>
      <FloatingButton
        isOpen={isOpen}
        onClick={toggleChat}
        position={config.position || 'bottom-right'}
        hasUnread={hasUnreadMessages && !isOpen}
      />
      
      {isOpen && (
        <div className={`fixed ${
          config.position === 'bottom-left' ? 'bottom-24 left-6' : 'bottom-24 right-6'
        } ${getWidgetDimensions()} z-40 transition-all duration-300 transform ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        style={getCustomStyles()}>
          <ChatWindow onClose={() => setIsOpen(false)} />
        </div>
      )}
      
      {/* Mobile overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setIsOpen(false)} />
      )}
      
      {/* Mobile chat window */}
      {isOpen && (
        <div className="md:hidden fixed inset-4 z-40">
          <ChatWindow onClose={() => setIsOpen(false)} />
        </div>
      )}
    </>
  );
};