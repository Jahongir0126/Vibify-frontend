import { toast } from 'react-toastify';

// Default toast configuration
const defaultConfig = {
  position: "top-left",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

// Get current theme from document
const getCurrentTheme = () => {
  return document.documentElement.getAttribute('data-theme') || 'dark';
};

// Toast configuration with theme support
const getConfig = (customConfig = {}) => ({
  ...defaultConfig,
  ...customConfig,
  theme: getCurrentTheme(),
});

// Toast manager with theme support and custom configuration
export const showToast = {
  success: (message, customConfig = {}) => 
    toast.success(message, getConfig(customConfig)),
  error: (message, customConfig = {}) => 
    toast.error(message, getConfig(customConfig)),
  info: (message, customConfig = {}) => 
    toast.info(message, getConfig(customConfig)),
  warning: (message, customConfig = {}) => 
    toast.warning(message, getConfig(customConfig)),
};

// Clear all toasts
export const clearAllToasts = () => {
  toast.dismiss();
};

// Update toast theme when app theme changes
export const updateToastTheme = () => {
  const theme = getCurrentTheme();
  toast.update(undefined, { theme });
}; 