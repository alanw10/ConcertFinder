
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';

function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
}

async function generateCodeChallenge(verifier) {
  const data = new TextEncoder().encode(verifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function loginWithSpotify() {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  
  if (!clientId) {
    throw new Error('Spotify Client ID is not configured. Please set VITE_SPOTIFY_CLIENT_ID in your .env file');
  }

  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  
  sessionStorage.setItem('spotify_code_verifier', codeVerifier);

  let redirectUri = `${window.location.origin}/callback`;
  if (window.location.hostname === 'localhost') {
    redirectUri = redirectUri.replace('localhost', '127.0.0.1');
  }
  const scope = 'user-read-private user-read-email user-top-read user-read-recently-played';
  const state = generateRandomString(16);
  
  sessionStorage.setItem('spotify_auth_state', state);
  
  const authUrl = new URL(SPOTIFY_AUTH_URL);
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', scope);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('code_challenge_method', 'S256');
  authUrl.searchParams.set('code_challenge', codeChallenge);
  
  window.location.href = authUrl.toString();
}

export async function exchangeCodeForToken(code) {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const codeVerifier = sessionStorage.getItem('spotify_code_verifier');
  let redirectUri = `${window.location.origin}/callback`;
  if (window.location.hostname === 'localhost') {
    redirectUri = redirectUri.replace('localhost', '127.0.0.1');
  }
  
  if (!codeVerifier) {
    throw new Error('Code verifier not found. Please try logging in again.');
  }
  
  try {
    const response = await fetch(SPOTIFY_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error_description || 'Failed to exchange code for token');
    }
    
    const data = await response.json();
    return data;
  } finally {
    sessionStorage.removeItem('spotify_code_verifier');
  }
}

export function verifyState(state) {
  const storedState = sessionStorage.getItem('spotify_auth_state');
  sessionStorage.removeItem('spotify_auth_state');
  return state === storedState;
}

export function storeTokens(tokens) {
  const tokenData = {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: Date.now() + (tokens.expires_in * 1000),
  };
  localStorage.setItem('spotify_tokens', JSON.stringify(tokenData));
}

export function getStoredTokens() {
  const tokenData = localStorage.getItem('spotify_tokens');
  if (!tokenData) return null;
  
  const tokens = JSON.parse(tokenData);
  
  if (Date.now() >= tokens.expires_at) {
    return null;
  }
  
  return tokens;
}

export async function refreshAccessToken(refreshToken) {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  
  try {
    const response = await fetch(SPOTIFY_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error refreshing token:', error);
    localStorage.removeItem('spotify_tokens');
    throw error;
  }
}

export async function getValidAccessToken() {
  const tokens = getStoredTokens();
  
  if (!tokens) {
    return null;
  }
  
  if (Date.now() >= tokens.expires_at - 5 * 60 * 1000) {
    if (tokens.refresh_token) {
      try {
        const newTokens = await refreshAccessToken(tokens.refresh_token);
        const updatedTokens = {
          access_token: newTokens.access_token,
          refresh_token: tokens.refresh_token, 
          expires_at: Date.now() + (newTokens.expires_in * 1000),
        };
        localStorage.setItem('spotify_tokens', JSON.stringify(updatedTokens));
        return updatedTokens.access_token;
      } catch (error) {
        return null;
      }
    }
    return null;
  }
  
  return tokens.access_token;
}

export async function isAuthenticated() {
  const token = await getValidAccessToken();
  return !!token;
}

export function logout() {
  localStorage.removeItem('spotify_tokens');
  localStorage.removeItem('spotify_user_profile');
}

export async function getUserProfile() {
  const token = await getValidAccessToken();
  
  if (!token) {
    return null;
  }
  
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('spotify_tokens');
        return null;
      }
      throw new Error('Failed to fetch user profile');
    }
    
    const data = await response.json();
    localStorage.setItem('spotify_user_profile', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export function getStoredUserProfile() {
  const profileData = localStorage.getItem('spotify_user_profile');
  if (!profileData) return null;
  return JSON.parse(profileData);
}

export async function getUserTopArtists(timeRange = 'medium_term', limit = 20) {
  const token = await getValidAccessToken();
  
  if (!token) {
    throw new Error('Not authenticated');
  }
  
  try {
    const params = new URLSearchParams({
      time_range: timeRange, 
      limit: limit.toString(),
    });
    
    const response = await fetch(`https://api.spotify.com/v1/me/top/artists?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('spotify_tokens');
        throw new Error('Authentication expired. Please log in again.');
      }
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch top artists');
    }
    
    const data = await response.json();
    return data.items; 
  } catch (error) {
    console.error('Error fetching top artists:', error);
    throw error;
  }
}
