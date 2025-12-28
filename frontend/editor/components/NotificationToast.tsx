import React from 'react';
import { Notification } from '../hooks/useNotifications';

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
}) => {
  return (
    <div
      data-testid={`notification-${notification.type}`}
      className={`notification notification-${notification.type}`}
      role="alert"
    >
      <span className="notification-message">{notification.message}</span>
      <button
        data-testid="notification-close"
        className="notification-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

