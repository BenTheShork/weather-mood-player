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

  calculateSongScore(weatherCode, song, temperature) {
    const songTags = song.tags;
    console.log('\n--- Song Scoring Analysis ---');
    console.log('Song:' + JSON.stringify(song.track.name));
    console.log('Tags:' + JSON.stringify(songTags));
    console.log(`Weather Code: ${weatherCode}, Temperature: ${JSON.stringify(temperature.temperature)}`);

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
      windSpeed: temperature?.windSpeed || 0,
      cloudCover: temperature?.cloudcover || 0,
      visibility: temperature?.visibility || 10000,
      isDay: temperature?.is_day !== undefined ? temperature.is_day : true,
      precipitation: temperature?.precipitation || 0
    }, songTags);
    console.log(`Initial Base Score: ${score}`);
    console.log(`Weather Score: ${weatherScore}`);
    score += weatherScore * 1.5;

    let topTagsScore = 0;
    songTags.originalTags.slice(0, 5).forEach(tag => {
      const tagName = tag.name.toLowerCase();
      const weight = (tag.count / 40);

      let tagScore = 0;
      if (weatherPreferences.moods.includes(tagName)) {
        tagScore += 8 * weight;
        console.log(`Mood Match: ${tagName} (+${8 * weight})`);
      }
      if (weatherPreferences.weather.includes(tagName)) {
        tagScore += 6 * weight;
        console.log(`Weather Match: ${tagName} (+${6 * weight})`);
      }
      if (weatherPreferences.genres.includes(tagName)) {
        tagScore += 4 * weight;
        console.log(`Genre Match: ${tagName} (+${4 * weight})`);
      }

      if (['christmas', 'winter', 'holiday', 'festive', 'cozy'].includes(tagName)) {
        const specialBonus = 40 * weight;
        tagScore += specialBonus;
        console.log(`Special Season Tag: ${tagName} (+${specialBonus})`);
      }

      topTagsScore += tagScore;

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
        if (hasOpposite) {
          hasOppositeTag = true;
          console.log(`Opposite Tag Detected: ${tagName}`);
        }
      }
    });
    score += topTagsScore;
    console.log(`Top Tags Score: ${topTagsScore}`);

    let remainingTagsScore = 0;
    songTags.originalTags.slice(5).forEach(tag => {
      const tagName = tag.name.toLowerCase();
      const weight = tag.count / 80;
      let tagScore = 0;

      if (weatherPreferences.moods.includes(tagName)) {
        tagScore += 4 * weight;
        console.log(`Remaining Mood Match: ${tagName} (+${4 * weight})`);
      }
      if (weatherPreferences.weather.includes(tagName)) {
        tagScore += 3 * weight;
        console.log(`Remaining Weather Match: ${tagName} (+${3 * weight})`);
      }
      if (weatherPreferences.genres.includes(tagName)) {
        tagScore += 2 * weight;
        console.log(`Remaining Genre Match: ${tagName} (+${2 * weight})`);
      }

      remainingTagsScore += tagScore;
    });
    score += remainingTagsScore;
    console.log(`Remaining Tags Score: ${remainingTagsScore}`);

    const contextScore = this.calculateContextScore(songTags, this.getTimeOfDay(), this.getSeason(), temperature);
    console.log(`Context Score: ${contextScore}`);
    score += contextScore * 1.2;

    const tempCategory = this.getTemperatureCategory(temperature.temperature);
    const tempScore = this.calculateTemperatureScore(songTags, tempCategory);
    console.log(`Temperature Score: ${tempScore}`);
    console.log(`Temperature Category: ${tempCategory}`);
    score += tempScore * 1.3;

    if (hasOppositeTag) {
      score *= 0.4;
      console.log('Opposite Tag Penalty Applied');
    }

    const currentSeason = this.getSeason();
    const isWinterSong = songTags.originalTags.some(tag => 
      ['winter', 'christmas', 'holiday', 'festive'].includes(tag.name.toLowerCase())
    );

    if (currentSeason === 'winter' && isWinterSong) {
      const winterBonus = 1.7;
      score *= winterBonus;
      console.log(`Winter Season Bonus Applied: x${winterBonus}`);
    }

    const finalScore = Math.min(500, Math.round(score));
    console.log(`Final Score: ${finalScore}`);
    return finalScore;
  },

  calculateContextScore(songTags, timeOfDay, season, temperature) {
    let score = 0;
    console.log(`Calculating Context Score - Time: ${timeOfDay}, Season: ${season}`);
    
    const timePrefs = TIME_PREFERENCES[timeOfDay];
    const seasonPrefs = SEASON_PREFERENCES[season];

    if (timePrefs) {
      timePrefs.moods.forEach(mood => {
        if (songTags.moods?.includes(mood)) {
          score += 4;
          console.log(`Time Mood Match: ${mood} (+4)`);
        }
      });
      timePrefs.genres.forEach(genre => {
        if (songTags.genres?.includes(genre)) {
          score += 3;
          console.log(`Time Genre Match: ${genre} (+3)`);
        }
      });
      timePrefs.boost.forEach(tag => {
        if (songTags.moods?.includes(tag)) {
          score += 5;
          console.log(`Time Boost Tag: ${tag} (+5)`);
        }
      });
    }

    if (seasonPrefs) {
      const winterSpecificTags = ['winter', 'christmas', 'holiday', 'festive'];
      const hasWinterTag = songTags.moods?.some(mood => 
        winterSpecificTags.includes(mood.toLowerCase())
      );

      if (hasWinterTag) {
        score += 20;
        console.log(`Winter Specific Tag Detected (+20)`);
      }

      seasonPrefs.boost.forEach(tag => {
        if (songTags.moods?.includes(tag)) {
          score += 5;
          console.log(`Season Boost Tag: ${tag} (+5)`);
        }
      });
      seasonPrefs.genres.forEach(genre => {
        if (songTags.genres?.includes(genre)) {
          score += 3;
          console.log(`Season Genre Match: ${genre} (+3)`);
        }
      });
    }

    return score;
  },

  calculateTemperatureScore(songTags, tempCategory) {
    console.log(`Calculating Temperature Score for Category: ${tempCategory}`);
    const tempPreferences = {
      freezing: ['cold', 'winter', 'atmospheric', 'peaceful', 'ice', 'snow'],
      cold: ['melancholic', 'atmospheric', 'winter', 'calm', 'cozy'],
      mild: ['peaceful', 'gentle', 'mellow', 'smooth', 'pleasant'],
      warm: ['upbeat', 'bright', 'summer', 'happy', 'sunshine'],
      hot: ['energetic', 'summer', 'upbeat', 'dance', 'tropical']
    };

    let score = 0;
    tempPreferences[tempCategory]?.forEach(tag => {
      if (songTags.moods?.includes(tag)) {
        score += 4;
        console.log(`Temperature Mood Match: ${tag} (+4)`);
      }
      if (songTags.weather?.includes(tag)) {
        score += 4;
        console.log(`Temperature Weather Match: ${tag} (+4)`);
      }
    });
    return score;
  },

  calculateWeatherScore(weatherData, songTags) {
    let score = 0;
    console.log('Calculating Weather Score');
    console.log(`Weather Data: ${JSON.stringify(weatherData)}`);
    
    if (weatherData.windSpeed > 30) {
      const windScore = this.matchTags(songTags, ['intense', 'powerful', 'strong', 'wild']) * 1.5;
      score += windScore;
      console.log(`High Wind Score: ${windScore}`);
    } else if (weatherData.windSpeed > 15) {
      const windScore = this.matchTags(songTags, ['energetic', 'dynamic', 'upbeat']);
      score += windScore;
      console.log(`Moderate Wind Score: ${windScore}`);
    }

    if (weatherData.cloudCover > 80) {
      const cloudScore = this.matchTags(songTags, ['moody', 'dark', 'atmospheric', 'gloomy']) * 1.2;
      score += cloudScore;
      console.log(`High Cloud Cover Score: ${cloudScore}`);
    } else if (weatherData.cloudCover < 20) {
      const cloudScore = this.matchTags(songTags, ['bright', 'sunny', 'clear', 'warm']) * 1.2;
      score += cloudScore;
      console.log(`Low Cloud Cover Score: ${cloudScore}`);
    }

    if (weatherData.visibility < 5000) {
      const visibilityScore = this.matchTags(songTags, ['mysterious', 'ethereal', 'dreamy', 'foggy']) * 1.3;
      score += visibilityScore;
      console.log(`Low Visibility Score: ${visibilityScore}`);
    }

    if (!weatherData.isDay) {
      const nightScore = this.matchTags(songTags, ['dark', 'night', 'nocturnal', 'mysterious']) * 1.1;
      score += nightScore;
      console.log(`Night Score: ${nightScore}`);
    }

    if (weatherData.precipitation > 5) {
      const precipScore = this.matchTags(songTags, ['intense', 'dramatic', 'heavy', 'stormy']) * 1.4;
      score += precipScore;
      console.log(`High Precipitation Score: ${precipScore}`);
    } else if (weatherData.precipitation > 0) {
      const precipScore = this.matchTags(songTags, ['gentle', 'soft', 'melancholic', 'peaceful']);
      score += precipScore;
      console.log(`Light Precipitation Score: ${precipScore}`);
    }

    return score;
  },

  matchTags(songTags, targetTags) {
    return targetTags.reduce((score, tag) => {
      let tagScore = 0;
      if (songTags.moods?.includes(tag)) {
        tagScore += 3;
        console.log(`Mood Tag Match: ${tag} (+3)`);
      }
      if (songTags.weather?.includes(tag)) {
        tagScore += 3;
        console.log(`Weather Tag Match: ${tag} (+3)`);
      }
      return score + tagScore;
    }, 0);
  },

  findMatchingSongs(weatherCode, songs, temperature) {
    if (!songs?.length) return [];

    return songs
      .map(song => ({
        ...song,
        weatherScore: this.calculateSongScore(weatherCode, song, temperature)
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