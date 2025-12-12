import React, { forwardRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  footer?: React.ReactNode;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      children,
      size = 'md',
      closeOnOverlayClick = true,
      showCloseButton = true,
      footer,
    },
    ref
  ) => {
    // Handle ESC key press
    useEffect(() => {
      const handleEsc = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && isOpen) {
          onClose();
        }
      };
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-full mx-4',
    };

    const handleOverlayClick = (event: React.MouseEvent) => {
      if (event.target === event.currentTarget && closeOnOverlayClick) {
        onClose();
      }
    };

    return createPortal(
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div
          className="flex min-h-screen items-center justify-center p-4"
          onClick={handleOverlayClick}
        >
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
          
          {/* Modal */}
          <div
            ref={ref}
            className={cn(
              'relative bg-white rounded-xl shadow-xl w-full',
              sizeClasses[size],
              'animate-fade-in'
            )}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-6 border-b border-dark-200">
                {title && (
                  <h2 className="text-xl font-semibold text-dark-900">
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="p-1"
                  >
                    <X size={18} />
                  </Button>
                )}
              </div>
            )}
            
            {/* Content */}
            <div className="p-6">
              {children}
            </div>
            
            {/* Footer */}
            {footer && (
              <div className="flex items-center justify-end gap-3 p-6 border-t border-dark-200 bg-dark-50 rounded-b-xl">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>,
      document.body
    );
  }
);

Modal.displayName = 'Modal';

export default Modal;