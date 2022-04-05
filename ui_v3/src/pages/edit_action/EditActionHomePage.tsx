import React from "react";
import { RouteComponentProps } from "react-router-dom";
import LoadingIndicator from "../../common/components/LoadingIndicator";
import EditActionForm from "../build_action/components/BuildActionForm";
import { BuildActionContext, BuildActionContextProvider, SetBuildActionContext } from "../build_action/context/BuildActionContext";

interface MatchParams {
    ActionDefinitionId: string
}

const EditActionHomePage = ({match}: RouteComponentProps<MatchParams>) => {
    const actionDefinitionId = match.params.ActionDefinitionId
    return(
        <BuildActionContextProvider>
            <EditActionFormInitialized actionDefinitionId={actionDefinitionId}/>
        </BuildActionContextProvider>
    )
}

export const EditActionFormInitialized = (props: {actionDefinitionId?: string}) => {
    const actionContext = React.useContext(BuildActionContext)
    const setActionContext = React.useContext(SetBuildActionContext)
    React.useEffect(() => {
        setActionContext({
            type: "SetMode",
            payload: {
                mode: "UPDATE"
            }
        })
    }, [])
    
    
    return (
        actionContext.mode==="UPDATE" ?
            <EditActionForm actionDefinitionId={props.actionDefinitionId}/>
        :
            <LoadingIndicator/>
    )
}
export default EditActionHomePage
