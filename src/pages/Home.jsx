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
  });

  const { data: weather, isLoading: isLoadingWeather } = useQuery({
    queryKey: ['weather', location?.latitude, location?.longitude],
    queryFn: () => fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,weathercode`
    ).then(res => res.json()),
    enabled: !!location,
  });

  const { data: songsWithTags, isLoading: isLoadingTags } = useQuery({
    queryKey: ['songs-with-tags', likedSongs?.items],
    queryFn: async () => {
      const processedSongs = await Promise.all(
        likedSongs.items.map(async (item) => {
          try {
            const tags = await lastFmService.getAllPossibleTags(
              item.track.artists[0].name,
              item.track.name
            );
            return {
              ...item,
              tags: lastFmService.processTags(tags)
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

  return (
    <div className="space-y-6">
      {location && weather && (
        <WeatherDisplay
          temperature={weather.current.temperature_2m}
          weatherCode={weather.current.weathercode}
        />
      )}
      
      {!accessToken ? (
        <SpotifyLogin />
      ) : (
        <>
          {weather?.current && songsWithTags && (
          <WeatherPlaylist 
            weatherCode={weather.current.weathercode}
            temperature={weather.current.temperature_2m}
            songs={songsWithTags}
          />
        )}
          <LikedSongs />
        </>
      )}
    </div>
  );
}

export default Home;