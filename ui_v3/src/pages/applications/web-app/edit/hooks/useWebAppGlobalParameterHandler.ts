import React from "react"
import { v4 as uuidv4 } from "uuid"
import ActionParameterDefinitionDatatype from "../../../../../enums/ActionParameterDefinitionDatatype"
import ActionParameterDefinitionTag from "../../../../../enums/ActionParameterDefinitionTag"
import { ActionParameterDefinition, ActionParameterInstance } from "../../../../../generated/entities/Entities"
import { EditWebAppContext, SetEditWebAppContext } from "../context/EditWebAppContextProvider"


interface UseWebAppGlobalParameterHandlerParams {
    currentParameter: ActionParameterDefinition,
    currentParameterInstance: ActionParameterInstance
    actionReference: string
}

const useWebAppGlobalParameterHandler = ({currentParameter, currentParameterInstance, actionReference}: UseWebAppGlobalParameterHandlerParams) => {

    const editWebAppContext = React.useContext(EditWebAppContext)
    const setEditWebAppContext = React.useContext(SetEditWebAppContext)

    const availableParameters = editWebAppContext.WebAppParameters.filter(param => 
        (param.Tag === currentParameter.Tag || param.Tag === ActionParameterDefinitionTag.TABLE_NAME && currentParameter.Tag === ActionParameterDefinitionTag.DATA) && 
        (param.Datatype === currentParameter.Datatype || param.Datatype === ActionParameterDefinitionDatatype.STRING && currentParameter.Datatype === ActionParameterDefinitionDatatype.PANDAS_DATAFRAME))
    const currentGlobalParameterSelected: ActionParameterDefinition = editWebAppContext.WebAppParameters.find(waParameter => waParameter.Id === currentParameterInstance.GlobalParameterId) || {}

    const addAndMapGlobalParameter = (globalParamToAdd: ActionParameterDefinition) => {
        const paramterName = globalParamToAdd.ParameterName
        const id = uuidv4()  
        const newGlobalParamter: ActionParameterDefinition = { 
            ...globalParamToAdd, 
            Id: id, 
            ParameterName: paramterName, 
            Datatype: currentParameter.Datatype === ActionParameterDefinitionDatatype.PANDAS_DATAFRAME ? ActionParameterDefinitionDatatype.STRING : currentParameter.Datatype, 
            Tag: currentParameter.Tag === ActionParameterDefinitionTag.DATA ? ActionParameterDefinitionTag.TABLE_NAME : currentParameter.Tag , 
            OptionSetValues: currentParameter.OptionSetValues,
            IsOptional: currentParameter.IsOptional 
        } 
        setEditWebAppContext({
            type: 'AddGlobalParameter',
            payload: {
                parameter: newGlobalParamter
            }
        })
        mapToGlobalParameter(id)
    }

    const mapToGlobalParameter = (globalParameterId: string) => {
        setEditWebAppContext({
            type: 'MapParameterToGlobalParameter',
            payload: {
                actionReference: actionReference,
                childParameterId: currentParameter.Id!,
                globalParameterId: globalParameterId
            }
        })
    }

    return {
        availableParameters,
        currentGlobalParameterSelected,
        addAndMapGlobalParameter,
        mapToGlobalParameter
    }
}

export default useWebAppGlobalParameterHandler