import React from "react"
import { v4 as uuidv4 } from 'uuid'


export type WorkflowActionDefinition = {
    Id: string,
    ActionGroup: string,
    DisplayName: string,
    DefaultTemplateId: string,
    Parameters: {
        Id: string,
        DefaultParameterValue: string,
        SourceExecutionId: string
    }[]
}

export type WorkflowContextType = {
    stages: {
        Id: string, 
        Name: string,
        Actions: WorkflowActionDefinition[]
    }[]
}

// const defaultWorkflowContext: WorkflowContextType = {
//     stages: [
//         {
//             Id: uuidv4(),
//             Name: "Stage 1",
//             Actions: []
//         }
//     ]
// }


const defaultWorkflowContext: WorkflowContextType = {
    "stages": [
        {
            Id: 'stage1',
            Name: 'Example Stage',
            Actions: [
                {
                    Id: 'actionId1',
                    ActionGroup: 'Data Cleansing',
                    DisplayName: 'My action 11',
                    DefaultTemplateId: 'template',
                    Parameters: []
                },
                {
                    Id: 'actionId2',
                    ActionGroup: 'Data Cleansing',
                    DisplayName: 'My action 2',
                    DefaultTemplateId: 'template',
                    Parameters: []   
                }
            ]
        }
    ]
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


export type WorkflowAction = AddActionToWorfklowType | DeleteActionFromWorkflowType | ReorderActionInWorkflowType

export type SetWorkflowContextType = (action: WorkflowAction) => void

export const SetWorkflowContext = React.createContext<SetWorkflowContextType>(
    (action: WorkflowAction) => {}
)


const reducer = (state: WorkflowContextType, action: WorkflowAction) => {
    // add logic here
    switch(action.type){
        case 'ADD_ACTION': 
            const actionsStage = state.stages.filter(stage => stage.Id === action.payload.stageId)
            if(actionsStage?.length > 0) {
                const newStage = {...actionsStage[0]}
                newStage.Actions.push(action.payload.Action)
                return {...state, ...newStage}
            }
            return {...state}
        
        case 'DELETE_ACTION':
            const actionStage = state.stages.filter(stage => stage.Id === action.payload.stageId)
            if(actionStage?.length > 0) {
                var currentStage = {...actionStage[0]}
                const newActions = currentStage.Actions.filter((actionDefinition, index) => (actionDefinition.Id !== action.payload.actionId || index !== action.payload.actionIndex))
                currentStage.Actions = [...newActions]
                const newStateStages = state.stages.map(stage => {
                    if(stage.Id === currentStage.Id) {
                        return currentStage
                    } else {
                        return stage
                    }
                })
                return {...state, stages: [...newStateStages]}
            }
            return {...state}

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
                return {...state, stages: [...newStateStages]}
            }
    }
    return {...state, ...action.payload}
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