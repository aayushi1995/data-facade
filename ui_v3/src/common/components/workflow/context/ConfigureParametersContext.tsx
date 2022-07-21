import React from "react"
import { ActionParameterDefinition, ActionTemplate, Tag } from "../../../../generated/entities/Entities"
import { ActionDetail } from "../create/ViewSelectedAction/hooks/UseViewAction"

interface ParameterWithTags {
    model: ActionParameterDefinition 
    tags: Tag[]
}

export interface ConfigureParametersContextType {
    actionData: ActionDetail,
    interractiveConfigure?: boolean,
    wizardIndex: number,
    currentParameterIndex?: number,
    parameters?: {model: ActionParameterDefinition, tags: Tag[]}[],
    workflowDetails?: {
        stageId: string,
        actionId: string,
        actionIndex: number
    },
    selectedActionTemplate?: ActionTemplate
}

export type SetParametersConfigType = (action: ConfigureParametersActions) => void

const MAX_INDEX = 1

const defaultConfigureParametersState: ConfigureParametersContextType = {
    actionData: {
        ActionDefinition: {
            model: {},
            tags: []
        },
        ActionTemplatesWithParameters: []
    },
    interractiveConfigure: true,
    wizardIndex: 1,
    parameters: [],
    currentParameterIndex: 0
}

type AddActionData = {
    type: 'ADD_ACTION_DATA',
    payload: ActionDetail
}

type SetInterractiveConfigure = {
    type: 'SET_INTERRACTIVE_CONFIGURE',
    payload: boolean
}

type SetParameters = {
    type: 'SET_PARAMETERS',
    payload: ParameterWithTags[]
}

type SetWorkflowDetails = {
    type: 'SET_WORKFLOW_DETAILS',
    payload: {
        stageId: string,
        actionId: string,
        actionIndex: number
    }
}

type NextIndex = {
    type: 'NEXT_INDEX',
    payload: {}
}

type NextParameter = {
    type: 'NEXT_PARAMETER',
    payload: {}
}

type GoBack = {
    type: 'GO_BACK',
    payload: {}
}

type SetActionTemplate = {
    type: 'SET_ACTION_TEMPLATE',
    payload: ActionTemplate
}

type SetParameterIndex = {
    type: 'SET_PARAMETER_INDEX',
    payload: number
}

export type ConfigureParametersActions = AddActionData |
                                         SetInterractiveConfigure |
                                         SetParameters |
                                         SetWorkflowDetails |
                                         NextIndex |
                                         NextParameter |
                                         GoBack |
                                         SetActionTemplate |
                                         SetParameterIndex

export const ConfigureParametersContext = React.createContext<ConfigureParametersContextType>(defaultConfigureParametersState)

export const SetParametersConfigContext = React.createContext<SetParametersConfigType>(
    (action: ConfigureParametersActions) => {}
)

const reducer = (state: ConfigureParametersContextType, action: ConfigureParametersActions): ConfigureParametersContextType => {
    switch(action.type) {
        case 'ADD_ACTION_DATA': {
            return {
                ...state,
                actionData: action.payload
            }
        }
        case 'SET_INTERRACTIVE_CONFIGURE': {
            return {
                ...state,
                interractiveConfigure: true,
                wizardIndex: 1
            }
        }
        case 'SET_PARAMETERS': {
            return {
                ...state,
                parameters: action.payload || []
            }
        }
        case 'SET_WORKFLOW_DETAILS': {
            return {
                ...state,
                workflowDetails: action.payload
            }
        }

        case 'NEXT_INDEX': {
            return {
                ...state,
                wizardIndex: state.wizardIndex + 1 <= MAX_INDEX ? state.wizardIndex + 1 : state.wizardIndex
            }
        }

        case 'NEXT_PARAMETER': {
            const currentParameter = state.currentParameterIndex || 0
            return {
                ...state,
                currentParameterIndex: currentParameter + 1
            }
        }

        case 'GO_BACK': {
            if(state.currentParameterIndex === 0) {
                return state
            } else {
                return {
                    ...state,
                    currentParameterIndex: (state?.currentParameterIndex || 1) - 1
                }
            }
        }

        case 'SET_ACTION_TEMPLATE': {
            return {
                ...state,
                selectedActionTemplate: action.payload
            }
        }

        case 'SET_PARAMETER_INDEX': {
            return {
                ...state,
                currentParameterIndex: action.payload
            }
        }

        default: {
            return state
        }
    }
}

export const ConfigureParametersContextProvider = ({children}: {children: React.ReactElement}) => {
    const [contextState, dispatch] = React.useReducer(reducer, defaultConfigureParametersState)

    const setContextState: SetParametersConfigType = ( args: ConfigureParametersActions) => {
        dispatch({...args})
    }

    React.useEffect(() => {
        const action = contextState.actionData
        const defaultActionTemplate = action.ActionTemplatesWithParameters.find(template => template.model.Id === action.ActionDefinition.model.DefaultActionTemplateId)
        const firstActionTemplate = action.ActionTemplatesWithParameters[0]
        const selectedActionTemplate = defaultActionTemplate || firstActionTemplate
        const selectedActionTemplateModel = selectedActionTemplate?.model
        const selectedActionParams = selectedActionTemplate?.actionParameterDefinitions

        if(!contextState.parameters?.length) {
            dispatch({
                type: 'SET_PARAMETERS',
                payload: selectedActionParams
            })
            dispatch({
                type: 'SET_ACTION_TEMPLATE',
                payload: selectedActionTemplateModel
            })
        }

    }, [contextState.actionData])

    React.useEffect(() => {

    }, [])

    return (
        <ConfigureParametersContext.Provider value={contextState}>
            <SetParametersConfigContext.Provider value={setContextState}>
                {children}
            </SetParametersConfigContext.Provider>
        </ConfigureParametersContext.Provider>
    )
}