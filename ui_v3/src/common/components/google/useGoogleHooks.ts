import { useMutation, useQuery } from "react-query"
import { userSettingsSingleton } from "../../../data_manager/userSettingsSingleton"
import { ProviderInstance } from "../../../generated/entities/Entities"
import { FDSEndpoint } from "../../config/config"

export function useGoogleClientId() {
    const query = useQuery<string, unknown, string>(["Google", "ClientId"],
        () => {
            const requestSpec = {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${userSettingsSingleton.token}`
                }
            }

            const response = fetch(FDSEndpoint + `/google/clientid?email=` + userSettingsSingleton.userEmail, requestSpec)
            const url = response.then(res => res.text())
            return url
        }
    )
    
    return query
}

export function useCreateGoogleProviderMutation () {
    const mutation = useMutation<ProviderInstance, unknown, { code: string, scope: string, redirectUri: string }, unknown>(["Google", "Create"],
        async (variables) => {
            const requestSpec = {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${userSettingsSingleton.token}`
                },
                body: JSON.stringify(variables)
            }

            const response = await fetch(FDSEndpoint + `/google/create?email=` + userSettingsSingleton.userEmail, requestSpec)
            return response.json().then((data: ProviderInstance[]) => data?.[0])
        }
    )

    return mutation
}

export function useGoogleScopes () {
    const query = useQuery<string[], unknown, string[], string[]>(["Google", "Scopes"],
        async () => {
            const requestSpec = {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${userSettingsSingleton.token}`
                }
            }

            const response = await fetch(FDSEndpoint + `/google/scopes?email=` + userSettingsSingleton.userEmail, requestSpec)
            return response.json()
        }
    )

    return query
}