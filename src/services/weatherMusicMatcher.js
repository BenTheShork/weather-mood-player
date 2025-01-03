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
        if (!songTags?.originalTags) return 0;
    
        const weatherPreferences = BASE_WEATHER_MAPPINGS[weatherCode] || BASE_WEATHER_MAPPINGS[0];
        let score = 0;
        let hasOppositeTag = false;
    
        songTags.originalTags.slice(0, 5).forEach(tag => {
          const tagName = tag.name.toLowerCase();
          const weight = (tag.count / 100) * 3; 
    
          if (weatherPreferences.moods.includes(tagName)) score += 3 * weight;
          if (weatherPreferences.weather.includes(tagName)) score += 2 * weight;
          if (weatherPreferences.genres.includes(tagName)) score += 1 * weight;
    
          const oppositePairs = {
            'happy': ['sad', 'melancholic'],
            'upbeat': ['mellow', 'calm'],
            'energetic': ['calm', 'peaceful'],
            'sunny': ['rainy', 'stormy'],
            'summer': ['winter'],
            'hot': ['cold'],
            'intense': ['peaceful', 'calm']
          };
    
          Object.entries(oppositePairs).forEach(([mood, opposites]) => {
            if (mood === tagName && opposites.some(opp => 
              songTags.originalTags.slice(0, 5).some(t => t.name.toLowerCase() === opp)
            )) {
              hasOppositeTag = true;
            }
          });
        });
    
        songTags.originalTags.slice(5).forEach(tag => {
          const tagName = tag.name.toLowerCase();
          const weight = tag.count / 100;
    
          if (weatherPreferences.moods.includes(tagName)) score += 3 * weight;
          if (weatherPreferences.weather.includes(tagName)) score += 2 * weight;
          if (weatherPreferences.genres.includes(tagName)) score += 1 * weight;
        });
    
        score += this.calculateContextScore(songTags, this.getTimeOfDay(), this.getSeason(), temperature);
    
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
          .filter(song => song.weatherScore > 15); 
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

  