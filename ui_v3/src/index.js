import { Auth0Provider } from "@auth0/auth0-react";
import StyledEngineProvider from '@mui/material/StyledEngineProvider';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import 'typeface-roboto';
import App, { AppInternal } from './App';
import { ModuleProvider } from "./common/components/route_consts/data/ModuleContext";
import { auth0ClientId } from './common/config/config';
import { getConfig } from "./config";
import { SettingsProvider } from "./data_manager/SettingsContext";
import './index.css';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import history from "./utils/history";

const onRedirectCallback = (appState) => {
    history.push(
        appState && appState.returnTo ? appState.returnTo : '/tableBrowser'
    );
    console.log("appState", appState)
    console.log("window", window.location.pathname)

};

const queryClient = new QueryClient()

const config = getConfig()

const providerConfig = {
    domain: config.domain,
    clientId: auth0ClientId,
    ...(config.audience ? {audience: config.audience} : null),
    redirectUri: window.location.origin,
    useRefreshTokens:true,
    cacheLocation:"localstorage",
    onRedirectCallback,
};

export const RootComponent = ({children}) => 
    <StyledEngineProvider>
        <ModuleProvider>
            <Router>
                <Auth0Provider {...providerConfig}>
                    <QueryClientProvider client={queryClient}>
                        <SettingsProvider>
                            {children}
                        </SettingsProvider>
                    </QueryClientProvider>
                </Auth0Provider>
            </Router>
        </ModuleProvider>
    </StyledEngineProvider>;
    
ReactDOM.render(
    <RootComponent><App>{
        (props) => <AppInternal {...props}/>
    }</App></RootComponent>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// refer https://stackoverflow.com/questions/52904430/how-to-implement-skipwaiting-with-create-react-app#58596965
serviceWorkerRegistration.register({
    onUpdate: registration => {
        const waitingServiceWorker = registration.waiting

        if (waitingServiceWorker) {
            waitingServiceWorker.addEventListener("statechange", event => {
                if (event.target.state === "activated") {
                    window.location.reload()
                }
            });
            waitingServiceWorker.postMessage({type: "SKIP_WAITING"});
        }
    }
});


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
