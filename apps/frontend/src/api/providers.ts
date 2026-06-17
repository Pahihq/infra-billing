import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateProvider, Provider, Service, SyncRun, UpdateProvider } from '@infra/shared';
import { api } from './client';
import { API_PATH } from '@infra/shared';

export type ProviderWithServices = Provider & { services: Service[] };

const KEY = ['providers'];

export function useProviders() {
  return useQuery({
    queryKey: KEY,
    queryFn: async () => (await api.get<Provider[]>(API_PATH.PROVIDERS.ROOT)).data,
  });
}

export function useProvider(uuid?: string) {
  return useQuery({
    queryKey: ['providers', uuid],
    enabled: Boolean(uuid),
    queryFn: async () =>
      (await api.get<ProviderWithServices>(API_PATH.PROVIDERS.BY_ID(uuid!))).data,
  });
}

export function useCreateProvider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CreateProvider) =>
      (await api.post<Provider>(API_PATH.PROVIDERS.ROOT, dto)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateProvider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ uuid, dto }: { uuid: string; dto: UpdateProvider }) =>
      (await api.patch<Provider>(API_PATH.PROVIDERS.BY_ID(uuid), dto)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteProvider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (uuid: string) => {
      await api.delete(API_PATH.PROVIDERS.BY_ID(uuid));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useSyncProvider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (uuid: string) =>
      (await api.post<SyncRun>(API_PATH.PROVIDERS.SYNC(uuid))).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: ['services'] });
      qc.invalidateQueries({ queryKey: ['payments'] });
    },
  });
}

export interface SyncAllResult {
  total: number;
  ok: number;
  failed: number;
}

export function useSyncAllProviders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => (await api.post<SyncAllResult>(API_PATH.PROVIDERS.SYNC_ALL)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: ['services'] });
      qc.invalidateQueries({ queryKey: ['payments'] });
    },
  });
}
