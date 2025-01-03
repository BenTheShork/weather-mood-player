const createWeatherMapping = (moods, weather, genres) => ({ moods, weather, genres });

export const BASE_WEATHER_MAPPINGS = {
  // Clear conditions
  0: createWeatherMapping(
    ['happy', 'upbeat', 'energetic', 'positive', 'bright', 'cheerful', 'optimistic', 'sunshine', 'exuberant', 'joyful', 'vibrant', 'euphoric'],
    ['sunny', 'summer', 'hot', 'clear', 'sunshine', 'warm', 'bright', 'daylight', 'tropical', 'heat'],
    ['pop', 'dance', 'indie', 'reggae', 'latin', 'funk', 'pop rock', 'indie pop', 'dance-pop', 'tropical', 'summer', 'beach', 'latin pop', 'disco']
  ),
  1: createWeatherMapping(
    ['happy', 'upbeat', 'mellow', 'peaceful', 'bright', 'gentle', 'positive', 'pleasant', 'comfortable', 'light', 'fresh', 'airy'],
    ['sunny', 'warm', 'mild', 'clear', 'breezy', 'light wind', 'pleasant', 'comfortable', 'spring-like'],
    ['indie', 'pop', 'folk', 'acoustic', 'pop rock', 'folk rock', 'indie folk', 'chamber pop', 'soft rock', 'contemporary folk']
  ),
  2: createWeatherMapping(
    ['mellow', 'peaceful', 'calm', 'gentle', 'relaxing', 'tranquil', 'serene', 'balanced', 'harmonious', 'easy', 'light'],
    ['mild', 'spring', 'breezy', 'temperate', 'moderate', 'partly cloudy', 'scattered clouds', 'light breeze'],
    ['folk', 'indie', 'acoustic', 'ambient', 'chillout', 'lo-fi', 'indie folk', 'chamber music', 'easy listening', 'acoustic pop']
  ),
  3: createWeatherMapping(
    ['mellow', 'atmospheric', 'dreamy', 'calm', 'moody', 'nostalgic', 'contemplative', 'introspective', 'reflective', 'pensive'],
    ['cloudy', 'overcast', 'mild', 'grey', 'dim', 'gloomy', 'heavy clouds', 'dark clouds'],
    ['ambient', 'indie', 'alternative', 'shoegaze', 'dreampop', 'post-rock', 'atmospheric', 'experimental', 'art rock', 'ambient pop']
  ),

  // Foggy conditions
  45: createWeatherMapping(
    ['atmospheric', 'dreamy', 'moody', 'dark', 'mysterious', 'strange', 'ethereal', 'surreal', 'ghostly', 'eerie', 'haunting'],
    ['cold', 'fog', 'mist', 'haze', 'murky', 'thick fog', 'dense', 'visibility', 'damp'],
    ['ambient', 'electronic', 'instrumental', 'experimental', 'dark ambient', 'atmospheric', 'drone', 'soundscape', 'avant-garde', 'cinematic']
  ),

  // Drizzle conditions
  51: createWeatherMapping(
    ['melancholic', 'calm', 'peaceful', 'mellow', 'nostalgic', 'gentle', 'soft', 'quiet', 'intimate', 'tender', 'delicate'],
    ['rainy', 'drizzle', 'mist', 'light rain', 'sprinkle', 'wet', 'moisture', 'light precipitation'],
    ['jazz', 'ambient', 'classical', 'piano', 'instrumental', 'lo-fi', 'chamber music', 'minimalist', 'contemporary classical', 'smooth jazz']
  ),
  53: createWeatherMapping(
    ['melancholic', 'atmospheric', 'emotional', 'mellow', 'intimate', 'dreamy', 'bittersweet', 'sentimental', 'wistful'],
    ['rainy', 'drizzle', 'wet', 'steady rain', 'persistent', 'damp', 'grey', 'humid'],
    ['jazz', 'indie', 'alternative', 'trip-hop', 'ambient', 'acoustic', 'neo-classical', 'fusion', 'world', 'downtempo']
  ),
  55: createWeatherMapping(
    ['melancholic', 'moody', 'atmospheric', 'emotional', 'dark', 'introspective', 'brooding', 'somber', 'gloomy', 'heavy'],
    ['rainy', 'cloudy', 'wet', 'drizzle', 'heavy drizzle', 'persistent rain', 'grey weather', 'dark clouds'],
    ['indie', 'alternative', 'ambient', 'post-rock', 'shoegaze', 'experimental', 'dark ambient', 'atmospheric', 'art rock', 'avant-garde']
  ),

  // Rain conditions
  61: createWeatherMapping(
    ['melancholic', 'atmospheric', 'emotional', 'peaceful', 'contemplative', 'reflective', 'thoughtful', 'introspective', 'meditative'],
    ['rainy', 'shower', 'wet', 'light rain', 'scattered showers', 'intermittent', 'fresh rain'],
    ['indie', 'jazz', 'alternative', 'classical', 'piano', 'acoustic', 'chamber music', 'instrumental', 'contemporary classical', 'ambient']
  ),
  63: createWeatherMapping(
    ['moody', 'intense', 'atmospheric', 'emotional', 'dramatic', 'passionate', 'powerful', 'deep', 'strong', 'dynamic'],
    ['rainy', 'downpour', 'storm', 'heavy rain', 'wind', 'thunder', 'dark clouds', 'turbulent'],
    ['rock', 'alternative', 'indie', 'post-rock', 'progressive', 'art rock', 'symphonic rock', 'progressive rock', 'alternative rock']
  ),
  65: createWeatherMapping(
    ['intense', 'dramatic', 'atmospheric', 'powerful', 'epic', 'dark', 'heavy', 'fierce', 'wild', 'chaotic', 'turbulent'],
    ['rainy', 'stormy', 'downpour', 'squall', 'torrential', 'wind', 'thunder', 'tempest', 'deluge'],
    ['rock', 'electronic', 'alternative', 'metal', 'industrial', 'progressive metal', 'symphonic metal', 'post-metal', 'industrial metal']
  ),

  // Snow conditions
  71: createWeatherMapping(
    ['peaceful', 'calm', 'gentle', 'soft', 'quiet', 'tranquil', 'serene', 'delicate', 'pure', 'clean'],
    ['cold', 'winter', 'snow', 'frost', 'light snow', 'flurries', 'crisp', 'icy', 'frozen'],
    ['classical', 'ambient', 'instrumental', 'piano', 'acoustic', 'chamber music', 'minimalist', 'neo-classical', 'contemporary classical']
  ),
  73: createWeatherMapping(
    ['peaceful', 'atmospheric', 'dreamy', 'gentle', 'ethereal', 'mystical', 'floating', 'celestial', 'enchanting'],
    ['cold', 'winter', 'snow', 'frost', 'ice', 'snowfall', 'freezing', 'white', 'crystalline'],
    ['ambient', 'classical', 'instrumental', 'electronic', 'post-rock', 'drone', 'space music', 'atmospheric', 'contemporary classical']
  ),
  75: createWeatherMapping(
    ['atmospheric', 'intense', 'dramatic', 'powerful', 'epic', 'majestic', 'grand', 'overwhelming', 'sublime'],
    ['cold', 'winter', 'storm', 'blizzard', 'ice', 'heavy snow', 'whiteout', 'arctic', 'polar'],
    ['classical', 'electronic', 'ambient', 'post-rock', 'symphonic', 'orchestral', 'cinematic', 'contemporary classical', 'avant-garde']
  ),

  // Thunderstorm
  95: createWeatherMapping(
    ['intense', 'dramatic', 'powerful', 'epic', 'dark', 'chaotic', 'fierce', 'wild', 'primal', 'savage', 'violent'],
    ['stormy', 'thunder', 'lightning', 'rain', 'wind', 'tempest', 'turbulent', 'squall', 'thunderous'],
    ['rock', 'metal', 'electronic', 'industrial', 'symphonic', 'heavy metal', 'industrial metal', 'progressive metal', 'symphonic metal']
  ),
};

export const TIME_PREFERENCES = {
  morning: {
    moods: ['energetic', 'upbeat', 'bright', 'positive', 'fresh', 'optimistic', 'invigorating', 'awakening', 'crisp', 'vibrant', 'lively', 'dynamic'],
    genres: ['pop', 'indie', 'electronic', 'funk', 'acoustic', 'dance', 'tropical house', 'uplifting trance', 'morning jazz', 'power pop'],
    boost: ['uplifting', 'fresh', 'light', 'energetic', 'bright', 'awakening', 'invigorating', 'motivating', 'refreshing']
  },
  afternoon: {
    moods: ['happy', 'mellow', 'peaceful', 'warm', 'bright', 'cheerful', 'pleasant', 'balanced', 'comfortable', 'content', 'relaxed'],
    genres: ['indie', 'pop', 'folk', 'rock', 'soul', 'funk', 'indie pop', 'soft rock', 'contemporary', 'acoustic pop'],
    boost: ['bright', 'smooth', 'gentle', 'warm', 'upbeat', 'pleasant', 'comfortable', 'easy', 'flowing']
  },
  evening: {
    moods: ['relaxing', 'mellow', 'atmospheric', 'romantic', 'smooth', 'intimate', 'gentle', 'soothing', 'calm', 'peaceful', 'tranquil'],
    genres: ['jazz', 'ambient', 'soul', 'rb', 'lounge', 'classical', 'smooth jazz', 'downtempo', 'chill', 'neo-soul'],
    boost: ['chill', 'smooth', 'soft', 'mellow', 'romantic', 'relaxing', 'intimate', 'gentle', 'peaceful']
  },
  night: {
    moods: ['atmospheric', 'dark', 'dreamy', 'deep', 'mysterious', 'cosmic', 'nocturnal', 'ethereal', 'mystical', 'surreal', 'enchanting'],
    genres: ['electronic', 'ambient', 'alternative', 'techno', 'experimental', 'trip-hop', 'dark ambient', 'downtempo', 'idm', 'minimal'],
    boost: ['dark', 'moody', 'deep', 'atmospheric', 'cosmic', 'mysterious', 'nocturnal', 'dreamy', 'ethereal']
  }
};

export const SEASON_PREFERENCES = {
  spring: {
    boost: ['fresh', 'light', 'uplifting', 'bright', 'gentle', 'peaceful', 'new', 'awakening', 'renewing', 'blossoming', 'crisp', 'clean'],
    genres: ['indie', 'pop', 'folk', 'acoustic', 'classical', 'ambient', 'chamber pop', 'indie folk', 'contemporary classical', 'pastoral']
  },
  summer: {
    boost: ['energetic', 'upbeat', 'sunny', 'warm', 'bright', 'happy', 'hot', 'tropical', 'vibrant', 'lively', 'dynamic', 'passionate'],
    genres: ['pop', 'dance', 'reggae', 'funk', 'electronic', 'latin', 'tropical house', 'beach', 'summer pop', 'disco']
  },
  autumn: {
    boost: ['melancholic', 'atmospheric', 'moody', 'peaceful', 'nostalgic', 'dreamy', 'reflective', 'contemplative', 'introspective', 'wistful'],
    genres: ['indie', 'folk', 'alternative', 'jazz', 'acoustic', 'post-rock', 'chamber folk', 'neo-folk', 'ambient folk', 'acoustic rock']
  },
  winter: {
    boost: ['cold', 'atmospheric', 'dramatic', 'peaceful', 'ethereal', 'dark', 'icy', 'crystalline', 'frozen', 'stark', 'minimal', 'pure'],
    genres: ['classical', 'ambient', 'electronic', 'post-rock', 'experimental', 'piano', 'minimal', 'contemporary classical', 'dark ambient']
  }
};