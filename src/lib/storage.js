export const storage = {
  getItem: (key) => {
    if (typeof window === 'undefined') return null;
    try {
      if (window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      // Silently fail
    }
    return null;
  },
  setItem: (key, value) => {
    if (typeof window === 'undefined') return;
    try {
      if (window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      // Silently fail
    }
  },
  removeItem: (key) => {
    if (typeof window === 'undefined') return;
    try {
      if (window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      // Silently fail
    }
  },
};
