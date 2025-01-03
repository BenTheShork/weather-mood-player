export const MOOD_TAGS = new Set([
  // Positive - High Energy
  'happy', 'upbeat', 'feelgood', 'fun', 'uplifting', 'energetic', 'excited', 
  'optimistic', 'positive', 'cheerful', 'bright', 'sunshine', 'summer', 'good mood',
  'exuberant', 'joyful', 'enthusiastic', 'lively', 'vibrant', 'euphoric', 'ecstatic',
  
  // Positive - Low Energy
  'calm', 'relaxing', 'peaceful', 'mellow', 'chill', 'ambient', 'smooth', 
  'tranquil', 'gentle', 'soothing', 'easy', 'soft', 'serene', 'content',
  'laid-back', 'carefree', 'pleasant', 'comfortable', 'balanced', 'harmonious',
  
  // Emotional - Melancholic
  'sad', 'melancholic', 'emotional', 'dark', 'moody', 'atmospheric', 'dreamy',
  'bittersweet', 'wistful', 'somber', 'gloomy', 'sorrowful', 'longing', 'yearning',
  'reflective', 'introspective', 'contemplative', 'pensive', 'brooding',
  
  // Emotional - Romantic
  'romantic', 'sensual', 'intimate', 'love', 'beautiful', 'pretty', 'tender',
  'passionate', 'affectionate', 'sweet', 'warm', 'enchanting', 'lovely', 'delicate',
  
  // Intense - Aggressive
  'intense', 'aggressive', 'powerful', 'epic', 'dramatic', 'angry', 'fierce',
  'heavy', 'strong', 'loud', 'raw', 'brutal', 'visceral', 'primal', 'savage',
  'violent', 'furious', 'rage', 'hostile', 'menacing', 'threatening',
  
  // Dark/Gothic
  'darkness', 'night', 'sinister', 'gothic', 'haunting', 'eerie', 'spooky',
  'mysterious', 'occult', 'macabre', 'grim', 'ominous', 'doom', 'evil', 'creepy',
  
  // Experimental/Avant-garde
  'weird', 'strange', 'odd', 'quirky', 'eccentric', 'unusual', 'experimental',
  'avant-garde', 'unconventional', 'surreal', 'abstract', 'psychedelic', 'trippy',
  'innovative', 'groundbreaking', 'boundary-pushing', 'alternative', 'underground',
  
  // Nostalgic
  'nostalgic', 'retro', 'vintage', 'oldies', 'classic', 'timeless', 'throwback',
  'reminiscent', 'sentimental', 'memory', 'familiar', 'traditional', 'old-school',
  
  // Futuristic
  'futuristic', 'spacey', 'cosmic', 'sci-fi', 'cyber', 'technological', 'robotic',
  'digital', 'electronic', 'modern', 'cutting-edge', 'progressive', 'innovative',
  'forward-thinking', 'advanced', 'synthetic', 'computerized', 'mechanical',
  
  // Spiritual/Meditative
  'spiritual', 'religious', 'sacred', 'holy', 'divine', 'meditative', 'zen',
  'mystical', 'transcendent', 'enlightened', 'heavenly', 'peaceful', 'ethereal',
  'celestial', 'angelic', 'enlightening', 'pure', 'cleansing', 'healing',
  
  // Anxious/Chaotic
  'angst', 'anxious', 'nervous', 'tense', 'stressful', 'frantic', 'chaotic',
  'paranoid', 'disturbed', 'restless', 'uneasy', 'worried', 'distressed',
  'panicked', 'manic', 'unsettling', 'disturbing', 'dissonant', 'jarring',
  
  // Nature/Environmental
  'natural', 'organic', 'earthy', 'grounding', 'flowing', 'floating', 'airy',
  'watery', 'oceanic', 'marine', 'aquatic', 'forest', 'woodland', 'pastoral',
  'rural', 'urban', 'city', 'street', 'industrial', 'mechanical'
]);

export const GENRE_TAGS = new Set([
  // Rock - Main Categories
  'rock', 'hard rock', 'soft rock', 'classic rock', 'alternative rock', 'indie rock',
  'progressive rock', 'psychedelic rock', 'art rock', 'garage rock', 'blues rock',
  'folk rock', 'southern rock', 'surf rock', 'space rock', 'glam rock',
  'experimental rock', 'post-rock', 'math rock', 'noise rock',

  // Metal - Main Categories
  'metal', 'heavy metal', 'black metal', 'death metal', 'doom metal', 'thrash metal',
  'power metal', 'progressive metal', 'symphonic metal', 'folk metal', 'gothic metal',
  'industrial metal', 'nu metal', 'speed metal', 'metalcore', 'deathcore',
  'grindcore', 'sludge metal', 'stoner metal', 'djent',

  // Electronic - Main Categories
  'electronic', 'techno', 'house', 'trance', 'ambient', 'downtempo', 'breakbeat',
  'drum and bass', 'dubstep', 'garage', 'grime', 'industrial', 'idm', 'edm',
  'electropop', 'synthpop', 'electronica', 'glitch', 'bass music', 'future bass',
  'trap', 'drill', 'uk garage', 'hardstyle', 'gabber', 'jungle',

  // Hip-Hop/Rap
  'hip-hop', 'rap', 'trap rap', 'gangsta rap', 'conscious rap', 'alternative hip-hop',
  'old school hip-hop', 'underground hip-hop', 'abstract hip-hop', 'southern hip-hop',
  'east coast hip-hop', 'west coast hip-hop', 'midwest hip-hop', 'uk hip-hop',
  'french hip-hop', 'german hip-hop', 'latin hip-hop', 'jazz rap', 'trip-hop',

  // Pop/Commercial
  'pop', 'indie pop', 'synthpop', 'dream pop', 'chamber pop', 'baroque pop',
  'art pop', 'noise pop', 'power pop', 'dance-pop', 'electropop', 'europop',
  'j-pop', 'k-pop', 'latin pop', 'teen pop', 'adult contemporary', 'britpop',

  // Jazz/Blues
  'jazz', 'smooth jazz', 'acid jazz', 'avant-garde jazz', 'bebop', 'big band',
  'cool jazz', 'free jazz', 'fusion', 'latin jazz', 'modal jazz', 'swing',
  'blues', 'chicago blues', 'delta blues', 'electric blues', 'jazz blues',
  'rhythm and blues', 'soul blues', 'texas blues',

  // Folk/Country
  'folk', 'traditional folk', 'contemporary folk', 'folk rock', 'indie folk',
  'freak folk', 'folk punk', 'anti-folk', 'country', 'alt-country', 'country rock',
  'country pop', 'country folk', 'outlaw country', 'bluegrass', 'americana',
  'western', 'country blues', 'contemporary country',

  // Classical/Orchestral
  'classical', 'contemporary classical', 'modern classical', 'neo-classical',
  'minimalist', 'avant-garde classical', 'orchestral', 'chamber music',
  'baroque', 'romantic', 'opera', 'symphony', 'concerto', 'instrumental',
  'classical crossover', 'film score', 'soundtrack', 'ambient classical',

  // World/Traditional
  'world', 'african', 'arabic', 'asian', 'celtic', 'latin', 'mediterranean',
  'middle eastern', 'nordic', 'oriental', 'reggae', 'ska', 'dub', 'afrobeat',
  'balkan', 'brazilian', 'indian', 'japanese', 'korean', 'russian',

  // Fusion/Crossover
  'fusion', 'jazz fusion', 'latin fusion', 'world fusion', 'classical fusion',
  'folk fusion', 'electronic fusion', 'rock fusion', 'metal fusion',
  'progressive fusion', 'experimental fusion', 'crossover', 'hybrid'
]);

export const WEATHER_TAGS = new Set([
  // Basic Weather States
  'sunny', 'cloudy', 'rainy', 'stormy', 'snowy', 'windy', 'foggy',
  'clear', 'overcast', 'partly cloudy', 'mostly cloudy', 'scattered clouds',

  // Rain Types
  'drizzle', 'light rain', 'moderate rain', 'heavy rain', 'downpour',
  'shower', 'thunderstorm', 'rain storm', 'monsoon', 'torrential',

  // Snow Types
  'light snow', 'moderate snow', 'heavy snow', 'blizzard', 'snowstorm',
  'sleet', 'hail', 'freezing rain', 'ice storm', 'frost',

  // Wind Conditions
  'breeze', 'light wind', 'strong wind', 'gust', 'gale',
  'hurricane', 'tornado', 'cyclone', 'typhoon', 'whirlwind',

  // Visibility Conditions
  'fog', 'mist', 'haze', 'smog', 'clear sky',
  'visibility', 'twilight', 'dawn', 'dusk', 'aurora',

  // Temperature Related
  'hot', 'warm', 'mild', 'cool', 'cold',
  'freezing', 'tropical', 'arctic', 'temperate', 'polar',

  // Humidity Related
  'humid', 'dry', 'arid', 'muggy', 'sticky',
  'moisture', 'damp', 'wet', 'precipitation', 'condensation',

  // Time of Day
  'morning', 'afternoon', 'evening', 'night',
  'sunrise', 'sunset', 'daybreak', 'nightfall', 'twilight',

  // Seasons
  'spring', 'summer', 'autumn', 'fall', 'winter',
  'seasonal', 'solstice', 'equinox', 'monsoon season',

  // Special Weather Events
  'storm', 'lightning', 'thunder', 'rainbow', 'heat wave',
  'cold snap', 'drought', 'flood', 'natural disaster',

  // Atmospheric Phenomena
  'pressure', 'front', 'air mass', 'climate', 'meteorological',
  'atmospheric', 'barometric', 'isobar', 'weather system'
]);
