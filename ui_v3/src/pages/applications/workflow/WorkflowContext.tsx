import React from "react"
import { v4 as uuidv4 } from 'uuid'
import { NumberFormat } from "xlsx/types";
import { userSettingsSingleton } from "../../../data_manager/userSettingsSingleton";
import { ActionParameterDefinition, ActionParameterInstance, ActionTemplate } from "../../../generated/entities/Entities";
import { ActionInstanceWithParameters } from "../../../generated/interfaces/Interfaces";

const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

export type UpstreamAction = {stageId: string, stageName: string, actionName: string, actionId: string, actionIndex: number}

export type WorkflowActionDefinition = {
    Id: string,
    ActionGroup: string,
    DisplayName: string,
    DefaultActionTemplateId: string,
    Parameters: {
        ActionParameterDefinitionId: string,
        ParameterValue?: string,
        SourceExecutionId?: UpstreamAction,
        TableId?: string,
        ColumnId?: string,
        userInputRequired?: "Yes" | "No",
        GlobalParameterId?: string,
        ParameterName?: string
    }[],
    TemplateId?: string,
    DefinitionId?: string,
    Name?: string,
    ExecutionStatus?: string,
    ExecutionStartedOn?: number,
    ExecutionCompletedOn?: number,
    PresentationFormat?: string
}

export type WorkflowContextType = {
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
    ApplicationId?: string
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
    draggingAllowed: true
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
                             SetSelectedAction


export type SetWorkflowContextType = (action: WorkflowAction) => void

export const SetWorkflowContext = React.createContext<SetWorkflowContextType>(
    (action: WorkflowAction) => {}
)


const reducer = (state: WorkflowContextType, action: WorkflowAction): WorkflowContextType => {
    // add logic here
    switch(action.type){
        case 'ADD_ACTION': 
            return {
                ...state,
                stages: state.stages.map(stage => stage.Id!==action.payload.stageId ? stage : {
                    ...stage,
                    Actions: [...stage.Actions, action.payload.Action]
                })
            }
        
        case 'DELETE_ACTION':
            return filterValidDefaultValues({
                ...state,
                stages: state.stages.map(stage => stage.Id!==action.payload.stageId ? stage : {
                    ...stage,
                    Actions: stage.Actions.filter((actionDefinition, index) => (actionDefinition.Id !== action.payload.actionId || index !== action.payload.actionIndex))
                })
            })


        case 'REORDER_ACTION': 
            console.log(state)
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
                console.log({...state, stages: [...newStateStages]})
                return filterValidDefaultValues({...state, stages: [...newStateStages]})
            } 
            return state
        
        case "ASSIGN_DEFAULT_VALUE": {
            return {
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
        }
            
        case "CLEAR_DEFAULT_VALUE": 
            return {
                ...state,
                stages: state.stages.map(stage => stage.Id!==action.payload.stageId ? stage : {
                        ...stage,
                        Actions: stage.Actions.map((actionDef, index) => (actionDef.Id !== action.payload.actionDefinitionId && action.payload.actionIndex!==index) ? actionDef : {
                            ...actionDef,
                            Parameters: actionDef.Parameters.filter(parameter => parameter.ActionParameterDefinitionId !== action.payload.actionParameterDefinitionId)
                        })
                    })
            }
        case 'SET_STAGES_IN_VIEW':
            return {...state, currentStageView: {
                startIndex: action.payload.startIndex,
                endIndex: action.payload.endIndex
            }}
        case 'ADD_STAGE':
            console.log(action)
            const newState = {...state}
            if(!!action.payload.previousStageId) {
                const stageIndex = newState.stages.findIndex(stage => stage.Id === action.payload.previousStageId)
                newState.stages.splice(stageIndex + 1, 0, action.payload)
            } else {
                newState.stages.push(action.payload)
            }
            return {...newState}

        case 'DELETE_STAGE': {
            const newStages = state.stages.filter(stage => stage.Id !== action.payload.stageId)
            return {...state, stages: [...newStages]}
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

            return {...state, stages: [...newStages]}
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
                        Actions: stage.Actions.map((actionDef, index) => (actionDef.Id !== action.payload.actionDefinitionId && index !== action.payload.actionIndex) ? actionDef: {
                            ...actionDef,
                            Parameters: [...actionDef.Parameters, {
                                ActionParameterDefinitionId: action.payload.parameterDefinitionId,
                                userInputRequired: action.payload.userInput
                            }]
                        })
                    })
                }

                return newState
            }
            const newState = {
                ...state,
                stages: state.stages.map(stage => stage.Id !== action.payload.stageId ? stage: {
                    ...stage,
                    Actions: stage.Actions.map((actionDef, index) => (actionDef.Id !== action.payload.actionDefinitionId && index !== action.payload.actionIndex) ? actionDef: {
                        ...actionDef,
                        Parameters: actionDef.Parameters.map(parameter => parameter.ActionParameterDefinitionId !== action.payload.parameterDefinitionId ? parameter : {
                            ...parameter,
                            userInputRequired: action.payload.userInput
                        })
                    })
                })
            }
            console.log(newState)
            return newState
        }

        case 'ADD_WORKFLOW_PARAMETER': {
            return {
                ...state,
                WorkflowParameters: [...state.WorkflowParameters, action.payload.parameter]
            }
        }
        
        case 'MAP_PARAMETER_TO_GLOBAL_PARAMETER': {
            return {
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
        }

        case 'ADD_ACTION_TEMPLATE': {
            return {
                ...state,
                Template: action.payload?.template
            }
        }

        case 'ADD_WORKFLOW_PARAMETERS': {
            return {
                ...state,
                WorkflowParameters: action.payload
            }
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
            return {
                ...state,
                stages: state.stages.map(stage => stage.Id !== action.payload.stageId ? stage : {
                    ...stage,
                    Percentage: action.payload.percentage
                })
            }
        }

        case 'SET_ENTIRE_CONTEXT': {
            return {...action.payload}
        }

        case 'SET_SELECTED_ACTION': {
            return {...state, currentSelectedAction: action.payload}
        }

        default:
            return state
    }
}

const filterValidDefaultValues = (state: WorkflowContextType): WorkflowContextType => {
    console.log(state)
    const x = {
        ...state,
        stages: state.stages.map(stage => { return {
            ...stage,
            Actions: stage.Actions.map((action, index) => { 
                const newActions = {
                    ...action,
                    Parameters: action.Parameters.filter(parameter => parameter?.SourceExecutionId === undefined || parameter?.SourceExecutionId?.actionId === stage.Actions?.[parameter.SourceExecutionId?.actionIndex]?.Id)
                }
                return newActions
            })
        }})
    }
    console.log(x)
    return x
}

export function findIfParameterPresent(state: WorkflowContextType, stageId: string, actionIndex: number, parameterDefinitionId: string) {
    return state.stages.filter(stage => stage.Id === stageId)[0].Actions.filter((action, index) => index === actionIndex)[0]?.Parameters.find(parameter => parameter.ActionParameterDefinitionId === parameterDefinitionId)
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


