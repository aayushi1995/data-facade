import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'typeface-roboto'
import {getConfig} from "./config";
import {Auth0Provider} from "@auth0/auth0-react";
import history from "./utils/history";
import {QueryClient, QueryClientProvider} from 'react-query'
import {auth0ClientId} from './common/config/config'
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import StyledEngineProvider from '@material-ui/core/StyledEngineProvider';
import {SettingsProvider} from "./data_manager/SettingsContext";

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
    onRedirectCallback,
};

ReactDOM.render(
    <StyledEngineProvider>
        <Router>
            <Auth0Provider {...providerConfig}>
                <QueryClientProvider client={queryClient}>
                    <SettingsProvider>
                        <App/>
                    </SettingsProvider>
                </QueryClientProvider>
            </Auth0Provider>
        </Router>
    </StyledEngineProvider>,
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
