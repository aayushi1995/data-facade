import React from "react"
import { v4 as uuidv4 } from 'uuid'
import { userSettingsSingleton } from "../../../data_manager/userSettingsSingleton";

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
        ColumnId?: string
    }[]
}

export type WorkflowContextType = {
    stages: {
        Id: string, 
        Name: string,
        Actions: WorkflowActionDefinition[]
    }[]
    currentStageView?: {
        startIndex: number
        endIndex: number
    }
    currentSelectedStage?: string,
    Name: string,
    Description: string,
    Author: string
}

const defaultWorkflowContext: WorkflowContextType = {
    stages: [
        {
            Id: uuidv4(),
            Name: "Stage 1",
            Actions: [],
        }
    ],
    Name: "",
    Description: "",
    Author: userSettingsSingleton.userEmail
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
    Actions: WorkflowActionDefinition[]
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
                             WorkflowNameAndDescriptionActionType

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
                                    ParameterValue: action.payload.parameterValue
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
            const newState = {...state}
            newState.stages.push(action.payload)
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
                    Parameters: action.Parameters.filter(parameter => parameter?.SourceExecutionId === undefined || parameter?.SourceExecutionId.actionId === stage.Actions[parameter.SourceExecutionId.actionIndex].Id)
                }
                return newActions
            })
        }})
    }
    console.log(x)
    return x
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