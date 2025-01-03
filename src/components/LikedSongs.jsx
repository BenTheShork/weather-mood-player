import { useQuery } from '@tanstack/react-query';
import { useSpotify } from '../context/SpotifyContext';
import { spotifyService } from '../services/spotifyService';

function LikedSongs() {
  const { accessToken } = useSpotify();

  const { data, isLoading, error } = useQuery({
    queryKey: ['liked-songs'],
    queryFn: () => spotifyService.getAllLikedSongs(accessToken),
    enabled: !!accessToken,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-800">Error loading liked songs: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">
        Your Liked Songs
        {data && <span className="text-gray-500 ml-2">({data.total} songs)</span>}
      </h2>
      <div className="space-y-4 max-h-[70vh] overflow-y-auto">
        {data?.items.map((item) => (
          <div key={item.track.id} className="flex items-center space-x-4 hover:bg-gray-50 p-2 rounded">
            <img
              src={item.track.album.images[2]?.url}
              alt={item.track.album.name}
              className="w-12 h-12 rounded shadow"
            />
            <div className="flex-grow">
              <p className="font-medium">{item.track.name}</p>
              <p className="text-gray-600">
                {item.track.artists.map((artist) => artist.name).join(', ')}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {Math.floor(item.track.duration_ms / 60000)}:
              {String(Math.floor((item.track.duration_ms % 60000) / 1000)).padStart(2, '0')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LikedSongs;