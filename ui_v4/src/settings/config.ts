import configJson from "./auth_config.json";

export const FDSEndpoint =
  process.env.REACT_APP_FDS_ENDPOINT !== undefined
    ? process.env.REACT_APP_FDS_ENDPOINT
    : "https://stage.datafacade.io/fds/v1";
    // : "http://localhost:9000/v1"

export const ui_v3_url = process.env.REACT_APP_FDS_ENDPOINT !== undefined ? 
    "https://stage.datafacade.io" : "http://localhost:3000"

export const auth0ClientId =
  process.env.REACT_APP_AUTH0_CLIENT_ID !== undefined
    ? process.env.REACT_APP_AUTH0_CLIENT_ID
    : "MJfPxNeBxhxzKqHF2dcx9vY1HoaAP7E1";

const origin = window.location.origin;
export const isNonProductionEnv = function () {
  return origin.includes("stage") || origin.includes("localhost");
};

export const SLACK_REDIRECT_URL = (origin + "/slackredirect").replace(
  "http://",
  "https://"
);

export const GOOGLE_REDIRECT_URL = origin + "/googleredirect";

export const SLACK_URL = "https://slack.com/oauth/v2/authorize";

export const GENERATE_URL_PARAMS = () => {
  const slackUrlSearchParams = new URLSearchParams();
  slackUrlSearchParams.append("scope", "files:write,chat:write");
  slackUrlSearchParams.append("redirect_uri", exports.SLACK_REDIRECT_URL);
  slackUrlSearchParams.append(
    "client_id",
    process.env.SLACK_APP_CLIENT_ID !== undefined
      ? process.env.SLACK_APP_CLIENT_ID
      : "1627334649444.1789524260661"
  );
  return slackUrlSearchParams;
};

export const getConfig = () => {
  const audience =
    configJson.audience && configJson.audience !== "YOUR_API_IDENTIFIER"
      ? configJson.audience
      : null;

  return {
    domain: configJson.domain,
    clientId: configJson.clientId,
    ...(audience ? { audience } : null),
  };
};
