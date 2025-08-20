// Utility functions for resetting the app state

export const RESET_KEYS = [
  'draft-state',
  // Add any other localStorage keys that need to be cleared here
];

/**
 * Clears all app-related data from localStorage
 */
export const clearAppData = () => {
  RESET_KEYS.forEach(key => {
    localStorage.removeItem(key);
  });
  
  // Also clear any other potential keys that might have been used
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('draft') || key.includes('tactics') || key.includes('formation'))) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
};

/**
 * Resets the app to its initial state
 * This function should be called when starting over
 */
export const resetApp = () => {
  clearAppData();
  markForFreshStart();
  
  // Force a page reload to ensure all components reset
  window.location.href = '/';
};

/**
 * Checks if the app should reset on refresh
 * This prevents loading saved state when the user refreshes the page
 */
export const shouldResetOnRefresh = (): boolean => {
  // Check if there's a session flag indicating a fresh start
  const freshStart = sessionStorage.getItem('fresh-start');
  if (freshStart) {
    sessionStorage.removeItem('fresh-start');
    return true;
  }
  return false;
};

/**
 * Marks the app for a fresh start on the next page load
 */
export const markForFreshStart = () => {
  sessionStorage.setItem('fresh-start', 'true');
};

/**
 * Checks if there's any saved progress in the app
 */
export const hasSavedProgress = (): boolean => {
  return RESET_KEYS.some(key => localStorage.getItem(key) !== null);
};
