const BASE_WEATHER_MAPPINGS  = {
    // Clear sky
    0: {
      moods: ['happy', 'upbeat', 'energetic', 'positive', 'bright'],
      weather: ['sunny', 'summer', 'hot'],
      genres: ['pop', 'dance', 'indie']
    },
    // Mainly clear, partly cloudy
    1: {
      moods: ['happy', 'upbeat', 'mellow', 'peaceful'],
      weather: ['sunny', 'warm'],
      genres: ['indie', 'pop', 'folk']
    },
    // Partly cloudy
    2: {
      moods: ['mellow', 'peaceful', 'calm', 'gentle'],
      weather: ['warm', 'spring'],
      genres: ['folk', 'indie', 'pop']
    },
    // Overcast
    3: {
      moods: ['mellow', 'atmospheric', 'dreamy', 'calm'],
      weather: ['cloudy'],
      genres: ['ambient', 'indie', 'alternative']
    },
    // Foggy
    45: {
      moods: ['atmospheric', 'dreamy', 'moody', 'dark'],
      weather: ['cold'],
      genres: ['ambient', 'electronic', 'instrumental']
    },
    // Light drizzle
    51: {
      moods: ['melancholic', 'calm', 'peaceful', 'mellow'],
      weather: ['rainy'],
      genres: ['jazz', 'ambient', 'classical']
    },
    // Moderate drizzle
    53: {
      moods: ['melancholic', 'atmospheric', 'emotional', 'mellow'],
      weather: ['rainy'],
      genres: ['jazz', 'indie', 'alternative']
    },
    // Dense drizzle
    55: {
      moods: ['melancholic', 'moody', 'atmospheric', 'emotional'],
      weather: ['rainy', 'cloudy'],
      genres: ['indie', 'alternative', 'ambient']
    },
    // Light rain
    61: {
      moods: ['melancholic', 'atmospheric', 'emotional', 'peaceful'],
      weather: ['rainy'],
      genres: ['indie', 'jazz', 'alternative']
    },
    // Moderate rain
    63: {
      moods: ['moody', 'intense', 'atmospheric', 'emotional'],
      weather: ['rainy'],
      genres: ['rock', 'alternative', 'indie']
    },
    // Heavy rain
    65: {
      moods: ['intense', 'dramatic', 'atmospheric', 'powerful'],
      weather: ['rainy', 'stormy'],
      genres: ['rock', 'electronic', 'alternative']
    },
    // Light snow
    71: {
      moods: ['peaceful', 'calm', 'gentle', 'soft'],
      weather: ['cold', 'winter'],
      genres: ['classical', 'ambient', 'instrumental']
    },
    // Moderate snow
    73: {
      moods: ['peaceful', 'atmospheric', 'dreamy', 'gentle'],
      weather: ['cold', 'winter'],
      genres: ['ambient', 'classical', 'instrumental']
    },
    // Heavy snow
    75: {
      moods: ['atmospheric', 'intense', 'dramatic', 'powerful'],
      weather: ['cold', 'winter', 'stormy'],
      genres: ['classical', 'electronic', 'ambient']
    },
    // Thunderstorm
    95: {
      moods: ['intense', 'dramatic', 'powerful', 'epic'],
      weather: ['stormy'],
      genres: ['rock', 'metal', 'electronic']
    }
  };

  const TIME_PREFERENCES = {
    morning: {
      moods: ['energetic', 'upbeat', 'bright', 'positive'],
      genres: ['pop', 'indie', 'electronic'],
      boost: ['uplifting', 'fresh', 'light']
    },
    afternoon: {
      moods: ['happy', 'mellow', 'peaceful', 'warm'],
      genres: ['indie', 'pop', 'folk'],
      boost: ['bright', 'smooth', 'gentle']
    },
    evening: {
      moods: ['relaxing', 'mellow', 'atmospheric', 'romantic'],
      genres: ['jazz', 'ambient', 'soul'],
      boost: ['chill', 'smooth', 'soft']
    },
    night: {
      moods: ['atmospheric', 'dark', 'dreamy', 'deep'],
      genres: ['electronic', 'ambient', 'alternative'],
      boost: ['dark', 'moody', 'deep']
    }
  };
  
  const SEASON_PREFERENCES = {
    spring: {
      boost: ['fresh', 'light', 'uplifting', 'bright'],
      genres: ['indie', 'pop', 'folk']
    },
    summer: {
      boost: ['energetic', 'upbeat', 'sunny', 'warm'],
      genres: ['pop', 'dance', 'reggae']
    },
    autumn: {
      boost: ['melancholic', 'atmospheric', 'moody', 'peaceful'],
      genres: ['indie', 'folk', 'alternative']
    },
    winter: {
      boost: ['cold', 'atmospheric', 'dramatic', 'peaceful'],
      genres: ['classical', 'ambient', 'electronic']
    }
  };
  
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
  
    calculateContextScore(songTags, timeOfDay, season, temperature) {
      let score = 0;
      const timePrefs = TIME_PREFERENCES[timeOfDay];
      const seasonPrefs = SEASON_PREFERENCES[season];
  
      if (timePrefs) {
        timePrefs.moods.forEach(mood => {
          if (songTags.moods?.includes(mood)) score += 2;
        });
        timePrefs.genres.forEach(genre => {
          if (songTags.genres?.includes(genre)) score += 1;
        });
        timePrefs.boost.forEach(tag => {
          if (songTags.moods?.includes(tag)) score += 1.5;
        });
      }
  
      if (seasonPrefs) {
        seasonPrefs.boost.forEach(tag => {
          if (songTags.moods?.includes(tag)) score += 2;
        });
        seasonPrefs.genres.forEach(genre => {
          if (songTags.genres?.includes(genre)) score += 1;
        });
      }
  
      const tempCategory = this.getTemperatureCategory(temperature);
      const tempScore = this.calculateTemperatureScore(songTags, tempCategory);
      score += tempScore;
  
      return score;
    },
  
    calculateTemperatureScore(songTags, tempCategory) {
      const tempPreferences = {
        freezing: ['cold', 'winter', 'atmospheric', 'peaceful'],
        cold: ['melancholic', 'atmospheric', 'winter', 'calm'],
        mild: ['peaceful', 'gentle', 'mellow', 'smooth'],
        warm: ['upbeat', 'bright', 'summer', 'happy'],
        hot: ['energetic', 'summer', 'upbeat', 'dance']
      };
  
      let score = 0;
      tempPreferences[tempCategory]?.forEach(tag => {
        if (songTags.moods?.includes(tag) || songTags.weather?.includes(tag)) {
          score += 2;
        }
      });
      return score;
    },
  
    calculateMoodConsistency(songTags) {
      const moodGroups = {
        positive: ['happy', 'upbeat', 'energetic', 'bright'],
        mellow: ['peaceful', 'calm', 'gentle', 'soft'],
        dark: ['melancholic', 'moody', 'dark', 'intense'],
        atmospheric: ['dreamy', 'atmospheric', 'ambient', 'smooth']
      };
  
      let groupCounts = Object.keys(moodGroups).map(group => ({
        group,
        count: moodGroups[group].filter(mood => songTags.moods?.includes(mood)).length
      }));
  
      let dominantGroup = groupCounts.reduce((a, b) => a.count > b.count ? a : b);
      return dominantGroup.count > 0 ? dominantGroup.count * 1.5 : 0;
    },
  
    calculateSongScore(weatherCode, songTags, temperature) {
      if (!songTags || !songTags.moods || !songTags.weather || !songTags.genres) {
        return 0;
      }
  
      const weatherPreferences = BASE_WEATHER_MAPPINGS[weatherCode] || BASE_WEATHER_MAPPINGS[0];
      const timeOfDay = this.getTimeOfDay();
      const season = this.getSeason();
      
      let score = 0;
      let hasOppositeTag = false;
  
      score += this.calculateMoodConsistency(songTags);
      
      weatherPreferences.moods.forEach(mood => {
        if (songTags.moods?.includes(mood)) score += 3;
      });
  
      weatherPreferences.weather.forEach(weather => {
        if (songTags.weather?.includes(weather)) score += 2;
      });
  
      weatherPreferences.genres.forEach(genre => {
        if (songTags.genres?.includes(genre)) score += 1;
      });
  
      const contextScore = this.calculateContextScore(songTags, timeOfDay, season, temperature);
      score += contextScore;
  
      const opposites = {
        happy: ['sad', 'melancholic'],
        upbeat: ['mellow', 'calm'],
        energetic: ['calm', 'peaceful'],
        sunny: ['rainy', 'stormy'],
        summer: ['winter'],
        hot: ['cold'],
        intense: ['peaceful', 'calm']
      };
  
      Object.entries(opposites).forEach(([mood, opposites]) => {
        if (songTags.moods?.includes(mood) && 
            opposites.some(opp => songTags.moods?.includes(opp))) {
          hasOppositeTag = true;
        }
      });
  
      if (hasOppositeTag) {
        score *= 0.3;
      }
  
      return Math.min(100, Math.round(score * 2));
    },
  
    findMatchingSongs(weatherCode, songs, temperature) {
      return songs
        .map(song => ({
          ...song,
          weatherScore: this.calculateSongScore(weatherCode, song.tags, temperature)
        }))
        .sort((a, b) => b.weatherScore - a.weatherScore)
        .filter(song => song.weatherScore > 30);
    },
    calculateSongScore(weatherCode, songTags) {
      if (!songTags || !songTags.moods || !songTags.weather || !songTags.genres) {
        return 0;
      }
  
      const weatherPreferences = BASE_WEATHER_MAPPINGS [weatherCode] || BASE_WEATHER_MAPPINGS [0];
      let score = 0;
      let hasOppositeTag = false;
      
      const oppositePairs = {
        'happy': ['sad', 'melancholic'],
        'upbeat': ['mellow', 'calm'],
        'energetic': ['calm', 'peaceful'],
        'sunny': ['rainy', 'stormy'],
        'summer': ['winter'],
        'hot': ['cold'],
        'intense': ['peaceful', 'calm'],
      };
      
      weatherPreferences.moods.forEach(mood => {
        if (songTags.moods?.includes(mood)) {
          score += 3;
        }
        const opposites = oppositePairs[mood];
        if (opposites && opposites.some(opp => songTags.moods?.includes(opp))) {
          hasOppositeTag = true;
        }
      });
      
      weatherPreferences.weather.forEach(weather => {
        if (songTags.weather?.includes(weather)) {
          score += 2;
        }
        const opposites = oppositePairs[weather];
        if (opposites && opposites.some(opp => songTags.weather?.includes(opp))) {
          hasOppositeTag = true;
        }
      });
      
      weatherPreferences.genres.forEach(genre => {
        if (songTags.genres?.includes(genre)) {
          score += 1;
        }
      });
  
      if (hasOppositeTag) {
        score = Math.floor(score * 0.3);
      }
      
      return score;
    },
  
    findMatchingSongs(weatherCode, songs) {
      return songs
        .map(song => ({
          ...song,
          weatherScore: this.calculateSongScore(weatherCode, song.tags)
        }))
        .sort((a, b) => b.weatherScore - a.weatherScore)
        .filter(song => song.weatherScore > 0);
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

  