import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { LoginInput, Me } from '@infra/shared';
import { api } from './client';
import { API_PATH } from '@infra/shared';

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => (await api.get<Me>(API_PATH.AUTH.ME)).data,
    retry: false,
    staleTime: 60_000,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (input: LoginInput) => (await api.post<Me>(API_PATH.AUTH.LOGIN, input)).data,
    onSuccess: (me) => {
      qc.setQueryData(['me'], me);
      navigate('/');
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async () => {
      await api.post(API_PATH.AUTH.LOGOUT);
    },
    onSuccess: () => {
      qc.clear();
      navigate('/login');
    },
  });
}
