import { computed } from 'vue';
import { useCookie } from '#app';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
  matricNumber?: string;
}

export const useUser = () => {
  const token = useCookie<string | null>('errandr_token', {
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
    sameSite: 'lax',
  });
  
  const refreshToken = useCookie<string | null>('errandr_refresh_token', {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
    sameSite: 'lax',
  });
  
  const user = useCookie<User | null>('errandr_user', {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax',
  });

  const setUser = (userData: User) => {
    user.value = userData;
    if (typeof window !== 'undefined') {
      const expires = new Date(Date.now() + 7 * 86400 * 1000).toUTCString();
      document.cookie = `errandr_user=${encodeURIComponent(JSON.stringify(userData))}; expires=${expires}; path=/; samesite=lax`;
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const setToken = (newToken: string) => {
    token.value = newToken;
    if (typeof window !== 'undefined') {
      const expires = new Date(Date.now() + 7 * 86400 * 1000).toUTCString();
      document.cookie = `errandr_token=${newToken}; expires=${expires}; path=/; samesite=lax`;
      localStorage.setItem('token', newToken);
    }
  };

  const setRefreshToken = (newRefreshToken: string) => {
    refreshToken.value = newRefreshToken;
    if (typeof window !== 'undefined') {
      const expires = new Date(Date.now() + 30 * 86400 * 1000).toUTCString();
      document.cookie = `errandr_refresh_token=${newRefreshToken}; expires=${expires}; path=/; samesite=lax`;
    }
  };

  const clearAllAuthCookies = () => {
    if (typeof window === 'undefined') return;
    const cookieNames = ['errandr_token', 'errandr_refresh_token', 'errandr_user'];
    const host = window.location.hostname;
    const domains = ['', host, `.${host}`];
    if (host.includes('.')) {
      const rootDomain = '.' + host.split('.').slice(-2).join('.');
      domains.push(rootDomain);
    }
    cookieNames.forEach(name => {
      domains.forEach(domain => {
        const domainAttr = domain ? `domain=${domain};` : '';
        document.cookie = `${name}=; Max-Age=0; path=/; ${domainAttr}`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; ${domainAttr}`;
      });
    });
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const logOut = () => {
    user.value = null;
    token.value = null;
    refreshToken.value = null;
    
    clearAllAuthCookies();
    
    // Force a hard reload to clear all states and bypass Nuxt router middleware reactivity bugs
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.location.href = '/';
    }
  };

  const isLoggedIn = computed(() => !!token.value && user.value?.role === 'admin');

  const fullName = computed(() => {
    if (!user.value) return '';
    return `${user.value.firstName} ${user.value.lastName}`;
  });

  return {
    user,
    token,
    refreshToken,
    setUser,
    setToken,
    setRefreshToken,
    logOut,
    isLoggedIn,
    fullName
  };
};
