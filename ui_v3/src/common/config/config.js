

exports.FDSEndpoint =
  process.env.REACT_APP_FDS_ENDPOINT !== undefined
    ? process.env.REACT_APP_FDS_ENDPOINT
    : // 'https://datafacade.io/fds/v1'
       "https://stage.datafacade.io/fds/v1";
 'http://localhost:9000/v1'

exports.auth0ClientId =
  process.env.REACT_APP_AUTH0_CLIENT_ID !== undefined
    ? process.env.REACT_APP_AUTH0_CLIENT_ID
    : "MJfPxNeBxhxzKqHF2dcx9vY1HoaAP7E1";

const origin = window.location.origin;
exports.isNonProductionEnv = function () {
  return origin.includes("stage") || origin.includes("localhost");
};

exports.SLACK_REDIRECT_URL = (origin + "/slackredirect").replace(
  "http://",
  "https://"
);

exports.SLACK_URL = "https://slack.com/oauth/v2/authorize";

exports.GENERATE_URL_PARAMS = () => {
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

