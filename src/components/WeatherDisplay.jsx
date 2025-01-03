import { useQuery } from '@tanstack/react-query';
import { getWeather } from '../services/weatherService';

const weatherCodes = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  95: 'Thunderstorm'
};

function WeatherDisplay({ latitude, longitude }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['weather', latitude, longitude],
    queryFn: () => getWeather(latitude, longitude),
    enabled: !!latitude && !!longitude,
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
        <p className="text-red-800">Error loading weather data: {error.message}</p>
      </div>
    );
  }

  if (!data) return null;

  const weatherCode = data.current.weathercode;
  const temperature = data.current.temperature_2m;
  const humidity = data.current.relative_humidity_2m;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Current Weather</h2>
      <div className="space-y-2">
        <p className="text-lg">
          <span className="font-medium">Condition:</span>{' '}
          {weatherCodes[weatherCode] || 'Unknown'}
        </p>
        <p className="text-lg">
          <span className="font-medium">Temperature:</span> {temperature}°C
        </p>
        <p className="text-lg">
          <span className="font-medium">Humidity:</span> {humidity}%
        </p>
      </div>
    </div>
  );
}

export default WeatherDisplay;
