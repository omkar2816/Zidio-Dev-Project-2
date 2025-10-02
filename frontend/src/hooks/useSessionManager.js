import { useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import authService from '../services/authService';

// Session configuration
const SESSION_CONFIG = {
  INACTIVITY_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  TOKEN_REFRESH_INTERVAL: 10 * 60 * 1000, // 10 minutes
  WARNING_BEFORE_LOGOUT: 5 * 60 * 1000, // 5 minutes warning
  CHECK_INTERVAL: 60 * 1000, // Check every minute
};

// Activity events to track
const ACTIVITY_EVENTS = [
  'mousedown',
  'mousemove',
  'keypress',
  'scroll',
  'touchstart',
  'click',
];

export const useSessionManager = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const lastActivityRef = useRef(Date.now());
  const warningShownRef = useRef(false);
  const refreshTimeoutRef = useRef(null);
  const checkTimeoutRef = useRef(null);

  // Update last activity timestamp
  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    warningShownRef.current = false;
    
    // Store activity in session storage for cross-tab sync
    sessionStorage.setItem('lastActivity', lastActivityRef.current.toString());
  }, []);

  // Check if session has expired
  const isSessionExpired = useCallback(() => {
    const now = Date.now();
    const timeSinceActivity = now - lastActivityRef.current;
    return timeSinceActivity > SESSION_CONFIG.INACTIVITY_TIMEOUT;
  }, []);

  // Check if warning should be shown
  const shouldShowWarning = useCallback(() => {
    const now = Date.now();
    const timeSinceActivity = now - lastActivityRef.current;
    const timeUntilExpiry = SESSION_CONFIG.INACTIVITY_TIMEOUT - timeSinceActivity;
    return timeUntilExpiry <= SESSION_CONFIG.WARNING_BEFORE_LOGOUT && timeUntilExpiry > 0;
  }, []);

  // Show session warning
  const showSessionWarning = useCallback(() => {
    if (warningShownRef.current) return;
    
    warningShownRef.current = true;
    const timeLeft = Math.ceil(SESSION_CONFIG.WARNING_BEFORE_LOGOUT / 60000);
    
    const userChoice = window.confirm(
      `Your session will expire in ${timeLeft} minutes due to inactivity. ` +
      'Click OK to stay logged in or Cancel to logout now.'
    );
    
    if (userChoice) {
      updateActivity();
    } else {
      handleLogout();
    }
  }, []);

  // Handle logout
  const handleLogout = useCallback(() => {
    dispatch(logout());
    sessionStorage.removeItem('lastActivity');
    console.log('🚪 Session expired - user logged out');
  }, [dispatch]);

  // Refresh access token
  const refreshAccessToken = useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await authService.refreshToken();
      console.log('🔄 Access token refreshed successfully');
      
      // Update user data in Redux store if needed
      // The token is automatically updated in localStorage by authService
      
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      handleLogout();
    }
  }, [user, handleLogout]);

  // Session validation check
  const validateSession = useCallback(async () => {
    if (!user) return;

    // Check for cross-tab activity
    const storedActivity = sessionStorage.getItem('lastActivity');
    if (storedActivity) {
      const stored = parseInt(storedActivity);
      if (stored > lastActivityRef.current) {
        lastActivityRef.current = stored;
      }
    }

    // Check if session expired
    if (isSessionExpired()) {
      console.log('⏰ Session expired due to inactivity');
      handleLogout();
      return;
    }

    // Show warning if needed
    if (shouldShowWarning()) {
      showSessionWarning();
    }

    // Validate token with server periodically
    try {
      await authService.validateSession();
    } catch (error) {
      console.error('❌ Session validation failed:', error);
      // Try to refresh token first
      try {
        await refreshAccessToken();
      } catch (refreshError) {
        handleLogout();
      }
    }
  }, [user, isSessionExpired, shouldShowWarning, showSessionWarning, handleLogout, refreshAccessToken]);

  // Setup activity listeners
  useEffect(() => {
    if (!user) return;

    // Add activity event listeners
    ACTIVITY_EVENTS.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    // Initialize activity timestamp
    updateActivity();

    return () => {
      // Remove activity event listeners
      ACTIVITY_EVENTS.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [user, updateActivity]);

  // Setup periodic session validation
  useEffect(() => {
    if (!user) return;

    // Start session validation interval
    checkTimeoutRef.current = setInterval(validateSession, SESSION_CONFIG.CHECK_INTERVAL);

    return () => {
      if (checkTimeoutRef.current) {
        clearInterval(checkTimeoutRef.current);
      }
    };
  }, [user, validateSession]);

  // Setup token refresh interval
  useEffect(() => {
    if (!user) return;

    // Start token refresh interval
    refreshTimeoutRef.current = setInterval(refreshAccessToken, SESSION_CONFIG.TOKEN_REFRESH_INTERVAL);

    return () => {
      if (refreshTimeoutRef.current) {
        clearInterval(refreshTimeoutRef.current);
      }
    };
  }, [user, refreshAccessToken]);

  // Handle page visibility change
  useEffect(() => {
    if (!user) return;

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Page became visible, validate session
        validateSession();
        updateActivity();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, validateSession, updateActivity]);

  // Return session management utilities
  return {
    updateActivity,
    refreshAccessToken,
    validateSession,
    handleLogout,
    getTimeUntilExpiry: () => {
      const timeSinceActivity = Date.now() - lastActivityRef.current;
      return Math.max(0, SESSION_CONFIG.INACTIVITY_TIMEOUT - timeSinceActivity);
    },
    isSessionActive: () => !isSessionExpired(),
  };
};