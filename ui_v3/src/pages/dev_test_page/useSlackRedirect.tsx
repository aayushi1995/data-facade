import { useMutation } from "react-query";
import { useLocation } from "react-router";
import { userSettingsSingleton } from "../../data_manager/userSettingsSingleton";
import { ProviderInstance } from "../../generated/entities/Entities";

const endPoint = require("../../common/config/config").FDSEndpoint
const redirectUrl = require("../../common/config/config").SLACK_REDIRECT_URL

function useSlackRedirect() {
    const query = useMutation<ProviderInstance, any, { slackCode: string }, string[]>(["CreateSlack"],
        async ({ slackCode }) => {
            const requestSpec = {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${userSettingsSingleton.token}`
                },
                body: JSON.stringify({
                    TempCode: slackCode,
                    RedirectURL: redirectUrl
                })
            }

            const response = await fetch(endPoint + `/slack?email=` + userSettingsSingleton.userEmail, requestSpec)
            const providers = await response.json()
            return providers[0]
        }
    )

    return { query }
}

export default useSlackRedirect;