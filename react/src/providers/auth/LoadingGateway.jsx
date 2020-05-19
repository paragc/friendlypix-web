import useAuth from './useAuth';

const LoadingGateway = ({ children, reverse = false }) => {
  const { isLoaded } = useAuth();
  if (!isLoaded && !reverse) {
    return null;
  }
  if (isLoaded && reverse) {
    return null;
  }
  return children;
};

export default LoadingGateway;