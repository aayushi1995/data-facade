import { Box } from "@mui/material";
import React from "react";
import { useMutation } from "react-query";
import { generatePath, useHistory, useLocation } from "react-router";
import { APPLICATION_EDIT_ACTION_ROUTE_ROUTE } from "../../common/components/header/data/ApplicationRoutesConfig";
import { DATA_CONNECTIONS_ROUTE } from "../../common/components/header/data/DataRoutesConfig";
import { userSettingsSingleton } from "../../data_manager/userSettingsSingleton";
import { ProviderInstance } from "../../generated/entities/Entities";
import useSlackRedirect from "./useSlackRedirect";

const endPoint = require("../../common/config/config").FDSEndpoint
const redirectUrl = require("../../common/config/config").SLACK_REDIRECT_URL

function SlackRedirect() {
    const location = useLocation();
    const history = useHistory()
    const slackTempCode = new URLSearchParams(location.search).get("code") || undefined

    const { query } = useSlackRedirect();    

    React.useEffect(() => {
        if(slackTempCode){
            query.mutate({ slackCode: slackTempCode }, {
                onSuccess: (data, variable, context) => history.replace(generatePath(DATA_CONNECTIONS_ROUTE))
            })   
        }
    }, [slackTempCode])
      
    return (
        <Box>
            <Box>
                {query.isLoading && "Connecting ..."}
            </Box>
            <Box>
                {query.data && `Connected to ${query.data.Name}`}
            </Box>
        </Box>
    )
}

export default SlackRedirect