import React from "react";
import { v4 as uuidv4 } from 'uuid';
import { ActionParameterAdditionalConfig, ActionParameterColumnAdditionalConfig, ActionParameterTableAdditionalConfig } from "../../../common/components/action/ParameterDefinitionsConfigPlane";
import { userSettingsSingleton } from "../../../data_manager/userSettingsSingleton";
import ActionParameterDefinitionDatatype from "../../../enums/ActionParameterDefinitionDatatype";
import ActionParameterDefinitionTag from "../../../enums/ActionParameterDefinitionTag";
import { ActionDefinition, ActionInstance, ActionParameterDefinition, ActionParameterInstance, ProviderInstance, Tag } from "../../../generated/entities/Entities";
import { ActionDefinitionDetail } from "../../../generated/interfaces/Interfaces";
import { ActionParameterDefinitionConfig } from "../../build_action/components/common-components/EditActionParameter";
import { MutationContext } from "../hooks/useCreateActionInstance";
import { getDefaultTemplateParameters, safelyParseJSON } from "../util";

// Execute Action Context State
type ActionParameterDefinitionWithTags = {
    parameter: ActionParameterDefinition,
    tags: Tag[]
}

type ExecuteActionContextState = {
    ExistingModels: {
        ActionDefinition: ActionDefinition,
        ActionParameterDefinitions: ActionParameterDefinition[],
        SelectedProviderInstance?: ProviderInstance,
        ParameterAdditionalConfig?: ActionParameterAdditionalConfig[]
    },
    ToCreateModels: {
        ActionInstance: ActionInstance,
        ActionParameterInstances: ActionParameterInstance[],
    },
    creatingModels: boolean,
    currentStep: number,
    startDate?: Date,
    email?: string,
    slack?: string
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
        creatingModels: false,
        currentStep: 0,
        slack: 'C01NSTT6AA3',
        email: userSettingsSingleton.userEmail,
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

export type SetActionInstance = {
    type: "SetActionInstance",
    payload: {
        newActionInstance: ActionInstance
    }
}

export type CreatingModelsAction = {
    type: "CreatingModels"
}

export type CreatingModelsOverAction = {
    type: "CreatingModelsOver"
}

export type GoNextStep = {
    type: "GoToNextStep"
}

export type GoToThisStep = {
    type: "GoToThisStep",
    payload: number
}

export type SetStartDate = {
    type: "SetStartDate",
    payload: Date
}

export type SetSlackAndEmail = {
    type: "SetSlackAndEmail",
    payload: {
        slack?: string,
        email?: string
    }
}

export type SetWriteBackTableName = {
    type: "SetWriteBackTableName",
    payload?: string
}

export type SetProviderInstance = {
    type: "SetProviderInstance",
    payload?: {
        newProviderInstance?: ProviderInstance
    }
}

export type SetParameterAdditionalConfig = {
    type: "SetParameterAdditionalConfig",
    payload: {
        parameterAdditionalConfig: ActionParameterAdditionalConfig
    }
}

export type ExecuteActionAction = SetFromActionDefinitionDetailAction 
                                | SetActionParameterInstancesAction 
                                | CreatingModelsAction 
                                | CreatingModelsOverAction 
                                | GoNextStep 
                                | GoToThisStep 
                                | SetActionInstance 
                                | SetStartDate 
                                | SetSlackAndEmail
                                | SetWriteBackTableName
                                | SetProviderInstance
                                | SetParameterAdditionalConfig



const reducer = (state: ExecuteActionContextState, action: ExecuteActionAction): ExecuteActionContextState => {
    switch (action.type) {
        case "SetFromActionDefinitionDetail":  
            if(state?.ExistingModels?.ActionDefinition?.Id===action.payload.ActionDefinitionDetail?.ActionDefinition?.model?.Id){
                return safeMergeState(state, action.payload.ActionDefinitionDetail)
            } else {
                return resetStateFromActionDefinitionDetail(action.payload.ActionDefinitionDetail)
            }

        case "SetActionParameterInstances":
            const newParameterAdditionalConfigs = formColumnAdditionalConfigs(action.payload.newActionParameterInstances, state.ExistingModels.ActionParameterDefinitions)
            const newState = newParameterAdditionalConfigs?.filter(conf => !!conf)?.reduce((prevValue, currValue) => reducer(prevValue, { type: "SetParameterAdditionalConfig", payload: { parameterAdditionalConfig: currValue! }}), state)

            return {
                ...newState,
                ToCreateModels: {
                    ...newState.ToCreateModels,
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
        
        case "GoToNextStep": 
            const nextStep = state.currentStep + 1
            return {
                ...state,
                currentStep: nextStep
            }

        case "GoToThisStep":
            return {
                ...state,
                currentStep: action.payload
            }
        
        case "SetActionInstance": 
            return {
                ...state,
                ToCreateModels: {
                    ...state.ToCreateModels,
                    ActionInstance: action.payload.newActionInstance
                }
            }
        
        case 'SetStartDate': 
            return {
                ...state,
                startDate: action.payload
            }
        
        case 'SetSlackAndEmail': {
            return {
                ...state,
                slack: action.payload.slack,
                email: action.payload.email
            }
        }

        case 'SetWriteBackTableName': {
            return {
                ...state,
                ToCreateModels: {
                    ...state.ToCreateModels,
                    ActionInstance: {
                        ...state.ToCreateModels.ActionInstance,
                        ResultTableName: action.payload
                    }
                }
            }
        }

        case "SetProviderInstance": {
            const newParamAddConfs: ActionParameterTableAdditionalConfig[] = state.ExistingModels.ActionParameterDefinitions.filter(param => param.Tag===ActionParameterDefinitionTag.TABLE_NAME || param.Datatype===ActionParameterDefinitionDatatype.PANDAS_DATAFRAME
            ).map(param => ({
                parameterDefinitionId: param.Id,
                availableTablesFilter: {
                    ProviderInstanceID: action.payload?.newProviderInstance?.Id
                }
            } as ActionParameterTableAdditionalConfig))
            
            const finalState = newParamAddConfs.reduce((prevValue, currValue) => reducer(prevValue, { type: "SetParameterAdditionalConfig", payload: { parameterAdditionalConfig: currValue }}), state)
            
            return {
                ...finalState,
                ExistingModels: {
                    ...finalState.ExistingModels,
                    SelectedProviderInstance: action.payload?.newProviderInstance
                }
            }
        }

        case "SetParameterAdditionalConfig": {
            const filtered = (state.ExistingModels.ParameterAdditionalConfig || []).filter(addConf => addConf?.parameterDefinitionId !== action?.payload?.parameterAdditionalConfig?.parameterDefinitionId)
            const newParamAddConfs = [...filtered, action.payload.parameterAdditionalConfig]

            return {
                ...state,
                ExistingModels: {
                    ...state.ExistingModels,
                    ParameterAdditionalConfig: newParamAddConfs
                }
            }
        }

        default:
            const neverAction = action
            console.log(`Action: ${neverAction} does not match any action`)
            return state
    }
}

const formColumnAdditionalConfigs = (actionParameterInstances: ActionParameterInstance[], actionParameterDefinitions: ActionParameterDefinition[]) => {
    const columnParamDefsWithParent = actionParameterDefinitions
        ?.filter?.(apd => apd?.Tag === ActionParameterDefinitionTag.COLUMN_NAME)
        ?.filter(apd => {
            const config = safelyParseJSON(apd?.Config) as ActionParameterDefinitionConfig
            return config?.ParentParameterDefinitionId !== undefined
        })


    const columnAdditionalConfig = columnParamDefsWithParent?.map(colParamDef => {
        const colParamDefConfig = safelyParseJSON(colParamDef?.Config) as ActionParameterDefinitionConfig
        const parentParamDef = actionParameterDefinitions?.find(apd => apd?.Id === colParamDefConfig?.ParentParameterDefinitionId)
        const parentParamInstance = actionParameterInstances?.find(api => api.ActionParameterDefinitionId === parentParamDef?.Id)


        if(parentParamInstance?.TableId !== undefined){
            const columnAdditionalConfig: ActionParameterColumnAdditionalConfig = {
                parameterDefinitionId: colParamDef?.Id,
                parentTableId: parentParamInstance?.TableId,
                type: "Column"
            } 
            return columnAdditionalConfig
        } else {
            return undefined
        }
    })?.filter(config => config !== undefined)
    

    return columnAdditionalConfig
}

const resetStateFromActionDefinitionDetail = (actionDetail: ActionDefinitionDetail) => {
    const newActionParameterDefinitions = getDefaultTemplateParameters(actionDetail)
    // const columnAdditionalConfig = newActionParameterDefinitions
    //     ?.filter(ap => ap.Tag === ActionParameterDefinitionTag.COLUMN_NAME)
    //     ?.filter(ap => { 
    //         const config = safelyParseJSON(ap.Config) as ActionParameterDefinitionConfig;
    //         return config?.ParentParameterDefinitionId!==undefined
    //     })
    //     ?.map(ap => {
    //         const config = safelyParseJSON(ap.Config) as ActionParameterDefinitionConfig
    //         const columnAdditionalConfig: ActionParameterColumnAdditionalConfig = {
    //             type: "Column",
    //             parameterDefinitionId: ap?.Id,
    //             parentTableId: config?.ParentParameterDefinitionId
    //         }
    //         return columnAdditionalConfig
    //     })

    return {
        ExistingModels: {
            ActionDefinition: (actionDetail?.ActionDefinition?.model || {}),
            ActionParameterDefinitions: newActionParameterDefinitions,
            ParameterAdditionalConfig: []
        },
        ToCreateModels: {
            ActionInstance: {},
            ActionParameterInstances: newActionParameterDefinitions.map(apd => {
                const defaultActionParameterInstance = JSON.parse( apd.DefaultParameterValue || "{}")  
                return {
                    ActionParameterDefinitionId: apd.Id,
                    ...defaultActionParameterInstance
                }
            })
        },
        creatingModels: false,
        currentStep: 0,
        slack: 'C01NSTT6AA3',
        email: userSettingsSingleton.userEmail,

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
    const {ActionDefinition, ActionParameterDefinitions, SelectedProviderInstance} = state.ExistingModels
    const {ActionInstance, ActionParameterInstances} = state.ToCreateModels
    const tableParameterId: string|undefined = ActionParameterDefinitions?.find(apd => apd?.Tag===ActionParameterDefinitionTag.TABLE_NAME)?.Id
    const getProviderInstanceId: () => string|undefined = () => {
        if(SelectedProviderInstance !== undefined){
            return SelectedProviderInstance.Id
        }
        return ActionParameterInstances.find(api => api.ActionParameterDefinitionId===tableParameterId)?.ProviderInstanceId
    }
    

    const actionInstance: ActionInstance = {
        ...ActionInstance,
        Id: uuidv4(),
        Name: ActionDefinition.DisplayName,
        DisplayName: ActionDefinition.DisplayName,
        DefinitionId: ActionDefinition?.Id,
        TemplateId: ActionDefinition?.DefaultActionTemplateId,
        ProviderInstanceId: getProviderInstanceId(),
        ActionType: ActionDefinition?.ActionType
    }

    const apis = ActionParameterInstances.map(api => ({
        ...api,
        Id: uuidv4(), 
        ActionInstanceId: actionInstance.Id
    }))

    const request: MutationContext = {
        actionInstance: actionInstance,
        actionParameterInstances: apis,
        executionScheduledDate: state.startDate?.getTime().toString(),
        slack: state.slack,
        email: state.email,
        actionExecutionToBeCreatedId: uuidv4()
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