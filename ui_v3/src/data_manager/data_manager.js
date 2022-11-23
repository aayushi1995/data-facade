import S3RequestType from "../custom_enums/S3RequestType";
import {userSettingsSingleton} from "./userSettingsSingleton";
import {useQuery, useQueryClient, useQueries} from "react-query";

const endPoint = require("./../common/config/config").FDSEndpoint
console.log(endPoint)
/* 
    Data manager for retreive and save operations. 
    Behaves like singleton.
*/

var dataManager = {
    getInstance: {}
};

const isValidUserSettings = () => userSettingsSingleton.userEmail && userSettingsSingleton.token
/* private functions */
const retreiveHeader = function (entityName, actionProperties, token) {
    return {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            "entityName": entityName,
            "actionProperties": actionProperties
        })
    }
}
const saveHeader = function (entityName, actionProperties, token) {
    return {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            "entityName": entityName,
            "actionProperties": actionProperties
        })
    }
}
const deleteHeader = function (entityName, actionProperties, token) {
    return {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            "entityName": entityName,
            "actionProperties": actionProperties
        })
    }
}
const patchHeader = function (entityName, actionProperties, token) {
    return {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            "entityName": entityName,
            "actionProperties": actionProperties
        })
    }
}
const dummyDataHeader = function (token) {
    return {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }
}
const s3PresignedUploadUrlRequestHeader = function (tableFilename, expirationDurationInMinutes, contentType, uploadPath, token) {
    return {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            key: tableFilename,
            expirationDurationInMinutes: expirationDurationInMinutes,
            provider: "S3",
            operation:"UploadPreSignedURL",
            content: contentType,
            absolutePath: uploadPath
        })
    }
}
const s3PresignedDownloadUrlRequestHeader = function (tableFileName, expirationDurationInMinutes, token, contentType) {
    return {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            key: tableFileName,
            expirationDurationInMinutes: expirationDurationInMinutes,
            provider: "S3",
            content: contentType,
            operation: "DownloadPreSignedURL",
            absolutePath: tableFileName
        })
    }
}

const s3CheckIfFileExistsHeader = function (tableFilename, token) {
    return {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            key: tableFilename,
            provider: "S3",
            operation: S3RequestType.CHECK_IF_EXISTS
        })
    }
}

const s3UploadRequestHeader = function (headers, file) {
    return {
        method: 'PUT',
        headers: headers,
        body: file
    }
}

const s3DownloadRequestHeader = function (headers) {
    return {
        method: 'GET',
        headers: headers,
    }
}

const parseApplicationRequestHeader = function (config, token) {
    return {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(config)
    }
}

const getTableAndColumnTags = function (tableData, token) {
    return {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: tableData
    }
}

/* function accessible through getInstance */
dataManager.getInstance.retreiveData = async function (entityName, actionProperties) {
    if (!isValidUserSettings()) {
        return;
    }
    const fn = await fetch(endPoint + '/entity/getproxy?email=' + userSettingsSingleton.userEmail, retreiveHeader(entityName, actionProperties, userSettingsSingleton.token))
    return await fn.json()
}

dataManager.getInstance.saveData = async function (entityName, actionProperties) {
    if (!isValidUserSettings()) {
        return;
    }
    const fn = await fetch(endPoint + '/entity?email=' + userSettingsSingleton.userEmail, saveHeader(entityName, actionProperties, userSettingsSingleton.token))
    return await fn.json()
}

dataManager.getInstance.executeInstance = async function (entityName, actionProperties) {
    if(!isValidUserSettings()) {
        return;
    }

    const fn = await fetch(endPoint + '/executeInstance?email=' + userSettingsSingleton.userEmail, saveHeader(entityName, actionProperties, userSettingsSingleton.token))

    return await fn.json()
}

dataManager.getInstance.patchData = async function (entityName, actionProperties) {
    if (!isValidUserSettings()) {
        return;
    }
    console.log(patchHeader(entityName, actionProperties, userSettingsSingleton.token))
    const fn = await fetch(endPoint + '/entity?email=' + userSettingsSingleton.userEmail, patchHeader(entityName, actionProperties, userSettingsSingleton.token))
    return await fn.json()
}

dataManager.getInstance.addUser = async function (newUserDetails) {
    if (!isValidUserSettings()) {
        return;
    }
    const fn = await fetch(endPoint + `/addUser?email=${userSettingsSingleton.userEmail}${Object.entries(newUserDetails).reduce((a, [key, value]) => a + `&${key}=${value}`, '')}`, dummyDataHeader(userSettingsSingleton.token))
    return fn
}

dataManager.getInstance.fetchUsers = async function () {
    if (!isValidUserSettings()) {
        return;
    }
    const fn = await fetch(endPoint + `/users?email=${userSettingsSingleton.userEmail}`, dummyDataHeader(userSettingsSingleton.token))
    return fn
}

dataManager.getInstance.updateUser = async function (user) {
    if (!isValidUserSettings()) {
        return;
    }
    try {
        await dataManager.getInstance.deleteUser(user.email);
    } catch (e) {
        console.error(e);
        //if delete user fails, do not proceed to add user
        return;
    }
    let updatedUser = {...user, newUserEmail: user.email}
    delete updatedUser["email"]
    return dataManager.getInstance.addUser(updatedUser);
}
dataManager.getInstance.deleteUser = async function (targetUserEmail) {
    if (!isValidUserSettings()) {
        return;
    }
    const fn = await fetch(endPoint + `/deleteUser?email=${userSettingsSingleton.userEmail}&targetUserEmail=${targetUserEmail}`, dummyDataHeader(userSettingsSingleton.token))
    return fn
}

dataManager.getInstance.deleteData = async function (entityName, actionProperties) {
    if (!isValidUserSettings()) {
        return;
    }
    const fn = await fetch(endPoint + '/entity/deleteproxy?email=' + userSettingsSingleton.userEmail, deleteHeader(entityName, actionProperties, userSettingsSingleton.token))
    return await fn.json()
}

dataManager.getInstance.dummyData = async function (email, token) {
    if (!isValidUserSettings()) {
        return;
    }
    const fn = await fetch(endPoint + '/hello?email=' + email, dummyDataHeader(token))
    return fn
}

dataManager.getInstance.s3PresignedUploadUrlRequest = async function (file, expirationDurationInMinutes, contentType, uploadPath=undefined) {
    if (!isValidUserSettings()) {
        return;
    }
    console.log(file.name, expirationDurationInMinutes)
    const response = await fetch(endPoint + '/external/transfer?email=' + userSettingsSingleton.userEmail, s3PresignedUploadUrlRequestHeader(file.name, expirationDurationInMinutes, contentType, uploadPath, userSettingsSingleton.token))
    return response.json()
}

dataManager.getInstance.s3PresignedDownloadUrlRequest = async function (tableFileName, expirationDurationInMinutes, contentType) {
    if (!isValidUserSettings()) {
        return;
    }
    console.log(tableFileName, expirationDurationInMinutes)
    const response = await fetch(endPoint + '/external/transfer?email=' + userSettingsSingleton.userEmail, s3PresignedDownloadUrlRequestHeader(tableFileName, expirationDurationInMinutes, userSettingsSingleton.token, contentType))
    return response.json()
}

dataManager.getInstance.getTableAndColumnTags = async function (tableData) {
    if (!isValidUserSettings()) {
        return;
    }
    const response = await fetch(endPoint + '/getTags?email=' + userSettingsSingleton.userEmail, getTableAndColumnTags(tableData, userSettingsSingleton.token))
    return response.json()
}

dataManager.getInstance.s3CheckIfFileExistsRequest = async function (tableFileName) {
    if (!isValidUserSettings()) {
        return;
    }
    const response = await fetch(endPoint + '/external/transfer?email=' + userSettingsSingleton.userEmail, s3CheckIfFileExistsHeader(tableFileName, userSettingsSingleton.token))
    return response.json()
}

dataManager.getInstance.s3UploadRequest = async function (url, headers, file) {
    const response = await fetch(url, s3UploadRequestHeader(headers, file))
    return response
}

dataManager.getInstance.parseApplicationRequest = async function (config) {
    if(!isValidUserSettings){
        return;
    }
    const response = await fetch(endPoint + '/external/application?email=' + userSettingsSingleton.userEmail, parseApplicationRequestHeader(config, userSettingsSingleton.token))
    const responseBody = await response.json()

    if(response.ok) {
        return responseBody
    } else {
        throw responseBody
    }

}

dataManager.getInstance.s3DownloadRequest = async function (url, headers) {
    const response = await fetch(url, s3DownloadRequestHeader(headers))
    return response.blob()
}

dataManager.getInstance.generateUniqueQueryKey = function () {
    const queryKey = Date.now().toString(12) + Math.random().toString(12).substr(2)
    return queryKey
}

export const useRetreiveData = (entityName, actionProperties, options) => useQuery(
    [entityName, actionProperties],
    () => dataManager.getInstance.retreiveData(entityName, actionProperties),
    options
);

export const usePrefetchMultipleRetreiveData = (args, enabled) => {
    const queryClient = useQueryClient();
    if (enabled) {
        args.forEach(([entityName, actionProperties]) => {
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
export const useFetchMultipleRetreiveData = (keys, options) => {
    const queries = keys?.map(key=>({queryKey: key, queryFn: ()=>dataManager.getInstance.retreiveData(...key), options}));
    return useQueries(queries || dummyQuery);
}


export default dataManager;
