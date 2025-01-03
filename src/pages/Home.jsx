import { useGeolocation } from '../hooks/useGeolocation';
import WeatherDisplay from '../components/WeatherDisplay';

function Home() {
  const { location, error: locationError, loading: locationLoading } = useGeolocation();

  if (locationLoading) {
    return (
      <div className="text-center p-4">
        <p>Getting your location...</p>
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
      {location && (
        <WeatherDisplay
          latitude={location.latitude}
          longitude={location.longitude}
        />
      )}
    </div>
  );
}

export default Home;