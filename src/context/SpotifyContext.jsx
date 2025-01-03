import { createContext, useContext, useState } from 'react';
import { spotifyService } from '../services/spotifyService';

const SpotifyContext = createContext(null);

export function SpotifyProvider({ children }) {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem('spotify_access_token')
  );

  const login = () => {
    window.location.href = spotifyService.getAuthUrl();
  };

  const logout = () => {
    localStorage.removeItem('spotify_access_token');
    setAccessToken(null);
  };

  return (
    <SpotifyContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </SpotifyContext.Provider>
  );
}

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};