import { Auth0Provider } from "@auth0/auth0-react";
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import App, { AppInternal } from './App';
import { auth0ClientId, getConfig } from '@settings/config';
import '@assets/stylesheets/antd/index.css';
import reportWebVitals from './reportWebVitals';
import history from "@helpers/history";
import { BrowserRouter as Router } from 'react-router-dom';

const onRedirectCallback = (appState: any) => {
  history.push(
    appState && appState.returnTo ? appState.returnTo : '/'
  );
};

const queryClient = new QueryClient()

const config = getConfig()

const providerConfig: any = {
  domain: config.domain,
  clientId: auth0ClientId,
  ...(config.audience ? { audience: config.audience } : null),
  redirectUri: window.location.origin,
  useRefreshTokens: true,
  cacheLocation: "localstorage",
  onRedirectCallback,
};
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
export const RootComponent = ({ children }: any) =>
  <Auth0Provider {...providerConfig}>
    <QueryClientProvider client={queryClient}>
      <Router>
        {children}
      </Router>
    </QueryClientProvider>
  </Auth0Provider>
  ;


root.render(
  <RootComponent><App>{
    (props) => <AppInternal {...props} />
  }</App></RootComponent>

);




// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
