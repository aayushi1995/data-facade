import { useQuery } from "react-query"
import { userSettingsSingleton } from "../../../data_manager/userSettingsSingleton"

const endPoint = require("../../../common/config/config").FDSEndpoint

function useSlackInstallURL() {
    const query = useQuery<string, unknown, string>(["Slack", "Install", "URL"],
        () => {
            const requestSpec = {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${userSettingsSingleton.token}`
                }
            }

            const response = fetch(endPoint + `/slack/install?email=` + userSettingsSingleton.userEmail, requestSpec)
            const url = response.then(res => res.text())
            return url
        }
    )
    
    const url = query?.data
    return { url }
}

export default useSlackInstallURL