import { doc, setDoc, deleteDoc, onSnapshot, collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

// Track active users using Firestore
export const trackActiveUser = async (userId, userEmail) => {
  if (!userId) return;

  const userRef = doc(db, 'activeUsers', userId);
  
  try {
    await setDoc(userRef, {
      email: userEmail,
      lastSeen: new Date(),
      isOnline: true
    }, { merge: true });
  } catch (error) {
    console.error('Error tracking user:', error);
  }
};

// Stop tracking user
export const stopTrackingUser = async (userId) => {
  if (!userId) return;

  const userRef = doc(db, 'activeUsers', userId);
  
  try {
    await deleteDoc(userRef);
  } catch (error) {
    console.error('Error stopping tracking user:', error);
  }
};

// Listen to active users changes
export const subscribeToActiveUsers = (callback) => {
  const unsubscribe = onSnapshot(collection(db, 'activeUsers'), (snapshot) => {
    const activeUsers = snapshot.size;
    callback(activeUsers);
  }, (error) => {
    console.error('Error subscribing to active users:', error);
  });

  return unsubscribe;
};

// Get current active users count
export const getActiveUsersCount = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'activeUsers'));
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting active users count:', error);
    return 0;
  }
}; 