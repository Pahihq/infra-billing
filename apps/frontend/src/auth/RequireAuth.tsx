import { Center, Loader } from '@mantine/core';
import { Navigate, Outlet } from 'react-router-dom';
import { useMe } from '@/api/auth';

export function RequireAuth() {
  const me = useMe();

  if (me.isLoading) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  if (me.isError || !me.data) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
