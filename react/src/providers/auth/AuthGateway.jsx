import useAuth from './useAuth';

const AuthGateway = ({ children, reverse = false }) => {
  const { user } = useAuth();
  if (!user && !reverse) {
    return null;
  }
  if (user && reverse) {
    return null;
  }
  return children;
};

export default AuthGateway;