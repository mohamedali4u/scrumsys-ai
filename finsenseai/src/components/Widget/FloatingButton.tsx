import React from 'react';
import { MessageCircle, X } from 'lucide-react';

interface FloatingButtonProps {
  isOpen: boolean;
  onClick: () => void;
  position: 'bottom-right' | 'bottom-left';
  hasUnread?: boolean;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  isOpen,
  onClick,
  position,
  hasUnread = false
}) => {
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6'
  };

  return (
    <button
      onClick={onClick}
      className={`fixed ${positionClasses[position]} w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 group`}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
    >
      <div className="relative">
        {isOpen ? (
          <X className="w-6 h-6 transition-transform duration-200" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 transition-transform duration-200 group-hover:scale-110" />
            {hasUnread && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </>
        )}
      </div>
      
      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-full bg-blue-600 opacity-75 animate-ping"></div>
    </button>
  );
};