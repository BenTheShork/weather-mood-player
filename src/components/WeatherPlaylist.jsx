import { useEffect, useState } from 'react';
import { weatherMusicMatcher } from '../services/weatherMusicMatcher';

function WeatherPlaylist({ weatherCode, songs, temperature }) {
  const [matchingSongs, setMatchingSongs] = useState([]);
  const weatherDescription = weatherMusicMatcher.getWeatherDescription(weatherCode);
  const timeOfDay = weatherMusicMatcher.getTimeOfDay();
  const season = weatherMusicMatcher.getSeason();

  useEffect(() => {
    if (!songs || !weatherCode) return;

    const matches = weatherMusicMatcher.findMatchingSongs(weatherCode, songs, temperature);
    setMatchingSongs(matches.slice(0, 20));
  }, [weatherCode, songs, temperature]);

  if (!songs?.length) {
    return (
      <div className="bg-white shadow rounded-lg p-6 mt-6">
        <h2 className="text-2xl font-bold mb-4">Weather-Based Playlist</h2>
        <p className="text-gray-500">Loading your songs...</p>
      </div>
    );
  }

  if (matchingSongs.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 mt-6">
        <h2 className="text-2xl font-bold mb-4">Weather-Based Playlist</h2>
        <p className="text-gray-500">Looking for perfect songs for {weatherDescription}...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">
        Perfect for {weatherDescription}
      </h2>
      <div className="space-y-4">
        {matchingSongs.map((song) => (
          <div 
            key={song.track.id} 
            className="flex items-center space-x-4 hover:bg-gray-50 p-2 rounded"
          >
            <img
              src={song.track.album.images[2]?.url}
              alt={song.track.album.name}
              className="w-12 h-12 rounded shadow"
            />
            <div className="flex-grow">
              <p className="font-medium">{song.track.name}</p>
              <p className="text-gray-600">
                {song.track.artists.map(artist => artist.name).join(', ')}
              </p>
              {song.tags && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {song.tags.moods.map(mood => (
                    <span 
                      key={mood}
                      className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs"
                    >
                      {mood}
                    </span>
                  ))}
                  {song.tags.genres.map(genre => (
                    <span 
                      key={genre}
                      className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Score: {song.weatherScore}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeatherPlaylist;