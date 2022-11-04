exports.FDSEndpoint = (process.env.REACT_APP_FDS_ENDPOINT !== undefined) ?
    process.env.REACT_APP_FDS_ENDPOINT :
    //  'https://datafacade.io/fds/v1'
     'http://localhost:9000/v1'


exports.auth0ClientId = (process.env.REACT_APP_AUTH0_CLIENT_ID !== undefined) ?
    process.env.REACT_APP_AUTH0_CLIENT_ID :
    'MJfPxNeBxhxzKqHF2dcx9vY1HoaAP7E1'

const origin = window.location.origin;
exports.isNonProductionEnv = function () {
    return origin.includes('stage') || origin.includes('localhost')
}

