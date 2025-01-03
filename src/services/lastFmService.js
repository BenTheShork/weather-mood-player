const API_KEY = import.meta.env.VITE_LASTFM_API_KEY;
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

export const lastFmService = {
  transliterate(text) {
    const cyrillicToLatin = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
      'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
      'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
      'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
    };

    return text.toLowerCase().split('').map(char => 
      cyrillicToLatin[char] || char
    ).join('');
  },

  cleanTrackName(trackName) {
    if (/[а-яА-ЯёЁ]/.test(trackName)) {
      return this.transliterate(trackName);
    }
    
    let cleaned = trackName.toLowerCase()
      .replace(/\s*-\s*(.[^-]*(remaster|remix|version|edit|mix).*$)/i, '')
      .replace(/\b(re)?master(ed)?\b.*$/i, '')
      .replace(/\b(19|20)\d{2}\b/g, '')
      .replace(/\b(original|mono|stereo|live|single|album|digital|explicit|clean|version|edit|mix|remix)\b.*$/gi, '')
      .replace(/\(\d+:\d+\)/, '')
      .replace(/\b(ft|feat|featuring)\b.*$/i, '')
      .replace(/[\(\[\{].*?[\)\]\}]/g, '')
      .replace(/\s+\d+$/, '')
      .replace(/[^\w\s\(\)]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return cleaned;
  },
  
  cleanArtistName(artistName) {
    if (/[а-яА-ЯёЁ]/.test(artistName)) {
      return this.transliterate(artistName);
    }

    return artistName.toLowerCase()
      .split(/[,&]/)[0]
      .replace(/[\(\[\{].*?[\)\]\}]/g, '')
      .replace(/[^\w\s&]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  },

  async getAllPossibleTags(artist, track) {
    const attempts = [
      async () => {
        const tags = await this.getTrackTags(artist, track);
        return tags.toptags?.tag;
      },
      async () => {
        if (/[а-яА-ЯёЁ]/.test(artist) || /[а-яА-ЯёЁ]/.test(track)) {
          const transliteratedArtist = this.transliterate(artist);
          const transliteratedTrack = this.transliterate(track);
          const tags = await this.getTrackTags(transliteratedArtist, transliteratedTrack);
          return tags.toptags?.tag;
        }
      },
      async () => {
        const artistTags = await this.getArtistTags(artist);
        if (artistTags.length > 0) {
          return artistTags;
        }
        if (/[а-яА-ЯёЁ]/.test(artist)) {
          const transliteratedArtist = this.transliterate(artist);
          return await this.getArtistTags(transliteratedArtist);
        }
      },
      async () => {
        const cleanTrack = this.cleanTrackName(track);
        const params = new URLSearchParams({
          method: 'track.search',
          track: cleanTrack,
          api_key: API_KEY,
          format: 'json',
          limit: 5
        });
        const response = await fetch(`${BASE_URL}?${params}`);
        const data = await response.json();
        const tracks = data.results?.trackmatches?.track || [];
        
        for (const result of tracks) {
          try {
            const tags = await this.getTrackTags(result.artist, result.name);
            if (tags.toptags?.tag?.length > 0) return tags.toptags.tag;
          } catch (e) {
            continue;
          }
        }
      }
    ];

    let allTags = [];
    for (const attempt of attempts) {
      try {
        const tags = await attempt();
        if (tags?.length > 0) {
          allTags = [...new Set([...allTags, ...tags])];
          if (allTags.length >= 5) break;
        }
      } catch (error) {
        console.error('Attempt failed:', error);
      }
    }

    return allTags;
  },

  async searchTrack(artist, track) {
    const cleanTrack = this.cleanTrackName(track);
    const cleanArtist = this.cleanArtistName(artist);
    
    const params = new URLSearchParams({
      method: 'track.search',
      track: cleanTrack,
      artist: cleanArtist,
      api_key: API_KEY,
      format: 'json',
      limit: 5
    });

    const response = await fetch(`${BASE_URL}?${params}`);
    if (!response.ok) {
      throw new Error('Failed to search track on Last.fm');
    }
    const data = await response.json();
    return data.results?.trackmatches?.track?.[0];
  },

  async getArtistTags(artist) {
    const cleanArtist = this.cleanArtistName(artist);
    const params = new URLSearchParams({
      method: 'artist.gettoptags',
      artist: cleanArtist,
      api_key: API_KEY,
      format: 'json'
    });

    const response = await fetch(`${BASE_URL}?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch artist tags from Last.fm');
    }
    const data = await response.json();
    return data.toptags?.tag || [];
  },

  async getTrackTags(artist, track) {
    const cleanTrack = this.cleanTrackName(track);
    const cleanArtist = this.cleanArtistName(artist);
    const params = new URLSearchParams({
      method: 'track.gettoptags',
      artist: cleanArtist,
      track: cleanTrack,
      api_key: API_KEY,
      format: 'json',
    });

    const response = await fetch(`${BASE_URL}?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch track tags from Last.fm');
    }
    return response.json();
  },

  processTags(tags) {
    const moodTags = new Set([
      'happy', 'upbeat', 'feelgood', 'fun', 'uplifting', 'energetic', 'excited', 
      'optimistic', 'positive', 'cheerful', 'bright', 'sunshine', 'summer', 'good mood',
      'calm', 'relaxing', 'peaceful', 'mellow', 'chill', 'ambient', 'smooth', 
      'tranquil', 'gentle', 'soothing', 'easy', 'soft',
      'sad', 'melancholic', 'emotional', 'dark', 'moody', 'atmospheric', 'dreamy',
      'romantic', 'sensual', 'intimate', 'love', 'beautiful', 'pretty',
      'intense', 'aggressive', 'powerful', 'epic', 'dramatic', 'angry', 'fierce',
      'passionate', 'heavy', 'deep', 'strong'
    ]);

    const genreTags = new Set([
      'rock', 'pop', 'jazz', 'classical', 'electronic', 'hip-hop', 'rap', 'indie',
      'folk', 'metal', 'blues', 'country', 'soul', 'rb', 'dance', 'disco', 'punk',
      'alternative', 'instrumental', 'vocal', 'synth', 'new wave', 'post-punk',
      '80s', '90s', '70s', 'classic', 'progressive'
    ]);

    const weatherTags = new Set([
      'summer', 'winter', 'spring', 'autumn', 'fall', 'sunny', 'rainy', 'stormy',
      'cloudy', 'windy', 'night', 'morning', 'evening', 'sunset', 'sunrise',
      'beach', 'tropical', 'cold', 'warm', 'hot', 'sunshine', 'dark'
    ]);

    const result = tags.reduce((acc, tag) => {
      const tagName = tag.name.toLowerCase();
      if (moodTags.has(tagName)) {
        acc.moods.push(tagName);
      } else if (weatherTags.has(tagName)) {
        acc.weather.push(tagName);
      } else if (genreTags.has(tagName)) {
        acc.genres.push(tagName);
      }
      return acc;
    }, { moods: [], weather: [], genres: [] });

    result.moods = [...new Set(result.moods)];
    result.weather = [...new Set(result.weather)];
    result.genres = [...new Set(result.genres)];

    return result;
  }
};