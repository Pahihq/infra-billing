import { useQuery } from '@tanstack/react-query';
import type { BuildInfo } from '@infra/shared';
import { api } from './client';
import { API_PATH } from '@infra/shared';

export function useBuildInfo() {
  return useQuery({
    queryKey: ['build-info'],
    staleTime: Infinity,
    queryFn: async () => (await api.get<BuildInfo>(API_PATH.BUILD_INFO)).data,
  });
}
