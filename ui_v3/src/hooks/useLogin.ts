import { useAuth0 } from '@auth0/auth0-react';
import {LOGIN_STATE_KEY, LOGIN_STATE_PROGRESS_VALUE} from "../pages/home/EULA";

const useLogin = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    localStorage.setItem(LOGIN_STATE_KEY, LOGIN_STATE_PROGRESS_VALUE)
    loginWithRedirect();
  };

  return { handleLogin };
};

export default useLogin;
