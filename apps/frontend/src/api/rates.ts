import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateRate, Rate } from '@infra/shared';
import { api } from './client';
import { API_PATH } from '@infra/shared';

export function useRates() {
  return useQuery({
    queryKey: ['rates'],
    queryFn: async () => (await api.get<Rate[]>(API_PATH.RATES.ROOT)).data,
  });
}

export function useAddRate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CreateRate) => (await api.post<Rate>(API_PATH.RATES.ROOT, dto)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rates'] }),
  });
}

export function useRefreshRates() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => (await api.post<{ updated: number }>(API_PATH.RATES.REFRESH)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rates'] }),
  });
}
