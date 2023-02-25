import { S3RequestType } from "@/helpers/constant";
import { FDSEndpoint } from "@/settings/config";
import { getDefaultRequestQuery } from "@/utils/getDefaultRequestQuery";
import { userSettingsSingleton } from "@settings/userSettingsSingleton";
import { useQueries, useQuery, useQueryClient } from "react-query";

const endPoint = FDSEndpoint

const dataManager:any = {
    getInstance: {}
};

function getDefaultHeader(token: string) {
    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

const isValidUserSettings = () => userSettingsSingleton.userEmail && userSettingsSingleton.token

const defaultPostRequest =  (entityName:string, actionProperties:any, token:string) => {
    return {
        method: 'POST',
        headers: getDefaultHeader(token),
        body: JSON.stringify({
            "entityName": entityName,
            "actionProperties": actionProperties
        })
    }
}

const patchHeader =  (entityName:string, actionProperties:any, token:string) =>  {
    return {
        method: 'PATCH',
        headers: getDefaultHeader(token),
        body: JSON.stringify({
            "entityName": entityName,
            "actionProperties": actionProperties
        })
    }
}

const dummyDataHeader =  (token:string) =>  {
    return {
        method: 'GET',
        headers: getDefaultHeader(token)
    }
}

const dummyPatchHeader = (token:string, body:any) => {
    return {
        method: 'PATCH',
        headers: getDefaultHeader(token),
        body: JSON.stringify(body)
    }
}

const s3PresignedUploadUrlRequestHeader = function (tableFilename:string, expirationDurationInMinutes:string, contentType:any, uploadPath:any, token:string, providerInstanceId:any) {
    return {
        method: 'POST',
        headers: getDefaultHeader(token),
        body: JSON.stringify({
            key: tableFilename,
            expirationDurationInMinutes: expirationDurationInMinutes,
            provider: "S3",
            operation:"UploadPreSignedURL",
            content: contentType,
            absolutePath: uploadPath,
            providerInstanceId
        })
    }
}

const s3PresignedDownloadUrlRequestHeader = function (tableFileName:string, expirationDurationInMinutes:string, token:string, contentType:any, providerInstanceId:any) {
    return {
        method: 'POST',
        headers: getDefaultHeader(token),
        body: JSON.stringify({
            key: tableFileName,
            expirationDurationInMinutes: expirationDurationInMinutes,
            provider: "S3",
            content: contentType,
            operation: "DownloadPreSignedURL",
            absolutePath: tableFileName,
            providerInstanceId
        })
    }
}

const s3CheckIfFileExistsHeader = function (tableFilename:any, token:any, providerInstanceId:any) {
    return {
        method: 'POST',
        headers: getDefaultHeader(token),
        body: JSON.stringify({
            key: tableFilename,
            provider: "S3",
            operation: S3RequestType.CHECK_IF_EXISTS,
            providerInstanceId
        })
    }
}

const s3UploadRequestHeader = function (headers:any, file:any) {
    return {
        method: 'PUT',
        headers: headers,
        body: file
    }
}

const s3DownloadRequestHeader = function (headers:any) {
    return {
        method: 'GET',
        headers: headers,
    }
}

const parseApplicationRequestHeader = function (config:any, token:string) {
    return {
        method: 'POST',
        headers: getDefaultHeader(token),
        body: JSON.stringify(config)
    }
}

const createPostRequestBody = function (bodyContent:any) {
    return {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userSettingsSingleton.token}`
        },
        body: bodyContent
    }
}

/* function accessible through getInstance */
dataManager.getInstance.retreiveData = async function (entityName:string, actionProperties:any) {
    if (!isValidUserSettings()) {
        return;
    }
    const fn = await fetch(endPoint + '/entity/getproxy' + getDefaultRequestQuery(), defaultPostRequest(entityName, actionProperties, userSettingsSingleton.token))
    return await fn.json()
}

dataManager.getInstance.saveData = async function (entityName:string, actionProperties:any) {
    if (!isValidUserSettings()) {
        return;
    }
    const fn = await fetch(endPoint + '/entity' + getDefaultRequestQuery(), defaultPostRequest(entityName, actionProperties, userSettingsSingleton.token))
    return await fn.json()
}

dataManager.getInstance.executeInstance = async function (entityName:string, actionProperties:any) {
    if(!isValidUserSettings()) {
        return;
    }

    const fn = await fetch(endPoint + '/executeInstance' + getDefaultRequestQuery(), defaultPostRequest(entityName, actionProperties, userSettingsSingleton.token))

    return await fn.json()
}

dataManager.getInstance.patchData = async function (entityName:string, actionProperties:any) {
    if (!isValidUserSettings()) {
        return;
    }
    const fn = await fetch(endPoint + '/entity' + getDefaultRequestQuery(), patchHeader(entityName, actionProperties, userSettingsSingleton.token))
    return await fn.json()
}

dataManager.getInstance.addUser = async function (newUserDetails:any) {
    if (!isValidUserSettings()) {
        return;
    }
    const fn = await fetch(endPoint + `/addUser${getDefaultRequestQuery()}${Object.entries(newUserDetails).reduce((a, [key, value]) => a + `&${key}=${value}`, '')}`, dummyDataHeader(userSettingsSingleton.token))
    return fn
}

dataManager.getInstance.fetchUsers = async function () {
    if (!isValidUserSettings()) {
        return;
    }
    const fn = await fetch(endPoint + `/users${getDefaultRequestQuery()}`, dummyDataHeader(userSettingsSingleton.token))
    return fn
}

dataManager.getInstance.fetchSingleUser = async function () {
    if(!isValidUserSettings()) {
        return;
    }

    const fn = await fetch(endPoint + `/singleUser${getDefaultRequestQuery()}`, dummyDataHeader(userSettingsSingleton.token))
    return fn.json()
}

dataManager.getInstance.updateUser = async function (user:any) {
    if (!isValidUserSettings()) {
        return;
    }
    const fn = await fetch(endPoint + `/updateUser${getDefaultRequestQuery()}`, dummyPatchHeader(userSettingsSingleton.token, user))
    return fn.json()
}

dataManager.getInstance.deleteUser = async function (targetUserEmail:string) {
    if (!isValidUserSettings()) {
        return;
    }
    const fn = await fetch(endPoint + `/deleteUser${getDefaultRequestQuery()}&targetUserEmail=${targetUserEmail}`, dummyDataHeader(userSettingsSingleton.token))
    return fn
}

dataManager.getInstance.deleteData = async function (entityName:string, actionProperties:any) {
    if (!isValidUserSettings()) {
        return;
    }
    const fn = await fetch(endPoint + '/entity/deleteproxy' + getDefaultRequestQuery(), defaultPostRequest(entityName, actionProperties, userSettingsSingleton.token))
    return await fn.json()
}

dataManager.getInstance.dummyData = async function (email:string, token:string) {
    const fn = await fetch(endPoint + '/hello?email=' + email, dummyDataHeader(token))
    const data = await fn.json()
    return data
}

dataManager.getInstance.s3PresignedUploadUrlRequest = async function (file:any, expirationDurationInMinutes:any, contentType:any, uploadPath=undefined, providerInstanceId=undefined) {
    if (!isValidUserSettings()) {
        return;
    }
    const response = await fetch(endPoint + '/external/transfer' + getDefaultRequestQuery(), s3PresignedUploadUrlRequestHeader(file.name, expirationDurationInMinutes, contentType, uploadPath, userSettingsSingleton.token, providerInstanceId))
    return response.json()
}

dataManager.getInstance.s3PresignedDownloadUrlRequest = async function (tableFileName:any, expirationDurationInMinutes:any, contentType:any, providerInstanceId=undefined) {
    if (!isValidUserSettings()) {
        return;
    }
    const response = await fetch(endPoint + '/external/transfer' + getDefaultRequestQuery(), s3PresignedDownloadUrlRequestHeader(tableFileName, expirationDurationInMinutes, userSettingsSingleton.token, contentType, providerInstanceId))
    return response.json()
}

dataManager.getInstance.getTableAndColumnTags = async function (tableData:any) {
    if (!isValidUserSettings()) {
        return;
    }
    const response = await fetch(endPoint + '/getTags' + getDefaultRequestQuery(), 
        createPostRequestBody(tableData))
    return response.json()
}

dataManager.getInstance.getGeneratedActionTemplate = async function (requestBody:any) {
    if (!isValidUserSettings()) {
        return;
    }
    const response = await fetch(endPoint + '/getGeneratedAction' + getDefaultRequestQuery(), 
        createPostRequestBody(JSON.stringify(requestBody)))
    return response.json()
}

dataManager.getInstance.s3CheckIfFileExistsRequest = async function (tableFileName:any, providerInstanceId=undefined) {
    if (!isValidUserSettings()) {
        return;
    }
    const response = await fetch(endPoint + '/external/transfer' + getDefaultRequestQuery(), s3CheckIfFileExistsHeader(tableFileName, userSettingsSingleton.token,providerInstanceId) )
    return response.json()
}

dataManager.getInstance.s3UploadRequest = async function (url:any, headers:any, file:any) {
    const response = await fetch(url, s3UploadRequestHeader(headers, file))
    return response
}

dataManager.getInstance.parseApplicationRequest = async function (config:any) {
    if(!isValidUserSettings){
        return;
    }
    const response = await fetch(endPoint + '/external/application' + getDefaultRequestQuery(), parseApplicationRequestHeader(config, userSettingsSingleton.token))
    const responseBody = await response.json()

    if(response.ok) {
        return responseBody
    } else {
        throw responseBody
    }

}

dataManager.getInstance.s3DownloadRequest = async function (url:any, headers:any) {
    const response = await fetch(url, s3DownloadRequestHeader(headers))
    return response.blob()
}

dataManager.getInstance.generateUniqueQueryKey = function () {
    const queryKey = Date.now().toString(12) + Math.random().toString(12).substr(2)
    return queryKey
}

dataManager.getInstance.getRecommendedQuestions = async function(tableId:any) {
    if (!isValidUserSettings()) {
        return;
    }
    const response = await fetch(endPoint + "/getTableQuestions" + getDefaultRequestQuery()+ "&tableId=" + tableId, dummyDataHeader(userSettingsSingleton.token))
    if(response.ok) {
        return response.json()
    } else {
        throw response.json()
    }
}

dataManager.getInstance.getRelatedQuestions = async function (question: string) {
    if(!isValidUserSettings()){
        return;
    }

    const response = await fetch(endPoint + "/getRelatedQuestions" + getDefaultRequestQuery() + "&message=" + question, dummyDataHeader(userSettingsSingleton.token))

    if(response.ok) {
        return response.json()
    } else {
        throw response.json()
    }

}



export const fetchEntityBrowser = async (path:any) => {
    const res = await fetch(endPoint + `/entityBrowser${getDefaultRequestQuery()}&path=${path}`, dummyDataHeader(userSettingsSingleton.token))
    return res.json();
};


export const useRetreiveData = (entityName:any, actionProperties:any, options:any) => useQuery(
    [entityName, actionProperties],
    () => dataManager.getInstance.retreiveData(entityName, actionProperties),
    options
);

export const usePrefetchMultipleRetreiveData = (args:any, enabled:any) => {
    const queryClient = useQueryClient();
    if (enabled) {
        args.forEach(([entityName, actionProperties]:any) => {
            queryClient.prefetchQuery([entityName, actionProperties],
                () => dataManager.getInstance.retreiveData(entityName, actionProperties),
            );
        });
    }
}

const dummyQuery = [{queryKey: 'key',queryFn: ()=>{}, options: {enabled: false}}];
/**
 * 
 * @param {Array[string, object]} keys: array of keys [[entityName, actionProperties]]
 * @param {*} enabled
 */
export const useFetchMultipleRetreiveData = (keys:any, options:any) => {
    const queries = keys?.map((key:any)=>({queryKey: key, queryFn: ()=>dataManager.getInstance.retreiveData(...key), options}));
    return useQueries(queries || dummyQuery);
}


export default dataManager;
