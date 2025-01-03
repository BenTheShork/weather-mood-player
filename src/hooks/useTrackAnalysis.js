import { useQuery } from '@tanstack/react-query';
import { lastFmService } from '../services/lastFmService';

export function useTrackAnalysis(track) {
  return useQuery({
    queryKey: ['track-analysis', track?.artists[0]?.name, track?.name],
    queryFn: async () => {
      const tags = await lastFmService.getAllPossibleTags(
        track.artists[0].name,
        track.name
      );

      const processedTags = lastFmService.processTags(tags);

      return {
        tags: tags,
        processedTags
      };
    },
    enabled: !!track?.name && !!track?.artists?.[0]?.name,
    staleTime: Infinity, 
  });
}