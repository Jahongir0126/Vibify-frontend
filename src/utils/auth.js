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
  
  // Cache for decoded tokens
  const tokenCache = new Map();
  
  // Utility function to get userId from token with caching
  export const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;
      
      // Check cache first
      if (tokenCache.has(token)) {
        const cached = tokenCache.get(token);
        if (cached.exp > Date.now() / 1000) {
          return cached.userId;
        }
        tokenCache.delete(token);
      }
      
      const decoded = decodeJWT(token);
      if (decoded) {
        // Cache the decoded token
        tokenCache.set(token, {
          userId: decoded?.id || decoded?.userId,
          exp: decoded.exp
        });
        return decoded?.id || decoded?.userId;
      }
      return null;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  };
  
  // Check if token is expired
  export const isTokenExpired = (token) => {
    try {
      const decoded = decodeJWT(token);
      if (!decoded || !decoded.exp) return true;
      return decoded.exp < Date.now() / 1000;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  };
  
  // Clear token cache
  export const clearTokenCache = () => {
    tokenCache.clear();
  }; 