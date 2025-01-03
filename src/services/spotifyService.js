const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = 'http://localhost:5173/callback';
const SCOPE = 'user-library-read';

export const spotifyService = {
  getAuthUrl() {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'token',
      redirect_uri: REDIRECT_URI,
      scope: SCOPE,
    });
    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  },

  async getAllLikedSongs(accessToken) {
    const limit = 50;
    let offset = 0;
    let allSongs = [];
    
    while (true) {
      const response = await fetch(
        `https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch liked songs');
      }
      
      const data = await response.json();
      allSongs = [...allSongs, ...data.items];
      
      if (data.items.length < limit) {
        break;
      }
      
      offset += limit;
    }
    
    return { items: allSongs, total: allSongs.length };
  },
};