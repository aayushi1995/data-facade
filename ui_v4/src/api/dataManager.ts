import { useQueries} from "react-query";
import { userSettingsSingleton } from "@settings/userSettingsSingleton";
import { FDSEndpoint } from "@/settings/config";

const endPoint = FDSEndpoint

const  dataManager:any = {
    getInstance: {}
};


const isValidUserSettings = () => userSettingsSingleton.userEmail && userSettingsSingleton.token

const retreiveHeader =  (entityName:string, actionProperties:any, token:string) => {
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

const saveHeader =  (entityName:string, actionProperties:any, token:string) =>  {
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

const deleteHeader =   (entityName:string, actionProperties:any, token:string) =>  {
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
const patchHeader =  (entityName:string, actionProperties:any, token:string) =>  {
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

const dummyDataHeader =  (token:string) =>  {
    return {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }
}

const dummyPatchHeader = (token:string, body:any) => {
    return {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
    }
}

dataManager.getInstance.retreiveData = async function (entityName:string, actionProperties:any) {
    if (!isValidUserSettings()) {
        return;
    }
    const fn = await fetch(endPoint + '/entity/getproxy?email=' + userSettingsSingleton.userEmail, retreiveHeader(entityName, actionProperties, userSettingsSingleton.token))
    return await fn.json()
}

const dummyQuery = [{queryKey: 'key',queryFn: ()=>{}, options: {enabled: false}}];


export const useFetchMultipleRetreiveData = (keys:any, options:any) => {
    const queries = keys?.map((key:any)=>({queryKey: key, queryFn: ()=>dataManager.getInstance.retreiveData(...key), options}));
    return useQueries(queries || dummyQuery);
}




export default dataManager;