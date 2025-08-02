import { 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  collection,
  query,
  where,
  orderBy,
  serverTimestamp 
} from "firebase/firestore";
import { db, auth } from "./firebase.js";

// Save dashboard state to Firestore
export const saveDashboardState = async (dashboardData) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error("No authenticated user found");
      return;
    }

    const dashboardRef = doc(db, "dashboards", user.uid);
    await setDoc(dashboardRef, {
      ...dashboardData,
      userId: user.uid,
      lastModified: serverTimestamp(),
      email: user.email
    });

    console.log("Dashboard state saved successfully");
  } catch (error) {
    console.error("Error saving dashboard state:", error);
    throw error;
  }
};

// Load dashboard state from Firestore
export const loadDashboardState = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error("No authenticated user found");
      return null;
    }

    const dashboardRef = doc(db, "dashboards", user.uid);
    const dashboardSnap = await getDoc(dashboardRef);

    if (dashboardSnap.exists()) {
      const data = dashboardSnap.data();
      console.log("Dashboard state loaded successfully");
      return {
        widgets: data.widgets || [],
        theme: data.theme || "light",
        seasonalTheme: data.seasonalTheme || null,
        selectedWidgetId: data.selectedWidgetId || null,
        activeUsers: data.activeUsers || [],
        lastModifiedBy: data.lastModifiedBy || null
      };
    } else {
      console.log("No existing dashboard found, starting fresh");
      return {
        widgets: [],
        theme: "light",
        seasonalTheme: null,
        selectedWidgetId: null,
        activeUsers: [],
        lastModifiedBy: null
      };
    }
  } catch (error) {
    console.error("Error loading dashboard state:", error);
    throw error;
  }
};

// Subscribe to real-time dashboard updates
export const subscribeToDashboard = (userId, callback) => {
  try {
    const dashboardRef = doc(db, "dashboards", userId);
    
    return onSnapshot(dashboardRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        callback({
          widgets: data.widgets || [],
          theme: data.theme || "light",
          seasonalTheme: data.seasonalTheme || null,
          selectedWidgetId: data.selectedWidgetId || null,
          activeUsers: data.activeUsers || [],
          lastModifiedBy: data.lastModifiedBy || null
        });
      } else {
        // No dashboard exists yet, return empty state
        callback({
          widgets: [],
          theme: "light",
          seasonalTheme: null,
          selectedWidgetId: null,
          activeUsers: [],
          lastModifiedBy: null
        });
      }
    }, (error) => {
      console.error("Error subscribing to dashboard:", error);
    });
  } catch (error) {
    console.error("Error setting up dashboard subscription:", error);
    throw error;
  }
};

// Update user's last activity
export const updateUserActivity = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      email: user.email,
      lastActive: serverTimestamp(),
      isOnline: true
    }, { merge: true });
  } catch (error) {
    console.error("Error updating user activity:", error);
  }
};

// Set user as offline
export const setUserOffline = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      email: user.email,
      lastActive: serverTimestamp(),
      isOnline: false
    }, { merge: true });
  } catch (error) {
    console.error("Error setting user offline:", error);
  }
}; 