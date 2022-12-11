import { SelectChangeEvent } from "@mui/material";
import React from "react";
import { useQuery } from "react-query";
import { Fetcher } from "../../../generated/apis/api";
import { ActionParameterDefinition, ActionParameterInstance } from "../../../generated/entities/Entities";
import labels from "../../../labels/labels";
import { getDefaultTemplateParameters } from "../../../pages/execute_action/util";
import { EditWebAppContext, SetEditWebAppContext, WebAppActionDefition } from "../context/EditWebAppContextProvider";


const useConfigureWebAppActionParameters = ({actionReference}: {actionReference: string}) => {
    
    const editWebAppContext = React.useContext(EditWebAppContext)
    console.log(editWebAppContext)

    const action = editWebAppContext.Actions.find(actionDef => actionDef.ActionReference === actionReference)
    const fetchActionDetailsQuery = useQuery([labels.entities.ActionDefinition, "ConfigureParameters", {Id: action?.ActionDefinition.Id}],
        () => {
            return Fetcher.fetchData('GET', '/getActionDefinitionDetails', {Id: action!.ActionDefinition.Id})
        }
    )
    const [activeParameterIndex, setActiveParameterIndex] = React.useState(0)
    const setEditWebAppContext = React.useContext(SetEditWebAppContext)

    const changeParameterIndex = (index: number) => {
        setActiveParameterIndex(index)
    }

    const parameters = (!!fetchActionDetailsQuery?.data?.[0]) ? getDefaultTemplateParameters(fetchActionDetailsQuery?.data?.[0]) : []

    const findParameterReferenceInAction = (parameter: ActionParameterDefinition) => {
        return Object.entries(action!.ParameterMappings).find(([parameterId, parameterValue]) => parameterId === parameter.Id)?.[1]
    }

    const handleUserInputRequiredChange = (userInputRequired: SelectChangeEvent<string>) => {
        setEditWebAppContext({
            type: 'UpdateActionParameters',
            payload: {
                actionReference: action!.ActionReference,
                ParameterMappings: {
                    ...action!.ParameterMappings,
                    [parameters[activeParameterIndex].Id!]: {
                        ...action!.ParameterMappings[parameters[activeParameterIndex].Id!],
                        UserInputRequired: userInputRequired.target.value === "No" ? "No" : "Yes",
                        GlobalParameterId: userInputRequired.target.value === "No" ? undefined : action!.ParameterMappings[parameters[activeParameterIndex].Id!].GlobalParameterId
                    }
                }
            }
        })
        
    }

    const handleDefaultValueChange = (parameterInstance: ActionParameterInstance[]) => {
        setEditWebAppContext({
            type: 'UpdateActionParameters',
            payload:  {
                actionReference: action!.ActionReference,
                ParameterMappings: {
                    ...action!.ParameterMappings,
                    [parameters[activeParameterIndex].Id!]: {
                        ...action!.ParameterMappings[parameters[activeParameterIndex].Id!],
                        ...parameterInstance[0]
                    }
                }
            }
        })
    }

    const getUpstreamWebAppActions = () => {
        return editWebAppContext.Actions.map(action => action.ActionReference).filter(reference => reference != actionReference)
    }

    return {
        fetchActionDetailsQuery,
        activeParameterIndex,
        changeParameterIndex,
        parameters,
        findParameterReferenceInAction,
        handleUserInputRequiredChange,
        getUpstreamWebAppActions,
        handleDefaultValueChange
    }
}

export default useConfigureWebAppActionParameters