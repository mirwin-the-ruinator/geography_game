import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from '../app/store';

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const user = useSelector((state: RootState) => state.identity.user);
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to={`/login?next=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return children;
};

export default RequireAuth;
