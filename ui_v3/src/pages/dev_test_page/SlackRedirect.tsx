import { Box } from "@mui/material";
import React from "react";
import { generatePath, useHistory, useLocation } from "react-router";
import { DATA_CONNECTION_DETAIL_ROUTE } from "../../common/components/route_consts/data/DataRoutesConfig";
import useSlackRedirect from "./useSlackRedirect";

const endPoint = require("../../common/config/config").FDSEndpoint
const redirectUrl = require("../../common/config/config").SLACK_REDIRECT_URL

function SlackRedirect() {
    const location = useLocation();
    const history = useHistory()
    const slackTempCode = new URLSearchParams(location.search).get("code") || undefined

    const { mutation } = useSlackRedirect();    

    React.useEffect(() => {
        if(slackTempCode){
            mutation.mutate({ slackCode: slackTempCode }, {
                onSuccess: (data, variable, context) => history.replace(generatePath(DATA_CONNECTION_DETAIL_ROUTE, { ProviderInstanceId: data?.Id }))
            })   
        }
    }, [slackTempCode])
      
    return (
        <Box>
            <Box>
                {mutation.isLoading && "Connecting ..."}
            </Box>
            <Box>
                {mutation.data && `Connected to ${mutation.data.Name}`}
            </Box>
        </Box>
    )
}

export default SlackRedirect