import { useState, useCallback } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback(
    (type: Notification['type'], message: string, duration = 3000) => {
      const id = `notif-${Date.now()}-${Math.random()}`;
      const notification: Notification = { id, type, message, duration };

      setNotifications((prev) => [...prev, notification]);

      if (duration > 0) {
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, duration);
      }

      return id;
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const success = useCallback(
    (message: string, duration?: number) => showNotification('success', message, duration),
    [showNotification]
  );

  const error = useCallback(
    (message: string, duration?: number) => showNotification('error', message, duration),
    [showNotification]
  );

  const info = useCallback(
    (message: string, duration?: number) => showNotification('info', message, duration),
    [showNotification]
  );

  const warning = useCallback(
    (message: string, duration?: number) => showNotification('warning', message, duration),
    [showNotification]
  );

  return {
    notifications,
    showNotification,
    removeNotification,
    success,
    error,
    info,
    warning,
  };
};

