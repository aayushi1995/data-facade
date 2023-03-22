import { userSettingsSingleton } from "@/settings/userSettingsSingleton"
import { useQuery } from "react-query"
const endPoint = require("../settings/config").FDSEndpoint

export type FeatureConfig = {
    tableStats: boolean,
    multiTableInput: boolean
}

function useFeatureConfig(){
    const query = useQuery<FeatureConfig, any, FeatureConfig, string[]>(["FeatureConfig"],
        async () => {
            const requestSpec = {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${userSettingsSingleton.token}`
                }
            }

            const response = await fetch(endPoint + `/featureConfig?email=` + userSettingsSingleton.userEmail, requestSpec)
            return response.json()
        }
    )

    return query
}

export default useFeatureConfig;