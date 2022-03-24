import { type } from "os";
import React from "react"
import { v4 as uuidv4 } from 'uuid'
import { getAttributesFromInputType } from "../../../custom_enums/ActionParameterDefinitionInputMap";
import { getLanguage } from "../../../custom_enums/SupportedRuntimeGroupToLanguage";
import { userSettingsSingleton } from "../../../data_manager/userSettingsSingleton";
import ActionDefinitionActionType from "../../../enums/ActionDefinitionActionType";
import ActionDefinitionPresentationFormat from "../../../enums/ActionDefinitionPresentationFormat";
import ActionParameterDefinitionDatatype from "../../../enums/ActionParameterDefinitionDatatype";
import ActionParameterDefinitionInputType from "../../../enums/ActionParameterDefinitionInputType";
import ActionParameterDefinitionTag from "../../../enums/ActionParameterDefinitionTag";
import ActionParameterDefinitionType from "../../../enums/ActionParameterDefinitionType";
import TemplateLanguage from "../../../enums/TemplateLanguage";
import TemplateSupportedRuntimeGroup from "../../../enums/TemplateSupportedRuntimeGroup";
import { ActionDefinition, ActionInstance, ActionParameterDefinition, ActionParameterInstance, ActionTemplate, Tag } from "../../../generated/entities/Entities";
import { ActionDefinitionDetail } from "../../../generated/interfaces/Interfaces";
import { MutationContext } from "../hooks/useCreateActionInstance";
import { getDefaultTemplateParameters } from "../util";

// Execute Action Context State
type ActionParameterDefinitionWithTags = {
    parameter: ActionParameterDefinition,
    tags: Tag[]
}

type ExecuteActionContextState = {
    ExistingModels: {
        ActionDefinition: ActionDefinition,
        ActionParameterDefinitions: ActionParameterDefinition[],    
    },
    ToCreateModels: {
        ActionInstance: ActionInstance,
        ActionParameterInstances: ActionParameterInstance[],
    },
    creatingModels: boolean
}

const defaultExecuteActionContext: () => ExecuteActionContextState = () => {
    return {
        ExistingModels: {
            ActionDefinition: {},
            ActionParameterDefinitions: []
        },
        ToCreateModels: {
            ActionInstance: {},
            ActionParameterInstances: []
        },
        creatingModels: false
    }
}

export const ExecuteActionContext = React.createContext<ExecuteActionContextState>(defaultExecuteActionContext()) 

// Set Execute Action Context State
type SetExecuteActionContextState = (action: ExecuteActionAction) => void
const defaultSetExecuteActionContextState: SetExecuteActionContextState = (action: ExecuteActionAction) => {}
export const SetExecuteActionContext = React.createContext<SetExecuteActionContextState>(defaultSetExecuteActionContextState)

export type SetFromActionDefinitionDetailAction = {
    type: "SetFromActionDefinitionDetail",
    payload: {
        ActionDefinitionDetail: ActionDefinitionDetail
    }
}

export type SetActionParameterInstancesAction = {
    type: "SetActionParameterInstances",
    payload: {
        newActionParameterInstances: ActionParameterInstance[]
    }
}

export type CreatingModelsAction = {
    type: "CreatingModels"
}

export type CreatingModelsOverAction = {
    type: "CreatingModelsOver"
}


export type ExecuteActionAction = SetFromActionDefinitionDetailAction | SetActionParameterInstancesAction | CreatingModelsAction | CreatingModelsOverAction



const reducer = (state: ExecuteActionContextState, action: ExecuteActionAction): ExecuteActionContextState => {
    switch (action.type) {
        case "SetFromActionDefinitionDetail":  
            if(state?.ExistingModels?.ActionDefinition?.Id===action.payload.ActionDefinitionDetail?.ActionDefinition?.model?.Id){
                return safeMergeState(state, action.payload.ActionDefinitionDetail)
            } else {
                return resetStateFromActionDefinitionDetail(action.payload.ActionDefinitionDetail)
            }

        case "SetActionParameterInstances":
            return {
                ...state,
                ToCreateModels: {
                    ...state.ToCreateModels,
                    ActionParameterInstances: action.payload.newActionParameterInstances
                }
            }
        
        case "CreatingModels":
            return {
                ...state,
                creatingModels: true
            }

        case "CreatingModelsOver":
            return {
                ...state,
                creatingModels: false
            }

        default:
            const neverAction = action
            console.log(`Action: ${neverAction} does not match any action`)
            return state
    }
}

const resetStateFromActionDefinitionDetail = (actionDetail: ActionDefinitionDetail) => {
    return {
        ExistingModels: {
            ActionDefinition: (actionDetail?.ActionDefinition?.model || {}),
            ActionParameterDefinitions: getDefaultTemplateParameters(actionDetail)
        },
        ToCreateModels: {
            ActionInstance: {},
            ActionParameterInstances: []
        },
        creatingModels: false
    } as ExecuteActionContextState
}


const safeMergeState = (oldState: ExecuteActionContextState, actionDetail: ActionDefinitionDetail): ExecuteActionContextState => {
    const newActionParameterDefinitions = getDefaultTemplateParameters(actionDetail)
    const newActionParameterInstances = oldState.ToCreateModels.ActionParameterInstances.filter(api => newActionParameterDefinitions.find(apd => apd.Id===api.ActionParameterDefinitionId))
    return {
        ...oldState,
        ExistingModels: {
            ...oldState.ExistingModels,
            ActionDefinition: {
                ...oldState.ExistingModels.ActionDefinition,
                ...(actionDetail?.ActionDefinition?.model||{})
            },
            ActionParameterDefinitions: newActionParameterDefinitions
        },
        ToCreateModels: {
            ActionInstance: {
                ...oldState.ToCreateModels.ActionInstance
            },
            ActionParameterInstances: newActionParameterInstances
        },
        creatingModels: false
    }
}

export const constructCreateActionInstanceRequest = (state: ExecuteActionContextState) => {
    const {ActionDefinition, ActionParameterDefinitions} = state.ExistingModels
    const {ActionInstance, ActionParameterInstances} = state.ToCreateModels
    const tableParameterId: string|undefined = ActionParameterDefinitions?.find(apd => apd?.Tag===ActionParameterDefinitionTag.TABLE_NAME)?.Id
    const providerInstanceId: string|undefined = ActionParameterInstances.find(api => api.ActionParameterDefinitionId===tableParameterId)?.ProviderInstanceId
    

    const actionInstance: ActionInstance = {
        Id: uuidv4(),
        Name: ActionDefinition.DisplayName,
        DisplayName: ActionDefinition.DisplayName,
        DefinitionId: ActionDefinition?.Id,
        TemplateId: ActionDefinition?.DefaultActionTemplateId,
        ProviderInstanceId: providerInstanceId,
        ActionType: ActionDefinition?.ActionType
    }

    const apis = ActionParameterInstances.map(api => ({
        ...api,
        Id: uuidv4(), 
        ActionInstanceId: actionInstance.Id
    }))

    const request: MutationContext = {
        actionInstance: actionInstance,
        actionParameterInstances: apis
    }

    return request;
}


export const ExecuteActionContextProvider = ({children}: {children: React.ReactElement}) => {
    const [contextState, dispatch] = React.useReducer(reducer, defaultExecuteActionContext())
    const setContextState: SetExecuteActionContextState = ( args: ExecuteActionAction) => dispatch(args)

    return (
        <ExecuteActionContext.Provider value={contextState}>
            <SetExecuteActionContext.Provider value={setContextState}>
                {children}
            </SetExecuteActionContext.Provider>
        </ExecuteActionContext.Provider>
    )
}