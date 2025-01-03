// src/services/lastFmService.js
const API_KEY = import.meta.env.VITE_LASTFM_API_KEY;
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

export const lastFmService = {
  // Mapping of known Russian artists to their common Last.fm names
  artistAliases: {
    'кино': 'kino',
    'егор летов': 'egor letov',
    'агата кристи': 'agata kristy',
    'виктор цой': 'viktor tsoi'
  },

  // Mapping of known Russian songs to their common Last.fm titles
  trackAliases: {
    'звезда по имени солнце': 'zvezda po imeni solntse',
    'все идет по плану': 'vse idet po planu',
    'группа крови': 'gruppa krovi',
    'последний герой': 'posledniy geroy',
    'кончится лето': 'konchitsya leto',
    'как на войне': 'kak na voine'
  },

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
    // First, store original name for fallback
    const original = trackName.toLowerCase();
    
    // Check for known Russian track aliases
    if (this.trackAliases[original]) {
      console.log(`Found track alias: ${original} -> ${this.trackAliases[original]}`);
      return this.trackAliases[original];
    }

    // If it's in Cyrillic, transliterate
    if (/[а-яА-ЯёЁ]/.test(trackName)) {
      const transliterated = this.transliterate(trackName);
      console.log(`Transliterated track: ${trackName} -> ${transliterated}`);
      return transliterated;
    }
    
    // Regular cleaning for non-Cyrillic tracks
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

    console.log(`Track cleaning: "${trackName}" -> "${cleaned}"`);
    return cleaned;
  },
  
  cleanArtistName(artistName) {
    const original = artistName.toLowerCase();
    
    // Check for known Russian artist aliases
    if (this.artistAliases[original]) {
      console.log(`Found artist alias: ${original} -> ${this.artistAliases[original]}`);
      return this.artistAliases[original];
    }

    // If it's in Cyrillic, transliterate
    if (/[а-яА-ЯёЁ]/.test(artistName)) {
      const transliterated = this.transliterate(artistName);
      console.log(`Transliterated artist: ${artistName} -> ${transliterated}`);
      return transliterated;
    }

    // Regular cleaning for non-Cyrillic artists
    let cleaned = artistName.toLowerCase()
      .split(/[,&]/)[0]
      .replace(/[\(\[\{].*?[\)\]\}]/g, '')
      .replace(/[^\w\s&]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    console.log(`Artist cleaning: "${artistName}" -> "${cleaned}"`);
    return cleaned;
  },

  async getAllPossibleTags(artist, track) {
    const attempts = [
      // Try 1: Exact track and artist
      async () => {
        const tags = await this.getTrackTags(artist, track);
        return tags.toptags?.tag;
      },
      // Try 2: Transliterated names if Cyrillic
      async () => {
        if (/[а-яА-ЯёЁ]/.test(artist) || /[а-яА-ЯёЁ]/.test(track)) {
          const transliteratedArtist = this.transliterate(artist);
          const transliteratedTrack = this.transliterate(track);
          const tags = await this.getTrackTags(transliteratedArtist, transliteratedTrack);
          return tags.toptags?.tag;
        }
      },
      // Try 3: Artist tags
      async () => {
        const artistTags = await this.getArtistTags(artist);
        if (artistTags.length > 0) {
          return artistTags;
        }
        // If no tags and artist is in Cyrillic, try transliterated
        if (/[а-яА-ЯёЁ]/.test(artist)) {
          const transliteratedArtist = this.transliterate(artist);
          return await this.getArtistTags(transliteratedArtist);
        }
      },
      // Try 4: Track search without artist
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

  // Enhanced processTags method with more tags
  processTags(tags) {
    const moodTags = new Set([
      // Positive moods
      'happy', 'upbeat', 'feelgood', 'fun', 'uplifting', 'energetic', 'excited', 
      'optimistic', 'positive', 'cheerful', 'bright', 'sunshine', 'summer', 'good mood',
      // Calm moods
      'calm', 'relaxing', 'peaceful', 'mellow', 'chill', 'ambient', 'smooth', 
      'tranquil', 'gentle', 'soothing', 'easy', 'soft',
      // Emotional moods
      'sad', 'melancholic', 'emotional', 'dark', 'moody', 'atmospheric', 'dreamy',
      'romantic', 'sensual', 'intimate', 'love', 'beautiful', 'pretty',
      // Intense moods
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

    // Remove duplicates
    result.moods = [...new Set(result.moods)];
    result.weather = [...new Set(result.weather)];
    result.genres = [...new Set(result.genres)];

    return result;
  }
};