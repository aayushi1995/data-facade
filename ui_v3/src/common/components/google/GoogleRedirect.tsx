import { Box } from "@mui/material";
import React from "react";
import { generatePath, useHistory, useLocation } from "react-router";
import { GOOGLE_REDIRECT_URL } from "../../config/config";
import { DATA_CONNECTION_DETAIL_ROUTE } from "../header/data/DataRoutesConfig";
import { useCreateGoogleProviderMutation } from "./useGoogleHooks";

function GoogleRedirect() {
    const location = useLocation();
    const history = useHistory()
    const code = new URLSearchParams(location.search).get("code") || undefined
    const scope = new URLSearchParams(location.search).get("scope") || undefined
    const createGoogleProviderMutation = useCreateGoogleProviderMutation();    

    React.useEffect(() => {
        if(code && scope){
            createGoogleProviderMutation.mutate({ code: code, scope: scope, redirectUri: GOOGLE_REDIRECT_URL }, {
                onSuccess: (data, variable, context) => history.replace(generatePath(DATA_CONNECTION_DETAIL_ROUTE, { ProviderInstanceId: data?.Id }))
            })
        }
    }, [code])
      
    return (
        <Box>
            <Box>
                {createGoogleProviderMutation.isLoading && "Connecting ..."}
            </Box>
            <Box>
                {createGoogleProviderMutation.data && `Connected to ${createGoogleProviderMutation.data.Name}`}
            </Box>
        </Box>
    )
}

export default GoogleRedirect