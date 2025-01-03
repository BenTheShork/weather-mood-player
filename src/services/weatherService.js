const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function getWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: 'temperature_2m,weathercode,relative_humidity_2m',
    timezone: 'auto'
  });

  const response = await fetch(`${BASE_URL}?${params}`);
  if (!response.ok) {
    throw new Error('Weather data fetch failed');
  }
  return response.json();
}
