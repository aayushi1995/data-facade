import { useAuth0 } from "@auth0/auth0-react";

const useLogin = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect();
  };

  return { handleLogin };
};

export default useLogin;
