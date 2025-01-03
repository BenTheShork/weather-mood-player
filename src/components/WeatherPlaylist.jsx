import { useEffect, useState } from 'react';
import { weatherMusicMatcher } from '../services/weatherMusicMatcher';
const { TIME_PREFERENCES, SEASON_PREFERENCES } = weatherMusicMatcher;

function WeatherPlaylist({ 
  weatherCode, 
  songs, 
  temperature = { 
    temperature: 20, 
    windSpeed: 0, 
    cloudcover: 50, 
    visibility: 10000, 
    is_day: true, 
    precipitation: 0 
  } 
}) {
  const [matchingSongs, setMatchingSongs] = useState([]);
  const weatherDescription = weatherMusicMatcher.getWeatherDescription(weatherCode);
  const timeOfDay = weatherMusicMatcher.getTimeOfDay();
  const season = weatherMusicMatcher.getSeason();
  const tempCategory = weatherMusicMatcher.getTemperatureCategory(
    typeof temperature === 'number' 
      ? temperature 
      : temperature.temperature || 20
  );

  useEffect(() => {
    if (!songs || !weatherCode) return;

    const processedTemperature = typeof temperature === 'number'
      ? { temperature }
      : temperature;

    const matches = weatherMusicMatcher.findMatchingSongs(
      weatherCode, 
      songs, 
      processedTemperature
    );
    setMatchingSongs(matches.slice(0, 50));
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          Perfect for {weatherDescription}
        </h2>
        <div className="flex gap-2 mt-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {timeOfDay} music
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            {season} vibes
          </span>
          <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
            {tempCategory} ({typeof temperature === 'number' ? temperature : temperature.temperature || 20}°C)
          </span>
        </div>
      </div>
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
                  {song.tags.moods?.map(mood => (
                    <span 
                      key={mood}
                      className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs"
                    >
                      {mood}
                    </span>
                  ))}
                  {song.tags.weather?.map(weather => (
                    <span 
                      key={weather}
                      className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs"
                    >
                      {weather}
                    </span>
                  ))}
                  {song.tags.genres?.map(genre => (
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
            <div className="text-sm flex flex-col items-end">
              <div className="text-gray-900 font-semibold">
                Score: {song.weatherScore}
              </div>
              <div className="text-xs text-gray-500">
                {TIME_PREFERENCES[timeOfDay].moods.some(mood => 
                  song.tags?.moods?.includes(mood)) ? '✓ time match' : ''}
              </div>
              <div className="text-xs text-gray-500">
                {SEASON_PREFERENCES[season].boost.some(mood => 
                  song.tags?.moods?.includes(mood)) ? '✓ season match' : ''}
              </div>
              <div className="text-xs text-gray-500">
                {weatherMusicMatcher.calculateTemperatureScore(song.tags, tempCategory) > 0 ? 
                  '✓ temp match' : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeatherPlaylist;