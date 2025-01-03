import { useQuery } from '@tanstack/react-query';
import { useSpotify } from '../context/SpotifyContext';
import { spotifyService } from '../services/spotifyService';
import TrackAnalysis from './TrackAnalysis';

function LikedSongs({ likedSongs }) {
  if (!likedSongs?.items) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Your Liked Songs</h2>
        <p className="text-gray-500">Loading songs...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">
        Your Liked Songs ({likedSongs.items.length})
      </h2>
      <div className="space-y-4 max-h-[70vh] overflow-y-auto">
        {likedSongs.items.map((item) => (
          <div 
            key={item.track.id} 
            className="flex items-center space-x-4 hover:bg-gray-50 p-2 rounded"
          >
            <img
              src={item.track.album.images[2]?.url}
              alt={item.track.album.name}
              className="w-12 h-12 rounded shadow"
            />
            <div className="flex-grow">
              <p className="font-medium">{item.track.name}</p>
              <p className="text-gray-600">
                {item.track.artists.map(artist => artist.name).join(', ')}
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