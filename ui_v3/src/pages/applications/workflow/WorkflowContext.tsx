import React from "react";
import { v4 as uuidv4 } from 'uuid';
import { ActionParameterAdditionalConfig, ActionParameterTableAdditionalConfig } from "../../../common/components/workflow/create/ParameterInput";
import { userSettingsSingleton } from "../../../data_manager/userSettingsSingleton";
import ActionParameterDefinitionDatatype from "../../../enums/ActionParameterDefinitionDatatype";
import ActionParameterDefinitionTag from "../../../enums/ActionParameterDefinitionTag";
import { ActionParameterDefinition, ActionParameterInstance, ActionTemplate, ProviderInstance } from "../../../generated/entities/Entities";

const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

export type UpstreamAction = {stageId: string, stageName: string, actionName: string, actionId: string, actionIndex: number}

export type WorkflowActionParameters = {
    ActionParameterDefinitionId: string,
    ParameterValue?: string,
    SourceExecutionId?: UpstreamAction,
    TableId?: string,
    ColumnId?: string,
    userInputRequired?: "Yes" | "No",
    GlobalParameterId?: string,
    ParameterName?: string
}

export type WorkflowActionDefinition = {
    Id: string,
    ActionGroup: string,
    DisplayName: string,
    DefaultActionTemplateId: string,
    Parameters: WorkflowActionParameters[],
    TemplateId?: string,
    DefinitionId?: string,
    Name?: string,
    ExecutionStatus?: string,
    ExecutionStartedOn?: number,
    ExecutionCompletedOn?: number,
    PresentationFormat?: string,
    ErrorInParametersConfigured?: string[],
    ResultTableName?: string,
    ResultSchemaName?: string
}

export type WorkflowContextType = {
    mode: "EDIT" | "EXECUTING" | "EXECUTE"
    stages: {
        Id: string, 
        Name: string,
        Actions: WorkflowActionDefinition[],
        Percentage?: number
    }[]
    currentStageView?: {
        startIndex: number
        endIndex: number
    }
    WorkflowParameterInstance?: ActionParameterInstance[]
    WorkflowParameters: ActionParameterDefinition[]
    WorkflowParameterAdditionalConfigs?: ActionParameterAdditionalConfig[]
    currentSelectedStage?: string,
    currentSelectedAction?: {actionId: string, actionIndex: number}
    Name: string,
    Description: string,
    Author: string,
    Template?: ActionTemplate,
    WorkflowExecutionStatus?: string,
    draggingAllowed?: boolean,
    actionExecutionIdForPreview?: {
        executionId?: string,
        presentationFormat?: string
    },
    ApplicationId?: string,
    sideDrawerState?: {open: boolean},
    PinnedToDashboard?: boolean,
    ActionGroup?: string,
    PublishStatus?: string,
    UpdatedOn?: number,
    CreatedOn?: number,
    ErrorState?: boolean,
    LatestActionAdded?: {
        actionId: string,
        stageId: string,
        actionIndex: number
    },
    WorkflowExecutionStartedOn?: number,
    WorkflowExecutionCompletedOn?: number,
    SelectedProviderInstance?: ProviderInstance
}

const defaultWorkflowContext: WorkflowContextType = {
    stages: [
        {
            Id: uuidv4(),
            Name: "Enter Stage Name Here",
            Actions: []
        }
    ],
    WorkflowParameters: [],
    Name: "",
    Description: "",
    Author: userSettingsSingleton.userEmail,
    draggingAllowed: true,
    mode: "EDIT"
}

export const WorkflowContext = React.createContext<WorkflowContextType>(defaultWorkflowContext) 

export type WorkflowContextCbType = (oldContext: WorkflowContextType) => WorkflowContextType

type AddActionPayloadType = {
    stageId: string,
    Action: WorkflowActionDefinition
}

type DeleteActionPayloadType = {
    stageId: string,
    actionId: string,
    actionIndex: number
}

type ReorderActionPayloadType = {
    stageId: string,
    newActions: WorkflowActionDefinition[]
}

type SetStagesInViewPayload = {
    startIndex: number,
    endIndex: number
}

type AddStagePayloadType = {
    Id: string
    Name: string,
    Actions: WorkflowActionDefinition[],
    previousStageId?: string
}

type StageNameChangePayloadType = {
    stageId: string,
    Name: string
}

type DeleteStagePayloadType = {
    stageId: string
}

type AssignParameterDefaultValuePayload = {
    stageId: string,
    actionDefinitionId: string,
    actionIndex: number,
    actionParameterDefinitionId: string,
    sourceExecutionId?: UpstreamAction,
    parameterValue?: string
}

type ClearParameterDefaultValuePayload = {
    stageId: string,
    actionDefinitionId: string,
    actionIndex: number,
    actionParameterDefinitionId: string,
}

type ChangeCurrentSelectedStagePayload = {
    stageId?: string
}

type ChangeNamePayload = {
    newName: string
}

type ChangeDescriptionPayload = {
    newDescription: string
}

type WorkflowNameDescriptionPayload = {
    actionName: string,
    description: string
}

type ChangeUserInputRequiredPayload = {
    userInput: "Yes" | "No",
    parameterDefinitionId: string,
    actionDefinitionId: string,
    actionIndex: number,
    stageId: string
}

type AddWorkflowParameterPayload = {
    parameter: ActionParameterDefinition
}

type MapParameterToGloabalParameterPayload = {
    parameterDefinitionId: string,
    stageId: string,
    actionIndex: number,
    globalParameterId: string,
    parameterName: string
}

type AddActionTemplatePayload = {
    template?: ActionTemplate
}

type ChangeWorkflowParameterInstances = {
    parameterInstances: ActionParameterInstance[]
}

type ChangeWorkflowExecutionStatus = {
    status: string
}

type UpdateActionStatus = {
    stageId: string,
    actionId: string,
    actionIndex: number,
    newStatus: string,
    ExecutionCompletedOn?: number,
    ExecutionStartedOn?: number
}

type AddActionToWorfklowType = {
    type: 'ADD_ACTION',
    payload: AddActionPayloadType
}

type DeleteActionFromWorkflowType = {
    type: 'DELETE_ACTION',
    payload: DeleteActionPayloadType
}

type ReorderActionInWorkflowType = {
    type: 'REORDER_ACTION',
    payload: ReorderActionPayloadType
}

type SetStagesInViewType = {
    type: 'SET_STAGES_IN_VIEW',
    payload: SetStagesInViewPayload
}

type AddStageActionType = {
    type: 'ADD_STAGE',
    payload: AddStagePayloadType
}

type DeleteStageActionType = {
    type: 'DELETE_STAGE',
    payload: DeleteStagePayloadType
}

type StageNameChangeActionType = {
    type: 'STAGE_NAME_CHANGE',
    payload: StageNameChangePayloadType
}

type AssignDefaultValueToParameterOfActionInWorkflowType = {
    type: 'ASSIGN_DEFAULT_VALUE',
    payload: AssignParameterDefaultValuePayload
}

type ClearDefaultValueToParameterOfActionInWorkflowType = {
    type: 'CLEAR_DEFAULT_VALUE',
    payload: ClearParameterDefaultValuePayload
}

type ChangeCurrentSelectedStageActionType = {
    type: 'CHANGE_CURRENT_SELECTED_STAGE',
    payload: ChangeCurrentSelectedStagePayload
}

type ChangeNameActionType = {
    type: 'CHANGE_NAME',
    payload: ChangeNamePayload
}

type ChangeDescriptioneActionType = {
    type: 'CHANGE_DESCRIPTION',
    payload: ChangeDescriptionPayload
}

type WorkflowNameAndDescriptionActionType = {
    type: 'SET_WORKFLOW_DETAILS',
    payload: WorkflowNameDescriptionPayload
}

type ChangeUserInputRequiredActionType = {
    type: 'CHANGE_USER_INPUT_REQUIRED',
    payload: ChangeUserInputRequiredPayload
}

type AddWorkflowParameterActionType = {
    type: 'ADD_WORKFLOW_PARAMETER',
    payload: AddWorkflowParameterPayload
}

type MapParameterToGlobalParameterActionType = {
    type: 'MAP_PARAMETER_TO_GLOBAL_PARAMETER',
    payload: MapParameterToGloabalParameterPayload
}

type AddActionTemplateActionType = {
    type: 'ADD_ACTION_TEMPLATE',
    payload: AddActionTemplatePayload
}

type AddAllWorkflowParametersActionType = {
    type: 'ADD_WORKFLOW_PARAMETERS',
    payload: ActionParameterDefinition[]
}

type ChangeWorkflowParameterInstancesActionType = {
    type: 'CHANGE_WORKFLOW_PARAMETER_INSTANCES',
    payload: ChangeWorkflowParameterInstances
}

type ChangeExecutionStatusActionType = {
    type: 'CHANGE_EXECUTION_STATUS',
    payload: ChangeWorkflowExecutionStatus
}

type UpdateChildActionStatusType = {
    type: 'UPDATE_CHILD_STATUS',
    payload: UpdateActionStatus
}

type SetDraggableActionType = {
    type: 'SET_DRAGGABLE_PROPERTY',
    payload: boolean
}

type SetActionExecutionForPreview = {
    type: 'SET_EXECUTION_FOR_PREVIEW',
    payload?: {executionId?: string, presentationFormat?: string}
}

type SetApplicationId = {
    type: 'SET_APPLICATION_ID',
    payload?: string
}

type ChangeStagePercentage = {
    type: 'CHANGE_STAGE_PERCENTAGE',
    payload: {
        stageId: string,
        percentage: number
    }
}

type SetEntireContext = {
    type: 'SET_ENTIRE_CONTEXT',
    payload: WorkflowContextType
}

type SetSelectedAction = {
    type: 'SET_SELECTED_ACTION',
    payload: {
        actionId: string,
        actionIndex: number
    }
}

type SetSideDrawerState = {
    type: 'SET_SIDE_DRAWER_STATE',
    payload: {
        open: boolean
    }
}

type SetPinnedToDashboard = {
    type: 'SET_PINNED_TO_DASHBOAD',
    payload?: boolean
}

type SetPublishedStatus = {
    type: 'SET_PUBLISHED_STATUS',
    payload?: string
}

type SetActionGroup = {
    type: 'SET_ACTION_GROUP',
    payload?: string
}

type DeleteGlobalParameter = {
    type: 'DELETE_GLOBAL_PARAMETER',
    payload: {
        parameterId: string
    }
}

type SetErrorState = {
    type: 'SET_ERROR_STATE',
    payload: boolean
}

type ValidateState = {
    type: 'VALIDATE',
    payload: WorkflowContextType
}

type SetLatestActionAdded = {
    type: 'SET_LATEST_ACTION_ADDED',
    payload: {
        stageId: string,
        actionId: string,
        actionIndex: number
    }
}

type ChangeActionName = {
    type: 'CHANGE_ACTION_NAME',
    payload: {
        actionId: string,
        actionIndex: number,
        stageId: string,
        newName: string
    }
}

type SetWorkflowExecutionStartedOn = {
    type: 'SET_WORKFLOW_EXECUTION_STARTED_ON',
    payload: number
}

type SetWorkflowExecutionCompleted = {
    type: 'SET_WORKFLOW_EXECUTION_COMPLETED_ON',
    payload: number
}

type SetSelectedProviderInstance = {
    type: "SET_SELECTED_PROVIDER_INSTANCE",
    payload: {
        newProviderInstance?: ProviderInstance
    }
}

type SetWorkflowParameterAdditionalConfig = {
    type: "SET_WORKFLOW_PARAMETER_ADDITIONAL_CONFIG",
    payload: {
        parameterAdditionalConfig: ActionParameterAdditionalConfig
    }
}

type SetWorkflowGlobalParameter = {
    type: "SetWorkflowGlobalParameter",
    payload: {
        newParamConfig: ActionParameterDefinition
    }
}
type SetMode = {
    type: 'SET_MODE',
    payload: "EDIT" | "EXECUTING" | "EXECUTE"
}

type GoToNextStage = {
    type: 'GO_TO_NEXT_STAGE',
    payload: {}
}

type GoToPreviousStage = {
    type: 'GO_TO_PREV_STAGE',
    payload: {}
}

export type WorkflowAction = AddActionToWorfklowType | 
                             DeleteActionFromWorkflowType |
                             ReorderActionInWorkflowType |
                             SetStagesInViewType |
                             AddStageActionType |
                             DeleteStageActionType |
                             StageNameChangeActionType |
                             AssignDefaultValueToParameterOfActionInWorkflowType |
                             ClearDefaultValueToParameterOfActionInWorkflowType |
                             ChangeCurrentSelectedStageActionType |
                             ChangeNameActionType |
                             ChangeDescriptioneActionType |
                             WorkflowNameAndDescriptionActionType |
                             ChangeUserInputRequiredActionType | 
                             AddWorkflowParameterActionType |
                             MapParameterToGlobalParameterActionType |
                             AddActionTemplateActionType |
                             AddAllWorkflowParametersActionType |
                             ChangeWorkflowParameterInstancesActionType |
                             ChangeExecutionStatusActionType |
                             UpdateChildActionStatusType |
                             SetDraggableActionType |
                             SetActionExecutionForPreview |
                             SetApplicationId |
                             ChangeStagePercentage |
                             SetEntireContext |
                             SetSelectedAction |
                             SetSideDrawerState |
                             SetPinnedToDashboard |
                             SetPublishedStatus | 
                             SetActionGroup |
                             DeleteGlobalParameter |
                             SetErrorState |
                             ValidateState |
                             SetLatestActionAdded |
                             ChangeActionName |
                             SetWorkflowExecutionStartedOn |
                             SetWorkflowExecutionCompleted |
                             SetSelectedProviderInstance |
                             SetWorkflowParameterAdditionalConfig |
                             SetWorkflowGlobalParameter |
                             SetMode |
                             GoToNextStage | 
                             GoToPreviousStage


export type SetWorkflowContextType = (action: WorkflowAction) => void

export const SetWorkflowContext = React.createContext<SetWorkflowContextType>(
    (action: WorkflowAction) => {}
)


const reducer = (state: WorkflowContextType, action: WorkflowAction): WorkflowContextType => {
    // add logic here
    switch(action.type){
        case 'ADD_ACTION': {
            const newState = {
                ...state,
                stages: state.stages.map(stage => stage.Id!==action.payload.stageId ? stage : {
                    ...stage,
                    Actions: [...stage.Actions, action.payload.Action]
                })
            }
            return reducer(reducer(newState, {type: 'VALIDATE', payload: newState}), {type: 'SET_LATEST_ACTION_ADDED', payload: {
                actionId: action.payload.Action.Id,
                stageId: action.payload.stageId,
                actionIndex: state.stages.find(stage => stage.Id === action.payload.stageId)?.Actions?.length || 0
            }})
        }
        
        case 'DELETE_ACTION': {
            const newState = filterValidDefaultValues({
                ...state,
                stages: state.stages.map(stage => stage.Id!==action.payload.stageId ? stage : {
                    ...stage,
                    Actions: stage.Actions.filter((actionDefinition, index) => (actionDefinition.Id !== action.payload.actionId || index !== action.payload.actionIndex))
                })
            })

            return reducer(newState, {type: 'VALIDATE', payload: newState})
        }

        case 'REORDER_ACTION': 
            const filteredStage = state.stages.filter(stage => stage.Id === action.payload.stageId)
            if(filteredStage?.length > 0) {
                var currentStage = {...filteredStage[0]}
                currentStage.Actions = [...action.payload.newActions]
                const newStateStages = state.stages.map(stage => {
                    if(stage.Id === currentStage.Id) {
                        return currentStage
                    } else {
                        return stage
                    }
                })
                const newState = filterValidDefaultValues({...state, stages: [...newStateStages]})
                return reducer(newState, {type: 'VALIDATE', payload: newState})
            } 
            return state
        
        case "ASSIGN_DEFAULT_VALUE": {
            const newState: WorkflowContextType = {
                ...state,
                stages: state.stages.map(stage => stage.Id!==action.payload.stageId ? stage : {
                        ...stage,
                        Actions: stage.Actions.map((actionDef, index) => !(actionDef.Id === action.payload.actionDefinitionId && action.payload.actionIndex===index) ? actionDef : {
                            ...actionDef,
                            Parameters: actionDef.Parameters.find(parameter => parameter.ActionParameterDefinitionId === action.payload.actionParameterDefinitionId) ?
                                actionDef.Parameters.map(parameter => parameter.ActionParameterDefinitionId !== action.payload.actionParameterDefinitionId ? parameter : {
                                    ...parameter,
                                    SourceExecutionId: action.payload.sourceExecutionId,
                                    ParameterValue: action.payload.parameterValue
                                })
                                :
                                [...actionDef.Parameters, {
                                    ActionParameterDefinitionId: action.payload.actionParameterDefinitionId,
                                    SourceExecutionId: action.payload.sourceExecutionId,
                                    ParameterValue: action.payload.parameterValue,
                                    userInputRequired: "No"
                                }]
                        })
                    })
            }
            return reducer(newState, {type: 'VALIDATE', payload: newState})
        }
            
        case "CLEAR_DEFAULT_VALUE": {
            const newState = {
                ...state,
                stages: state.stages.map(stage => stage.Id!==action.payload.stageId ? stage : {
                        ...stage,
                        Actions: stage.Actions.map((actionDef, index) => (actionDef.Id !== action.payload.actionDefinitionId && action.payload.actionIndex!==index) ? actionDef : {
                            ...actionDef,
                            Parameters: actionDef.Parameters.filter(parameter => parameter.ActionParameterDefinitionId !== action.payload.actionParameterDefinitionId)
                        })
                    })
            }
            return reducer(newState, {type: 'VALIDATE', payload: newState})
        }
        case 'SET_STAGES_IN_VIEW': {
            const newState = {...state, currentStageView: {
                startIndex: action.payload.startIndex,
                endIndex: action.payload.endIndex
            }}

            return reducer(newState, {type: 'VALIDATE', payload: newState})
        }
        case 'ADD_STAGE':
            const newState = {...state}
            if(!!action.payload.previousStageId) {
                const stageIndex = newState.stages.findIndex(stage => stage.Id === action.payload.previousStageId)
                newState.stages.splice(stageIndex + 1, 0, action.payload)
            } else {
                newState.stages.push(action.payload)
            }
            return reducer(newState, {type: 'VALIDATE', payload: newState})

        case 'DELETE_STAGE': {
            const newStages = state.stages.filter(stage => stage.Id !== action.payload.stageId)
            const newState = {...state, stages: [...newStages]}
            return reducer(newState, {type: 'VALIDATE', payload: newState})
        }
        case 'STAGE_NAME_CHANGE': {
            const newStages = state.stages.map(stage => {
                if(stage.Id === action.payload.stageId) {
                    return {...stage, Name: action.payload.Name}
                }
                else {
                    return stage
                }
            })

            const newState = {...state, stages: [...newStages]}
            return reducer(newState, {type: 'VALIDATE', payload: newState})
        }
        case 'CHANGE_CURRENT_SELECTED_STAGE': {
            return {...state, currentSelectedStage: action.payload.stageId}
        }
        
        case "CHANGE_NAME": {
            return {
                ...state,
                Name: action.payload.newName
            }
        }

        case "CHANGE_DESCRIPTION": {
            return {
                ...state,
                Description: action.payload.newDescription
            }
        }

        case 'SET_WORKFLOW_DETAILS': {
            return {
                ...state, Name: action.payload.actionName, Description: action.payload.description
            }
        }

        case 'CHANGE_USER_INPUT_REQUIRED': {
            const isParameterPresent = findIfParameterPresent(state, action.payload.stageId, action.payload.actionIndex, action.payload.parameterDefinitionId)
            if(isParameterPresent === undefined) {
                const newState = {
                    ...state,
                    stages: state.stages.map(stage => stage.Id !== action.payload.stageId ? stage: {
                        ...stage,
                        Actions: stage.Actions.map((actionDef, index) => (index !== action.payload.actionIndex) ? actionDef: {
                            ...actionDef,
                            Parameters: [...actionDef.Parameters, {
                                ActionParameterDefinitionId: action.payload.parameterDefinitionId,
                                userInputRequired: action.payload.userInput
                            }]
                        })
                    })
                }

                return reducer(newState, {type: 'VALIDATE', payload: newState})
            }
            const newState = {
                ...state,
                stages: state.stages.map(stage => stage.Id !== action.payload.stageId ? stage: {
                    ...stage,
                    Actions: stage.Actions.map((actionDef, index) => (index !== action.payload.actionIndex) ? actionDef: {
                        ...actionDef,
                        Parameters: actionDef.Parameters.map(parameter => parameter.ActionParameterDefinitionId !== action.payload.parameterDefinitionId ? parameter : {
                            ...parameter,
                            userInputRequired: action.payload.userInput,
                            SourceExecutionId: action.payload.userInput === "No" ? undefined : parameter.SourceExecutionId
                        })
                    })
                })
            }
            return reducer(newState, {type: 'VALIDATE', payload: newState})
        }

        case 'ADD_WORKFLOW_PARAMETER': {
            const newState = {
                ...state,
                WorkflowParameters: [...state.WorkflowParameters, action.payload.parameter]
            }
            return reducer(newState, {type: 'VALIDATE', payload: newState})
        }
        
        case 'MAP_PARAMETER_TO_GLOBAL_PARAMETER': {
            const newState = {
                ...state,
                stages: state.stages.map(stage => stage.Id !== action.payload.stageId ? stage: {
                    ...stage,
                    Actions: stage.Actions.map((actionDef, index) => (index !== action.payload.actionIndex) ? actionDef: {
                        ...actionDef,
                        Parameters: actionDef.Parameters.map(parameter => parameter.ActionParameterDefinitionId !== action.payload.parameterDefinitionId ? parameter : {
                            ...parameter,
                            GlobalParameterId: action.payload.globalParameterId,
                            ParameterName: action.payload.parameterName
                        })
                    })
                })
            }
            return reducer(newState, {type: 'VALIDATE', payload: newState})
        }

        case 'ADD_ACTION_TEMPLATE': {
            return {
                ...state,
                Template: action.payload?.template
            }
        }

        case 'ADD_WORKFLOW_PARAMETERS': {
            const newState = {
                ...state,
                WorkflowParameters: action.payload
            }
            return reducer(newState, {type: 'VALIDATE', payload: newState})
        }

        case 'CHANGE_WORKFLOW_PARAMETER_INSTANCES': {
            return {
                ...state,
                WorkflowParameterInstance: action.payload.parameterInstances
            }
        }

        case 'CHANGE_EXECUTION_STATUS': {
            return {
                ...state,
                WorkflowExecutionStatus: action.payload.status
            }
        }

        case 'UPDATE_CHILD_STATUS': {
            return {
                ...state,
                stages: state.stages.map(stage => stage.Id !== action.payload.stageId ? stage : {
                    ...stage,
                    Actions: stage.Actions.map((stageAction, index) => (index !== action.payload.actionIndex || stageAction.Id !== action.payload.actionId) ? stageAction: {
                        ...stageAction,
                        ExecutionStatus: action.payload.newStatus,
                        ExecutionCompletedOn: action.payload.ExecutionCompletedOn,
                        ExecutionStartedOn: action.payload.ExecutionStartedOn
                    } ) 
                })
            }
        }

        case 'SET_DRAGGABLE_PROPERTY': {
            return {
                ...state,
                draggingAllowed: action.payload
            }
        }

        case 'SET_EXECUTION_FOR_PREVIEW': {
            return {
                ...state,
                actionExecutionIdForPreview: action.payload
            }
        }

        case 'SET_APPLICATION_ID': {
            return {
                ...state,
                ApplicationId: action.payload
            }
        }

        case 'CHANGE_STAGE_PERCENTAGE': {
            const cp = state.currentStageView
            const stageView = action.payload.percentage !== 100 ? state.currentStageView : state.stages.findIndex(stage => stage.Id === action.payload.stageId) === ((state.currentStageView?.endIndex || 4) - 1) ? {
                startIndex: cp?.endIndex === state.stages.length ? cp.startIndex || 0 : (cp?.startIndex|| 0) + 1,
                endIndex: cp?.endIndex === state.stages.length ? cp.endIndex || state.stages.length : (cp?.endIndex || 4)    + 1
            } : state.currentStageView
            return {
                ...state,
                stages: state.stages.map(stage => stage.Id !== action.payload.stageId ? stage : {
                    ...stage,
                    Percentage: action.payload.percentage
                }),
                currentStageView: stageView
            }
        }

        case 'SET_ENTIRE_CONTEXT': {
            const newState = {...action.payload}
            return reducer(newState, {type: 'VALIDATE', payload: newState})
        }

        case 'SET_SELECTED_ACTION': {
            return {...state, currentSelectedAction: action.payload}
        }

        case 'SET_SIDE_DRAWER_STATE': {
            return {...state, sideDrawerState: action.payload}
        }

        case 'SET_PINNED_TO_DASHBOAD': {
            return {...state, PinnedToDashboard: action.payload}
        }

        case 'SET_PUBLISHED_STATUS': {
            return {...state, PublishStatus: action.payload}
        }

        case 'SET_ACTION_GROUP': {
            return {...state, ActionGroup: action.payload}
        }
        
        case 'DELETE_GLOBAL_PARAMETER': {
            const newState: WorkflowContextType = {
                ...state,
                WorkflowParameters: state.WorkflowParameters.filter(parameter => parameter.Id !== action.payload.parameterId),
                stages: state.stages.map(stage => ({
                    ...stage,
                    Actions: stage.Actions.map(stageAction => ({
                        ...stageAction,
                        Parameters: stageAction.Parameters.map((parameter) => {
                            if(parameter.GlobalParameterId === action.payload.parameterId) {
                                return {
                                    ...parameter,
                                    GlobalParameterId: undefined,
                                    userInputRequired: "No"
                                }
                            } else {
                                return parameter
                            }
                        })
                    }))
                }))
            }
            return reducer(newState, {type: 'VALIDATE', payload: newState})
        }

        case 'SET_ERROR_STATE': {
            return {
                ...state,
                ErrorState: action.payload
            }
        }

        case 'VALIDATE': {
            const errorMessages = extractErrorMessages(action.payload)
            console.log(errorMessages)
            const newState: WorkflowContextType = {
                ...state,
                stages: state.stages.map(stage => {
                    return {
                        ...stage,
                        Actions: stage.Actions.map((action, index) => {
                            const errorMessagesForAction = errorMessages.filter(message => message.stageId === stage.Id && message.actionIndex === index)
                            return {
                                ...action,
                                ErrorInParametersConfigured: errorMessagesForAction?.map(message => message.message)
                            }
                        })
                    }
                })
            }

            return newState
        }

        case 'SET_LATEST_ACTION_ADDED': {
            return {
                ...state,
                LatestActionAdded: action.payload
            }
        }

        case 'CHANGE_ACTION_NAME': {
            return {
                ...state,
                stages: state.stages.map(stage => stage.Id !== action.payload.stageId ? stage : {
                    ...stage,
                    Actions: stage.Actions.map((stageAction, index) => index !== action.payload.actionIndex ? stageAction : {
                        ...stageAction,
                        DisplayName: action.payload.newName
                    })
                })
            }
        }

        case 'SET_WORKFLOW_EXECUTION_STARTED_ON': {
            return {
                ...state,
                WorkflowExecutionStartedOn: action.payload
            }
        }

        case 'SET_WORKFLOW_EXECUTION_COMPLETED_ON': {
            return {
                ...state,
                WorkflowExecutionCompletedOn: action.payload
            }
        }

        case "SET_SELECTED_PROVIDER_INSTANCE": {
            const newParamAddConfs: ActionParameterTableAdditionalConfig[] = state.WorkflowParameters.filter(param => param.Tag===ActionParameterDefinitionTag.TABLE_NAME || param.Datatype===ActionParameterDefinitionDatatype.PANDAS_DATAFRAME
                ).map(param => ({
                    parameterDefinitionId: param.Id,
                    availableTablesFilter: [{
                        ProviderInstanceID: action.payload?.newProviderInstance?.Id
                    }]
                } as ActionParameterTableAdditionalConfig))
                
            const finalState = newParamAddConfs.reduce((prevValue, currValue) => reducer(prevValue, { type: "SET_WORKFLOW_PARAMETER_ADDITIONAL_CONFIG", payload: { parameterAdditionalConfig: currValue }}), state)
            
            return {
                ...finalState,
                SelectedProviderInstance: action.payload.newProviderInstance
            }
        }

        case "SET_WORKFLOW_PARAMETER_ADDITIONAL_CONFIG": {
            const filtered = (state.WorkflowParameterAdditionalConfigs || []).filter(addConf => addConf?.parameterDefinitionId !== action?.payload?.parameterAdditionalConfig?.parameterDefinitionId)
            const newParamAddConfs = [...filtered, action.payload.parameterAdditionalConfig]

            return {
                ...state,
                WorkflowParameterAdditionalConfigs: newParamAddConfs
            }
        }
        
        case "SetWorkflowGlobalParameter": {
            return {
                ...state,
                WorkflowParameters: state.WorkflowParameters.map(ap => ap.Id!==action.payload.newParamConfig.Id ? ap : ({...ap, ...action.payload.newParamConfig}))
            }
        }
        
        case 'SET_MODE': {
            return {
                ...state,
                mode: action.payload
            }
        }

        case 'GO_TO_NEXT_STAGE': {
            const currentIndex = state.stages.findIndex(stage => stage.Id === state.currentSelectedStage)
            const newStage = state.stages[(currentIndex || 0) + 1]

            return {
                ...state,
                currentSelectedStage: newStage?.Id
            }
        }

        case 'GO_TO_PREV_STAGE': {
            const currentIndex = state.stages.findIndex(stage => stage.Id === state.currentSelectedStage)
            const newStage = state.stages[(currentIndex || 1) - 1]

            return {
                ...state,
                currentSelectedStage: newStage?.Id
            }
        }

        default:
            return state
    }
}

const findAction = (stageId: string, actionIndex: number, actionId: string, workflowContext: WorkflowContextType) => {
    var found = false
    workflowContext.stages.forEach(stage => {
        if(stage.Id === stageId) {
            console.log(stage.Actions)
            console.log(actionIndex, actionId)
            found = stage.Actions?.[actionIndex]?.Id === actionId
            return
        }
    })

    return found
}

const filterValidDefaultValues = (state: WorkflowContextType): WorkflowContextType => {
    const x = {
        ...state,
        stages: state.stages.map(stage => { return {
            ...stage,
            Actions: stage.Actions.map((action, index) => { 
                const newActions = {
                    ...action,
                    Parameters: action.Parameters.map(parameter => parameter?.SourceExecutionId === undefined || findAction(parameter?.SourceExecutionId?.stageId || "stage", parameter?.SourceExecutionId?.actionIndex || 0, parameter?.SourceExecutionId?.actionId || "actionId", state) ? parameter : {
                        ...parameter,
                        SourceExecutionId: undefined
                    })
                }
                return newActions
            })
        }})
    }
    return x
}

function extractErrorMessages(state: WorkflowContextType) {
    const errorMessages: {actionIndex: number, stageId: string, message: string}[] = []

    state.stages.forEach(stage => {
        stage.Actions.forEach((action, actionIndex) => {
            action?.Parameters?.forEach((parameter, index) => {
                if(parameter.userInputRequired === "No") {
                    if(parameter.ParameterValue === undefined && parameter.SourceExecutionId === undefined) {
                        const errorMessage = `${parameter.ParameterName} in Action ${action.DisplayName} of Stage ${stage.Name} does not have default value`
                        errorMessages.push(
                            {
                                stageId: stage.Id,
                                actionIndex: actionIndex,
                                message: errorMessage
                            }
                        )
                    }
                } else if(parameter.userInputRequired === "Yes") {
                    if(parameter.GlobalParameterId === undefined) {
                        const errorMessage = `${parameter.ParameterName} in Action ${action.DisplayName} of Stage ${stage.Name} does not have associated Global Parameter`
                        errorMessages.push(
                            {
                                stageId: stage.Id,
                                actionIndex: actionIndex,
                                message: errorMessage
                            }
                        )
                    }
                }
            })
        })
    })

    return errorMessages
}

export function findIfParameterPresent(state: WorkflowContextType, stageId: string, actionIndex: number, parameterDefinitionId: string) {
    return state.stages.filter(stage => stage.Id === stageId)?.[0]?.Actions?.filter((action, index) => index === actionIndex)?.[0]?.Parameters?.find(parameter => parameter?.ActionParameterDefinitionId === parameterDefinitionId)
}

export const WorkflowContextProvider = ({children}: {children: React.ReactElement}) => {
    const [contextState, dispatch] = React.useReducer(reducer, defaultWorkflowContext)

    const setContextState: SetWorkflowContextType = ( args: WorkflowAction) => {
        dispatch({...args})
    }

    return (
        <WorkflowContext.Provider value={contextState}>
            <SetWorkflowContext.Provider value={setContextState}>
                {children}
            </SetWorkflowContext.Provider>
        </WorkflowContext.Provider>
    )
}


