import { IconLoader2 } from '@tabler/icons-react';
import { Navigate, Outlet } from 'react-router-dom';
import { useMe } from '@/api/auth';

export function RequireAuth() {
  const me = useMe();

  if (me.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (me.isError || !me.data) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
