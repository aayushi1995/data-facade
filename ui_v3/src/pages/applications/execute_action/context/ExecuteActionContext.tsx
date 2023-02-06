import React from "react";
import { v4 as uuidv4 } from 'uuid';
import { ActionParameterAdditionalConfig, ActionParameterColumnAdditionalConfig, ActionParameterTableAdditionalConfig } from "../../../../common/components/parameters/ParameterInput";
import { userSettingsSingleton } from "../../../../data_manager/userSettingsSingleton";
import ActionParameterDefinitionDatatype from "../../../../enums/ActionParameterDefinitionDatatype";
import ActionParameterDefinitionTag from "../../../../enums/ActionParameterDefinitionTag";
import WriteBackSchemaNames from "../../../../enums/WriteBackSchemaNames";
import { ActionDefinition, ActionInstance, ActionParameterDefinition, ActionParameterInstance, ActionTemplate, ProviderInstance, TableProperties, Tag } from "../../../../generated/entities/Entities";
import { ActionDefinitionDetail, ActionInstanceWithParameters } from "../../../../generated/interfaces/Interfaces";
import { ActionParameterDefinitionConfig } from "../../build_action_old/components/common-components/EditActionParameter";
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
        ParameterAdditionalConfig?: ActionParameterAdditionalConfig[],
        ActionTemplates?: ActionTemplate[]
    },
    ToCreateModels: {
        ActionInstance: ActionInstance,
        ActionParameterInstances: ActionParameterInstance[],
    },
    creatingModels: boolean,
    currentStep: number,
    startDate?: Date,
    email?: string,
    slack?: string,
    selectedActionIndex?: number,
    postProcessingActions?: ActionInstanceWithParameters[]
}

const defaultExecuteActionContext: () => ExecuteActionContextState = () => {
    return {
        ExistingModels: {
            ActionDefinition: {},
            ActionParameterDefinitions: [],
            ActionTemplates: []
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
        existingParameterInstances?: ActionParameterInstance[],
        parentExecutionId?: string,
        tableId?: string
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

export type FormAdditionalConfig = {
    type: "FormAdditionalConfig"
}

export type AddPostProcessingActionDefinition = {
    type: "AddPostProcessingActionDefinition",
    payload: {
        actionDetails: ActionDefinitionDetail
    }
}

export type ChangeNameOfPostProcessingAction = {
    type: "ChangeNameOfPostProcessingAction",
    payload: {
        actionIndex: number,
        newName: string
    }
}

export type SetSelectedPostProcessingActionIndex = {
    type: "SetSelectedPostProcessingActionIndex",
    payload: {
        actionIndex: number
    }
}

export type ChangePostProcessingActionParameterInstances = {
    type: "ChangePostProcessingActionParameterInstances",
    payload: {
        actionIndex: number,
        parameterInstances: ActionParameterInstance[]
    }
}

export type SetPostProcessingActions = {
    type: "SetPostProcessingActions",
    payload: {
        postActions: ActionInstanceWithParameters[]
    }
}

export type DeltePostProcessingAction = {
    type: 'DeltePostProcessingAction',
    payload: {
        actionIndex: number
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
                                | FormAdditionalConfig
                                | AddPostProcessingActionDefinition 
                                | ChangeNameOfPostProcessingAction
                                | SetSelectedPostProcessingActionIndex
                                | ChangePostProcessingActionParameterInstances
                                | SetPostProcessingActions
                                | DeltePostProcessingAction



const reducer = (state: ExecuteActionContextState, action: ExecuteActionAction): ExecuteActionContextState => {
    switch (action.type) {
        case "SetFromActionDefinitionDetail": {
            const newState = state?.ExistingModels?.ActionDefinition?.Id===action.payload.ActionDefinitionDetail?.ActionDefinition?.model?.Id ? safeMergeState(state, action.payload.ActionDefinitionDetail) : resetStateFromActionDefinitionDetail(state, action.payload.ActionDefinitionDetail)
            if(!!action.payload.existingParameterInstances) {
                return reducer(newState, {type: 'SetActionParameterInstances', payload: {newActionParameterInstances: action.payload.existingParameterInstances}})
            }
            if(!!action.payload.parentExecutionId || action.payload.tableId) {
                return {
                    ...newState,
                    ToCreateModels: {
                        ...newState.ToCreateModels,
                        ActionParameterInstances: newState.ToCreateModels.ActionParameterInstances.map(api => {
                            const apd = newState.ExistingModels.ActionParameterDefinitions.find(apd => apd.Id === api.ActionParameterDefinitionId)!
                            if(apd.Tag === ActionParameterDefinitionTag.DATA || apd.Tag === ActionParameterDefinitionTag.TABLE_NAME) {
                                return {
                                    ...api,
                                    TableId: action.payload.parentExecutionId || action.payload.tableId,
                                    ParameterValue: action.payload.parentExecutionId && "Previous Execution"
                                }
                            }
                            return api
                        })
                    }
                }
            }
            return newState
        }

        case "SetActionParameterInstances":
            const newParameterAdditionalConfigs = formColumnAdditionalConfigs(action.payload.newActionParameterInstances, state.ExistingModels.ActionParameterDefinitions)
            const modifiedState = newParameterAdditionalConfigs?.filter(conf => !!conf)?.reduce((prevValue, currValue) => reducer(prevValue, { type: "SetParameterAdditionalConfig", payload: { parameterAdditionalConfig: currValue! }}), state)

            const newState = {
                ...modifiedState,
                ToCreateModels: {
                    ...modifiedState.ToCreateModels,
                    ActionParameterInstances: action.payload.newActionParameterInstances
                }
            }

            return reducer(newState, { type: "FormAdditionalConfig" })
        
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
            const newState = {
                ...state,
                ExistingModels: {
                    ...state.ExistingModels,
                    SelectedProviderInstance: action.payload?.newProviderInstance
                }
            }
            
            return reducer(newState, { type: "FormAdditionalConfig" })
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

        case "FormAdditionalConfig": {
            // Form Column Additional Confs
            const tableParameterInstances = state?.ToCreateModels?.ActionParameterInstances?.filter(api => {
                const apd = state?.ExistingModels?.ActionParameterDefinitions?.find?.(apd => apd?.Id === api?.ActionParameterDefinitionId)
                return apd?.Tag===ActionParameterDefinitionTag.TABLE_NAME || apd?.Datatype === ActionParameterDefinitionDatatype.PANDAS_DATAFRAME || apd?.Tag===ActionParameterDefinitionTag.DATA
            })

            const allTablesFilter = tableParameterInstances
                ?.filter(tpi => tpi?.TableId!==undefined)
                ?.map(tpi => ({ Id: tpi?.TableId } as TableProperties) )
                

            const additionalConfForColumnParameters = state?.ExistingModels?.ActionParameterDefinitions
                ?.filter(apd => apd?.Tag === ActionParameterDefinitionTag.COLUMN_NAME || apd?.Datatype === ActionParameterDefinitionDatatype.COLUMN_NAMES_LIST)
                ?.map(columnParamDef => {
                    const config = safelyParseJSON(columnParamDef?.Config) as ActionParameterDefinitionConfig
                    const parentParameterDefinition = state?.ExistingModels?.ActionParameterDefinitions?.find(apd => apd?.Id===config?.ParentParameterDefinitionId)
                    const parentParameterInstance = state?.ToCreateModels?.ActionParameterInstances?.find(api => api?.ActionParameterDefinitionId===parentParameterDefinition?.Id)
                    if(parentParameterDefinition!==undefined){
                        if(parentParameterInstance?.TableId!==undefined) {
                            return {
                                parameterDefinitionId: columnParamDef?.Id,
                                availableTablesFilter: [{ Id: parentParameterInstance?.TableId } as TableProperties]
                            } as ActionParameterColumnAdditionalConfig
                        } else {
                            return {
                                parameterDefinitionId: columnParamDef?.Id,
                                availableTablesFilter: [] as TableProperties[]
                            } as ActionParameterColumnAdditionalConfig
                        }
                    } else {
                        return {
                            parameterDefinitionId: columnParamDef?.Id,
                            availableTablesFilter: allTablesFilter
                        } as ActionParameterColumnAdditionalConfig
                    }
                })
            

            const additionalConfsForTableParameters: ActionParameterTableAdditionalConfig[] = state?.ExistingModels?.SelectedProviderInstance!==undefined ? 
                state.ExistingModels.ActionParameterDefinitions.filter(param => param.Tag===ActionParameterDefinitionTag.TABLE_NAME || param.Datatype===ActionParameterDefinitionDatatype.PANDAS_DATAFRAME)
                    .map(param => ({
                        parameterDefinitionId: param.Id,
                        availableTablesFilter: [{
                            ProviderInstanceID: state?.ExistingModels?.SelectedProviderInstance
                        }]
                    } as ActionParameterTableAdditionalConfig))
                :
                []
            
            const newParamAddConfs = [...additionalConfsForTableParameters, ...additionalConfForColumnParameters]
            const finalState = newParamAddConfs.reduce((prevValue, currValue) => reducer(prevValue, { type: "SetParameterAdditionalConfig", payload: { parameterAdditionalConfig: currValue }}), state)

            return finalState
        }

        case "AddPostProcessingActionDefinition": {
            const defaultActionTemplate = action.payload.actionDetails.ActionTemplatesWithParameters?.find(templateDetails => templateDetails.model?.Id === action.payload.actionDetails.ActionDefinition?.model?.DefaultActionTemplateId)
            const newPostProcessingAction: ActionInstanceWithParameters = {
                model: {
                    DefinitionId: action.payload.actionDetails.ActionDefinition?.model?.Id,
                    DisplayName: action.payload.actionDetails.ActionDefinition?.model?.DisplayName,
                    Name: action.payload.actionDetails.ActionDefinition?.model?.DisplayName,
                    TemplateId: defaultActionTemplate?.model?.Id,
                    ResultTableName: action.payload.actionDetails.ActionDefinition?.model?.DisplayName || "" + uuidv4(),
                    ResultSchemaName: WriteBackSchemaNames.DF_TEMP_SCHEMA
                },
                ParameterInstances: defaultActionTemplate?.actionParameterDefinitions?.map(paramterDetails => {
                    const defaultActionParameterInstance = JSON.parse( paramterDetails.model?.DefaultParameterValue || "{}") as ActionParameterInstance
                    
                    return {
                        ...defaultActionParameterInstance,
                        ActionParameterDefinitionId: paramterDetails.model?.Id, 
                        SourceExecutionId: paramterDetails.model?.Tag === ActionParameterDefinitionTag.TABLE_NAME || paramterDetails.model?.Tag === ActionParameterDefinitionTag.DATA ? "Previous Execution " : undefined,
                        ParameterValue: paramterDetails.model?.Tag === ActionParameterDefinitionTag.TABLE_NAME || paramterDetails.model?.Tag === ActionParameterDefinitionTag.DATA ? "Previous Execution " : undefined,
                    }
                })
            }
            return {
                ...state,
                postProcessingActions: [...state?.postProcessingActions || [], newPostProcessingAction],
                selectedActionIndex: state.postProcessingActions?.length || 0
            }
        }

        case "ChangeNameOfPostProcessingAction": {
            return {
                ...state,
                postProcessingActions: state.postProcessingActions?.map((postAction, index) => index === action.payload.actionIndex ? {...postAction,
                    model: {
                        ...postAction.model,
                        Name: action.payload.newName,
                        DisplayName: action.payload.newName
                    }
                } : postAction)
            }
        }

        case "SetSelectedPostProcessingActionIndex": {
            return {
                ...state,
                selectedActionIndex: action.payload.actionIndex === state.selectedActionIndex ? undefined : action.payload.actionIndex
            }
        }

        case "ChangePostProcessingActionParameterInstances": {
            return {
                ...state,
                postProcessingActions: state.postProcessingActions?.map((actionDetails, index) => index === action.payload.actionIndex ? {
                    ...actionDetails,
                    ParameterInstances: action.payload.parameterInstances
                } : actionDetails)
            }
        }

        case "SetPostProcessingActions": {
            return {
                ...state,
                postProcessingActions: action.payload.postActions
            }
        }

        case "DeltePostProcessingAction": {
            return {
                ...state,
                postProcessingActions: state.postProcessingActions?.filter((actionPost, index) => index !== action.payload.actionIndex),
                selectedActionIndex: state.selectedActionIndex === action.payload.actionIndex ? undefined : state.selectedActionIndex
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
                availableTablesFilter: [{Id: parentParamInstance?.TableId}],
                type: "Column"
            } 
            return columnAdditionalConfig
        } else {
            return undefined
        }
    })?.filter(config => config !== undefined)
    

    return columnAdditionalConfig
}

const resetStateFromActionDefinitionDetail = (state: ExecuteActionContextState, actionDetail: ActionDefinitionDetail) => {
    const newActionParameterDefinitions = getDefaultTemplateParameters(actionDetail)

    return {
        ...state,
        ExistingModels: {
            ...state?.ExistingModels,
            ActionDefinition: (actionDetail?.ActionDefinition?.model || {}),
            ActionParameterDefinitions: newActionParameterDefinitions,
            ParameterAdditionalConfig: [],
            ActionTemplates: (actionDetail?.ActionTemplatesWithParameters?.map(templateWithParameter => templateWithParameter.model))
        },
        ToCreateModels: {
            ...state?.ToCreateModels,
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


export const constructCreateActionInstanceRequest = (state: ExecuteActionContextState, parentProviderInstanceId?: string) => {
    const {ActionDefinition, ActionParameterDefinitions, SelectedProviderInstance} = state.ExistingModels
    const {ActionInstance, ActionParameterInstances} = state.ToCreateModels
    const tableParameterId: string|undefined = ActionParameterDefinitions?.find(apd => apd?.Tag===ActionParameterDefinitionTag.TABLE_NAME || apd?.Tag===ActionParameterDefinitionTag.DATA)?.Id
    const getProviderInstanceId: () => string|undefined = () => {
        const providerInstanceId = ActionParameterInstances.find(api => api.ActionParameterDefinitionId===tableParameterId)?.ProviderInstanceId
        if(!providerInstanceId) {
            if(!!parentProviderInstanceId) {
                return parentProviderInstanceId
            }
            if(SelectedProviderInstance !== undefined){
                return SelectedProviderInstance.Id
            }
        }
        return providerInstanceId
    }

    const getPostProcessedProviderInstanceId = (parameterInstances: ActionParameterInstance[]) => {
        return parameterInstances.find(pi => !!pi.ProviderInstanceId)?.ProviderInstanceId || getProviderInstanceId()
    }

    const getConfig = (state: ExecuteActionContextState) => {
        return JSON.stringify({
            PostProcessingSteps: (state.postProcessingActions || []).map(aiWithPi => ({
                ...aiWithPi,
                model: {
                    ...aiWithPi.model,
                    ProviderInstanceId: getPostProcessedProviderInstanceId(aiWithPi.ParameterInstances || [])
                }
            }))
        })
    }
    

    const actionInstance: ActionInstance = {
        ...ActionInstance,
        Id: uuidv4(),
        Name: ActionDefinition.DisplayName,
        DisplayName: ActionDefinition.DisplayName,
        DefinitionId: ActionDefinition?.Id,
        TemplateId: ActionDefinition?.DefaultActionTemplateId,
        ProviderInstanceId: getProviderInstanceId(),
        ActionType: ActionDefinition?.ActionType,
        CreatedBy: userSettingsSingleton.userEmail,
        ResultTableName: ActionDefinition.DisplayName + uuidv4(),
        ResultSchemaName: WriteBackSchemaNames.DF_TEMP_SCHEMA,
        Config: getConfig(state)
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