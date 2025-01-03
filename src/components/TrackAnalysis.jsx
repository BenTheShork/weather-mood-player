import { useTrackAnalysis } from '../hooks/useTrackAnalysis';

function TrackAnalysis({ track }) {
  const { data, isLoading } = useTrackAnalysis(track);

  if (isLoading) {
    return <div className="text-gray-500 text-xs">Loading tags...</div>;
  }

  if (!data || (!data.processedTags.moods.length && !data.processedTags.weather.length && !data.processedTags.genres.length)) {
    return <div className="text-gray-400 text-xs italic">No tags available</div>;
  }

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {data.processedTags.moods.map(mood => (
        <span 
          key={mood}
          className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs"
        >
          {mood}
        </span>
      ))}
      {data.processedTags.weather.map(tag => (
        <span 
          key={tag}
          className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs"
        >
          {tag}
        </span>
      ))}
      {data.processedTags.genres.map(genre => (
        <span 
          key={genre}
          className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs"
        >
          {genre}
        </span>
      ))}
    </div>
  );
}

export default TrackAnalysis;