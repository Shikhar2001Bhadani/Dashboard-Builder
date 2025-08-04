import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { trackActiveUser, stopTrackingUser, subscribeToActiveUsers } from "../services/activeUsersService";

const ActiveUsersContext = createContext();

export const useActiveUsers = () => {
  const context = useContext(ActiveUsersContext);
  if (!context) {
    throw new Error("useActiveUsers must be used within an ActiveUsersProvider");
  }
  return context;
};

export const ActiveUsersProvider = ({ children }) => {
  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Start tracking the current user
    const startTracking = async () => {
      await trackActiveUser(user.uid, user.email);
    };

    startTracking();

    // Subscribe to active users count changes
    const unsubscribe = subscribeToActiveUsers((count) => {
      setActiveUsersCount(count);
    });

    // Cleanup function
    return () => {
      unsubscribe();
      if (user) {
        stopTrackingUser(user.uid);
      }
    };
  }, [user]);

  // Handle page visibility changes to update user status
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (!user) return;

      if (document.hidden) {
        // User switched tabs or minimized browser
        await stopTrackingUser(user.uid);
      } else {
        // User returned to the tab
        await trackActiveUser(user.uid, user.email);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  // Handle beforeunload to clean up user tracking
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (user) {
        await stopTrackingUser(user.uid);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user]);

  const value = {
    activeUsersCount,
  };

  return (
    <ActiveUsersContext.Provider value={value}>
      {children}
    </ActiveUsersContext.Provider>
  );
}; 