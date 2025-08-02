import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { auth } from "../services/firebase.js";
import { 
  saveDashboardState, 
  loadDashboardState, 
  subscribeToDashboard,
  updateUserActivity,
  setUserOffline
} from "../services/dashboardService.js";
import { applySeasonalTheme } from "../utils/themeUtils.js";

const DashboardContext = createContext();

const initialState = {
  widgets: [],
  selectedWidgetId: null,
  theme: "light",
  seasonalTheme: null,
  activeUsers: [],
  lastModifiedBy: null,
  isLoading: true,
  isSaving: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_WIDGET":
      return { 
        ...state, 
        widgets: [...state.widgets, action.payload],
        isSaving: true
      };
    case "UPDATE_WIDGET":
      return {
        ...state,
        widgets: state.widgets.map((w) =>
          w.id === action.payload.id ? { ...w, ...action.payload.data } : w
        ),
        isSaving: true
      };
    case "DELETE_WIDGET":
      const updatedWidgets = state.widgets.filter(
        (w) => w.id !== action.payload
      );
      console.log(
        `Deleting widget ${action.payload}. Remaining widgets:`,
        updatedWidgets.length
      );
      return {
        ...state,
        widgets: updatedWidgets,
        selectedWidgetId:
          state.selectedWidgetId === action.payload
            ? null
            : state.selectedWidgetId,
        isSaving: true
      };
    case "CLEAR_CANVAS":
      return {
        ...state,
        widgets: [],
        selectedWidgetId: null,
        isSaving: true
      };
    case "SET_THEME":
      return { ...state, theme: action.payload, isSaving: true };
    case "SET_SEASONAL_THEME":
      return { ...state, seasonalTheme: action.payload, isSaving: true };
    case "CLEAR_SEASONAL_THEME":
      return { ...state, seasonalTheme: null, isSaving: true };
    case "SET_WIDGETS":
      return { ...state, widgets: action.payload, isSaving: true };
    case "SET_SELECTED_WIDGET":
      return { ...state, selectedWidgetId: action.payload };
    case "SET_ACTIVE_USERS":
      return { ...state, activeUsers: action.payload };
    case "SET_LAST_MODIFIED_BY":
      return { ...state, lastModifiedBy: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_SAVING":
      return { ...state, isSaving: action.payload };
    case "LOAD_DASHBOARD":
      return { 
        ...state, 
        ...action.payload, 
        isLoading: false,
        isSaving: false
      };
    default:
      return state;
  }
}

export const DashboardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Save dashboard state to Firebase whenever it changes
  const saveToFirebase = useCallback(async (dashboardData) => {
    try {
      if (!auth.currentUser) return;
      
      await saveDashboardState(dashboardData);
      dispatch({ type: "SET_SAVING", payload: false });
    } catch (error) {
      console.error("Error saving to Firebase:", error);
      dispatch({ type: "SET_SAVING", payload: false });
    }
  }, []);

  // Load dashboard state from Firebase on mount
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        if (!auth.currentUser) {
          dispatch({ type: "SET_LOADING", payload: false });
          return;
        }

        const dashboardData = await loadDashboardState();
        if (dashboardData) {
          dispatch({ type: "LOAD_DASHBOARD", payload: dashboardData });
        } else {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      } catch (error) {
        console.error("Error loading dashboard:", error);
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    loadDashboard();
  }, []);

  // Set up real-time subscription when user is authenticated
  useEffect(() => {
    let unsubscribe = null;

    const setupSubscription = () => {
      if (auth.currentUser) {
        unsubscribe = subscribeToDashboard(auth.currentUser.uid, (dashboardData) => {
          dispatch({ type: "LOAD_DASHBOARD", payload: dashboardData });
        });
      }
    };

    const authUnsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setupSubscription();
        updateUserActivity();
      } else {
        if (unsubscribe) {
          unsubscribe();
        }
        setUserOffline();
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      authUnsubscribe();
    };
  }, []);

  // Auto-save dashboard state when it changes
  useEffect(() => {
    if (!state.isLoading && auth.currentUser) {
      const dashboardData = {
        widgets: state.widgets,
        theme: state.theme,
        seasonalTheme: state.seasonalTheme,
        selectedWidgetId: state.selectedWidgetId,
        activeUsers: state.activeUsers,
        lastModifiedBy: state.lastModifiedBy
      };

      // Debounce the save operation
      const timeoutId = setTimeout(() => {
        if (state.isSaving) {
          saveToFirebase(dashboardData);
        }
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [state.widgets, state.theme, state.seasonalTheme, state.selectedWidgetId, state.activeUsers, state.lastModifiedBy, state.isSaving, saveToFirebase]);

  // Update user activity periodically
  useEffect(() => {
    if (!auth.currentUser) return;

    const interval = setInterval(() => {
      updateUserActivity();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Apply seasonal theme when it changes
  useEffect(() => {
    applySeasonalTheme(state.seasonalTheme);
  }, [state.seasonalTheme]);

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
