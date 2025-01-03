import { BASE_WEATHER_MAPPINGS, TIME_PREFERENCES, SEASON_PREFERENCES } from '../constants/weatherPreferences';

export const weatherMusicMatcher = {
  TIME_PREFERENCES,
  SEASON_PREFERENCES,

  getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  },

  getSeason() {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  },

  getTemperatureCategory(temperature) {
    if (temperature < 0) return 'freezing';
    if (temperature < 10) return 'cold';
    if (temperature < 20) return 'mild';
    if (temperature < 30) return 'warm';
    return 'hot';
  },

  calculateSongScore(weatherCode, songTags, temperature) {
    if (!songTags?.originalTags) {
      const convertedTags = [];
      
      if (songTags.moods) {
        songTags.moods.forEach(mood => {
          convertedTags.push({ name: mood, count: 100 });
        });
      }
      if (songTags.weather) {
        songTags.weather.forEach(weather => {
          convertedTags.push({ name: weather, count: 100 });
        });
      }
      if (songTags.genres) {
        songTags.genres.forEach(genre => {
          convertedTags.push({ name: genre, count: 100 });
        });
      }

      songTags.originalTags = convertedTags;
    }

    const weatherPreferences = BASE_WEATHER_MAPPINGS[weatherCode] || BASE_WEATHER_MAPPINGS[0];
    let score = 10;
    let hasOppositeTag = false;

    const weatherScore = this.calculateWeatherScore({
      windSpeed: temperature?.windSpeed,
      cloudCover: temperature?.cloudcover,
      visibility: temperature?.visibility,
      isDay: temperature?.is_day,
      precipitation: temperature?.precipitation
    }, songTags);

    score += weatherScore * 1.5;

    songTags.originalTags.slice(0, 5).forEach(tag => {
      const tagName = tag.name.toLowerCase();
      const weight = (tag.count / 40);

      if (weatherPreferences.moods.includes(tagName)) score += 8 * weight;
      if (weatherPreferences.weather.includes(tagName)) score += 6 * weight;
      if (weatherPreferences.genres.includes(tagName)) score += 4 * weight;

      if (['christmas', 'winter', 'holiday', 'festive', 'cozy'].includes(tagName)) {
        score += 40 * weight;
      }

      const oppositePairs = {
        happy: ['sad', 'melancholic'],
        upbeat: ['mellow', 'calm'],
        energetic: ['calm', 'peaceful'],
        sunny: ['rainy', 'stormy'],
        summer: ['winter'],
        hot: ['cold'],
        intense: ['peaceful', 'calm']
      };

      if (oppositePairs[tagName]) {
        const hasOpposite = oppositePairs[tagName].some(opp => 
          songTags.originalTags.slice(0, 5).some(t => t.name.toLowerCase() === opp)
        );
        if (hasOpposite) hasOppositeTag = true;
      }
    });

    songTags.originalTags.slice(5).forEach(tag => {
      const tagName = tag.name.toLowerCase();
      const weight = tag.count / 80;

      if (weatherPreferences.moods.includes(tagName)) score += 4 * weight;
      if (weatherPreferences.weather.includes(tagName)) score += 3 * weight;
      if (weatherPreferences.genres.includes(tagName)) score += 2 * weight;
    });

    const contextScore = this.calculateContextScore(songTags, this.getTimeOfDay(), this.getSeason(), temperature);
    score += contextScore * 1.2;

    const tempScore = this.calculateTemperatureScore(songTags, this.getTemperatureCategory(temperature));
    score += tempScore * 1.3;

    if (hasOppositeTag) score *= 0.4;

    if (this.getSeason() === 'winter' && 
        songTags.originalTags.some(tag => 
          ['winter', 'christmas', 'holiday', 'festive'].includes(tag.name.toLowerCase())
        )) {
      score *= 1.7;
    }

    return Math.min(100, Math.round(score));
  },

  calculateContextScore(songTags, timeOfDay, season, temperature) {
    let score = 0;
    const timePrefs = TIME_PREFERENCES[timeOfDay];
    const seasonPrefs = SEASON_PREFERENCES[season];

    if (timePrefs) {
      timePrefs.moods.forEach(mood => {
        if (songTags.moods?.includes(mood)) score += 4;
      });
      timePrefs.genres.forEach(genre => {
        if (songTags.genres?.includes(genre)) score += 3;
      });
      timePrefs.boost.forEach(tag => {
        if (songTags.moods?.includes(tag)) score += 5;
      });
    }

    if (seasonPrefs) {
      const winterSpecificTags = ['winter', 'christmas', 'holiday', 'festive'];
      const hasWinterTag = songTags.moods?.some(mood => 
        winterSpecificTags.includes(mood.toLowerCase())
      );

      if (hasWinterTag) score += 20;

      seasonPrefs.boost.forEach(tag => {
        if (songTags.moods?.includes(tag)) score += 5;
      });
      seasonPrefs.genres.forEach(genre => {
        if (songTags.genres?.includes(genre)) score += 3;
      });
    }

    return score;
  },

  calculateTemperatureScore(songTags, tempCategory) {
    const tempPreferences = {
      freezing: ['cold', 'winter', 'atmospheric', 'peaceful', 'ice', 'snow'],
      cold: ['melancholic', 'atmospheric', 'winter', 'calm', 'cozy'],
      mild: ['peaceful', 'gentle', 'mellow', 'smooth', 'pleasant'],
      warm: ['upbeat', 'bright', 'summer', 'happy', 'sunshine'],
      hot: ['energetic', 'summer', 'upbeat', 'dance', 'tropical']
    };

    let score = 0;
    tempPreferences[tempCategory]?.forEach(tag => {
      if (songTags.moods?.includes(tag)) score += 4;
      if (songTags.weather?.includes(tag)) score += 4;
    });
    return score;
  },

  calculateWeatherScore(weatherData, songTags) {
    let score = 0;
    
    if (weatherData.windSpeed > 30) {
      score += this.matchTags(songTags, ['intense', 'powerful', 'strong', 'wild']) * 1.5;
    } else if (weatherData.windSpeed > 15) {
      score += this.matchTags(songTags, ['energetic', 'dynamic', 'upbeat']);
    }

    if (weatherData.cloudCover > 80) {
      score += this.matchTags(songTags, ['moody', 'dark', 'atmospheric', 'gloomy']) * 1.2;
    } else if (weatherData.cloudCover < 20) {
      score += this.matchTags(songTags, ['bright', 'sunny', 'clear', 'warm']) * 1.2;
    }

    if (weatherData.visibility < 5000) {
      score += this.matchTags(songTags, ['mysterious', 'ethereal', 'dreamy', 'foggy']) * 1.3;
    }

    if (!weatherData.isDay) {
      score += this.matchTags(songTags, ['dark', 'night', 'nocturnal', 'mysterious']) * 1.1;
    }

    if (weatherData.precipitation > 5) {
      score += this.matchTags(songTags, ['intense', 'dramatic', 'heavy', 'stormy']) * 1.4;
    } else if (weatherData.precipitation > 0) {
      score += this.matchTags(songTags, ['gentle', 'soft', 'melancholic', 'peaceful']);
    }

    return score;
  },

  matchTags(songTags, targetTags) {
    return targetTags.reduce((score, tag) => {
      if (songTags.moods?.includes(tag)) score += 3;
      if (songTags.weather?.includes(tag)) score += 3;
      return score;
    }, 0);
  },

  findMatchingSongs(weatherCode, songs, temperature) {
    if (!songs?.length) return [];

    return songs
      .map(song => ({
        ...song,
        weatherScore: this.calculateSongScore(weatherCode, song.tags, temperature)
      }))
      .sort((a, b) => b.weatherScore - a.weatherScore)
      .filter(song => song.weatherScore > 20);
  },

  getWeatherDescription(weatherCode) {
    const descriptions = {
      0: 'Clear skies',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Foggy',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Light rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Light snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      95: 'Thunderstorm'
    };
    return descriptions[weatherCode] || 'Unknown weather';
  }
};