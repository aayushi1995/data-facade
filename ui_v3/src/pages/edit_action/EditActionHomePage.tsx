import { Box, Dialog, DialogContent } from "@mui/material";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import BuildActionForm from "../build_action/components/BuildActionForm";
import { BuildActionContextProvider, SetBuildActionContext } from "../build_action/context/BuildActionContext";

interface MatchParams {
    ActionDefinitionId: string
}

const EditActionHomePage = ({match}: RouteComponentProps<MatchParams>) => {
    const actionDefinitionId = match.params.ActionDefinitionId
    return(
        <BuildActionContextProvider>
            <ContextWrappedHomePage preSelectedActionDefiniitonId={actionDefinitionId}/>
        </BuildActionContextProvider>
    )
}

const ContextWrappedHomePage = (props: {preSelectedActionDefiniitonId?: string}) => {
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
        <Box>
            <BuildActionForm preSelectedActionDefiniitonId={props.preSelectedActionDefiniitonId}/>
        </Box>
    )
}
export default EditActionHomePage;