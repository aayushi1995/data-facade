import {useMemo} from "react";

export const userSettingsSingleton: any = {}

export function useUserSettingsSingleton(userEmail: any, userName: any, token: any, workspaceName: any) {
    useMemo(() => {
        userSettingsSingleton.userEmail = userEmail;
        userSettingsSingleton.userName = userName;
        userSettingsSingleton.token = token;
        userSettingsSingleton.workspaceName = workspaceName;
    }, [userEmail, userName, token, workspaceName]);
}