import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const notification = { id, message, type };

    setNotifications((prev) => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const success = useCallback((message, duration = 3000) => {
    return addNotification(message, 'success', duration);
  }, [addNotification]);

  const error = useCallback((message, duration = 4000) => {
    return addNotification(message, 'error', duration);
  }, [addNotification]);

  const info = useCallback((message, duration = 3000) => {
    return addNotification(message, 'info', duration);
  }, [addNotification]);

  const warning = useCallback((message, duration = 3000) => {
    return addNotification(message, 'warning', duration);
  }, [addNotification]);

  const getIconAndColor = (type) => {
    const configs = {
      success: {
        icon: CheckCircle,
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800',
        iconColor: 'text-green-600',
      },
      error: {
        icon: AlertCircle,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800',
        iconColor: 'text-red-600',
      },
      info: {
        icon: Info,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-800',
        iconColor: 'text-blue-600',
      },
      warning: {
        icon: AlertCircle,
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        textColor: 'text-amber-800',
        iconColor: 'text-amber-600',
      },
    };
    return configs[type] || configs.info;
  };

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification, success, error, info, warning }}>
      {children}
      <NotificationContainer notifications={notifications} removeNotification={removeNotification} getIconAndColor={getIconAndColor} />
    </NotificationContext.Provider>
  );
};

const NotificationContainer = ({ notifications, removeNotification, getIconAndColor }) => {
  return (
    <div className="fixed top-6 right-6 z-50 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => {
          const config = getIconAndColor(notification.type);
          const Icon = config.icon;

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 100, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`mb-3 pointer-events-auto ${config.bgColor} ${config.borderColor} border rounded-xl p-4 shadow-lg flex items-start gap-3 min-w-72 max-w-96`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />
              <div className="flex-1">
                <p className={`text-sm font-medium ${config.textColor}`}>
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className={`flex-shrink-0 ${config.iconColor} hover:opacity-70 transition-opacity`}
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
