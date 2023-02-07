import {useEffect, useState} from "react";
import {useUserSettingsSingleton} from "@settings/userSettingsSingleton";
import {useAuth0} from "@auth0/auth0-react";
import {FDSEndpoint} from "@settings/config";
import dataManager from "@api/dataManager";


const fetchDummyData = (token:string, endPoint:string, email:string) => {
    return dataManager.getInstance.dummyData(email, token).then((res:any) => {
        if (res.ok) {
            return res.json()
        } else {
            return {status: res.status}
        }
    });
}

export function useAppInternal() {
    const [userEmail, setUserEmail] = useState()
    const [userName, setUserName] = useState("")
    const [token, setToken] = useState()
    const [workspaceName, setWorkspaceName] = useState()
    const [dummyData, setDummyData] = useState()
    const [dummyDataPending = 1, setDummyDataPending] = useState<Number>(0)
    useUserSettingsSingleton(userEmail, userName, token, workspaceName);

    const userSettings:any = {
        userEmail,
        userName,
        token,
        workspaceName,
        setUserEmail,
        setUserName,
        setToken
    }


    const {isLoading, isAuthenticated, user, getAccessTokenSilently} = useAuth0<any>()


    useEffect(() => {
        if (isAuthenticated) {
            getAccessTokenSilently().then((receivedToken:any) => {
                setToken(receivedToken)
                setUserEmail(user.email)
                setUserName(user.name)
                fetchDummyData(receivedToken, FDSEndpoint, user.email).catch(console.error).then((res:any) => {
                    setDummyData(res);
                    setWorkspaceName(res?.organizationDbSchemaName);
                    setDummyDataPending(2);
                });
            }).catch(console.error);
        }
    }, [getAccessTokenSilently, isAuthenticated, user]);
    return {
        userEmail,
        dummyData,
        dummyDataPending,
        userSettings,
        isLoading,
        user
    };
}