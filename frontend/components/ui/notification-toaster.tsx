'use client';

import { useNotifications } from '@/hooks/useUI';
import { Notification } from '@/stores/ui';
import { AlertTriangle, CheckCircle, Info, X, XCircle } from 'lucide-react';
import { useEffect } from 'react';

interface NotificationItemProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

const NotificationItem = ({ notification, onRemove }: NotificationItemProps) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTextColor = () => {
    switch (notification.type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <div
      className={`
        relative flex items-start gap-3 p-4 rounded-lg border shadow-lg
        ${getBackgroundColor()}
        animate-in slide-in-from-right-full duration-300
      `}
    >
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-medium ${getTextColor()}`}>
          {notification.title}
        </h4>
        <p className={`text-sm mt-1 ${getTextColor()} opacity-90`}>
          {notification.message}
        </p>
        
        {notification.action && (
          <button
            onClick={notification.action.onClick}
            className={`
              mt-2 text-sm font-medium underline hover:no-underline
              ${getTextColor()}
            `}
          >
            {notification.action.label}
          </button>
        )}
      </div>
      
      <button
        onClick={() => onRemove(notification.id)}
        className={`
          flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors
          ${getTextColor()} opacity-70 hover:opacity-100
        `}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export const NotificationToaster = () => {
  const { notifications, removeNotification } = useNotifications();

  // Auto-remove notifications after their duration
  useEffect(() => {
    notifications.forEach((notification) => {
      if (notification.duration && notification.duration > 0) {
        const timer = setTimeout(() => {
          removeNotification(notification.id);
        }, notification.duration);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications, removeNotification]);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
};
