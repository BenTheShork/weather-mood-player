import { useGeolocation } from '../hooks/useGeolocation';
import { useSpotify } from '../context/SpotifyContext';
import WeatherDisplay from '../components/WeatherDisplay';
import SpotifyLogin from '../components/SpotifyLogin';
import LikedSongs from '../components/LikedSongs';
import WeatherPlaylist from '../components/WeatherPlaylist';
import { useQuery } from '@tanstack/react-query';
import { spotifyService } from '../services/spotifyService';
import { lastFmService } from '../services/lastFmService';

function Home() {
  const { location, error: locationError, loading: locationLoading } = useGeolocation();
  const { accessToken } = useSpotify();

  const { data: likedSongs, isLoading: isLoadingSongs } = useQuery({
    queryKey: ['liked-songs'],
    queryFn: () => spotifyService.getAllLikedSongs(accessToken),
    enabled: !!accessToken,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const { data: weather, isLoading: isLoadingWeather } = useQuery({
    queryKey: ['weather', location?.latitude, location?.longitude],
    queryFn: async () => {
      if (!location?.latitude || !location?.longitude) return null;
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,weathercode,windspeed_10m,winddirection_10m,apparent_temperature,precipitation,rain,cloudcover,visibility,is_day`
      );
      return response.json();
    },
    enabled: !!location?.latitude && !!location?.longitude,
    staleTime: 30 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  const { data: songsWithTags, isLoading: isLoadingTags } = useQuery({
    queryKey: ['songs-with-tags', likedSongs?.items],
    queryFn: async () => {
      if (!likedSongs?.items) return null;
      const processedSongs = await Promise.all(
        likedSongs.items.map(async (item) => {
          try {
            const analysis = await lastFmService.getAllPossibleTags(
              item.track.artists[0].name,
              item.track.name
            );
            return {
              ...item,
              tags: lastFmService.processTags(analysis)
            };
          } catch (error) {
            console.error('Error processing track:', error);
            return null;
          }
        })
      );
      return processedSongs.filter(song => song !== null);
    },
    enabled: !!likedSongs?.items,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  if (locationLoading || isLoadingSongs || isLoadingWeather || isLoadingTags) {
    return (
      <div className="text-center p-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p>Loading your personalized weather playlist...</p>
        </div>
      </div>
    );
  }

  if (locationError) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-800">
          Error getting location: {locationError}
        </p>
        <p className="mt-2">
          Please enable location services to use this app.
        </p>
      </div>
    );
  }

  const weatherData = weather?.current;
  const hasWeatherData = !!weatherData;
  const hasSongsData = !!songsWithTags?.length;

  return (
    <div className="space-y-6">
      {hasWeatherData && (
        <WeatherDisplay
          temperature={weatherData.temperature_2m}
          weatherCode={weatherData.weathercode}
        />
      )}

      {!accessToken ? (
        <SpotifyLogin />
      ) : (
        <>
          {hasWeatherData && hasSongsData && (
            <WeatherPlaylist 
              weatherCode={weatherData.weathercode}
              temperature={weatherData.temperature_2m}
              windSpeed={weatherData.windspeed_10m}
              cloudCover={weatherData.cloudcover}
              visibility={weatherData.visibility}
              isDay={weatherData.is_day}
              precipitation={weatherData.precipitation}
              songs={songsWithTags}
            />
          )}
          {likedSongs && <LikedSongs likedSongs={likedSongs} />}
        </>
      )}
    </div>
  );
}

export default Home;