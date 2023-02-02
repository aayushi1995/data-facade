import { useQuery } from "react-query"

import { userSettingsSingleton } from '../../../../data_manager/userSettingsSingleton'
const endPoint = require("../../../../common/config/config").FDSEndpoint

export type FeatureConfig = {
    tableStats: boolean
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