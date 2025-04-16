// Utility function for decoding JWT token
export const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Utility function to get userId from token
export const getUserIdFromToken = () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    
    const decoded = decodeJWT(token);
    return decoded?.id || decoded?.userId;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
}; 