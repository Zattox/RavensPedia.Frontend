import React, { createContext, useContext } from "react";
import { notification } from "antd";

// Create NotificationContext for managing notifications
export const NotificationContext = createContext(null);

// NotificationProvider component to provide notification API to children
export const NotificationProvider = ({ children }) => {
  const [api, contextHolder] = notification.useNotification(); // Initialize Ant Design notification API

  return (
    <NotificationContext.Provider value={api}>
      {contextHolder} {/* Render notification container */}
      {children} {/* Render children with notification context */}
    </NotificationContext.Provider>
  );
};

// Hook to access NotificationContext
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    ); // Error for missing provider
  }
  return context;
};
