import React from "react";
import { ActionDefinition, ActionParameterDefinition, ActionParameterInstance, ActionTemplate, ComponentDefinition } from "../../../generated/entities/Entities";
import { ActionDefinitionDetail, WebAppDetails } from "../../../generated/interfaces/Interfaces";
import { v4 as uuidv4 } from "uuid"
import { Layout } from "react-grid-layout";
import { getDefaultTemplateParameters } from "../../../pages/execute_action/util";
import { ComponentConfig, InputComponentDetails, TextBoxComponentDetails } from "../../types/ComponentConfigTypes";
import ActionParameterDefinitionTag from "../../../enums/ActionParameterDefinitionTag";
import ActionParameterDefinitionDatatype from "../../../enums/ActionParameterDefinitionDatatype";
import ComponentTypes from "../../../enums/ComponentTypes";
import ChartOptionType from "../../../common/components/charts/types/ChartTypes";
import { act } from "react-dom/test-utils";

type WebAppActionParameter = Record<string, ActionParameterInstance & {ParameterName: string, UserInputRequired: "Yes" | "No"}>

type WebAppTemplateTextType = Record<string, WebAppActionDefition>

export type WebAppActionDefition = {
    ActionReference: string,
    ActionDefinition: ActionDefinition,
    ParameterMappings: WebAppActionParameter,
    DownstreamDependencies: string[],
    ParameterDependencies: string[]
}

export type WebAppComponent = ComponentDefinition & {UILayout: {x: number, y: number, w: number, h: number}}

export type EditWebAppContextType = {
    webApp: ActionDefinition,
    Components: WebAppComponent[],
    Actions: WebAppActionDefition[],
    WebAppParameters: ActionParameterDefinition[],
    ActionTemplate?: ActionTemplate
}

type SetContextWithDetails = {
    type: 'SetContextWithDetails',
    payload: {
        details: WebAppDetails
    }
}

type AddComponentToWebApp = {
    type: 'AddComponentToWebApp',
    payload: {
        component: ComponentDefinition
        config?: ComponentConfig
    }
}

type ChangeLayout = {
    type: 'ChangeLayout',
    payload: {
        loayout: Layout[]
    }
}

type DeleteComponent = {
    type: 'DeleteComponent',
    payload: {
        componentId: string
    }
}

type AddActionToWebApp = {
    type: 'AddActionToWebApp',
    payload: {
        referenceName: string,
        actionDefinitionToAdd: ActionDefinitionDetail
    }
}

type AddGlobalParameter = {
    type: 'AddGlobalParameter',
    payload: {
        parameter: ActionParameterDefinition
    }
}

type ChangeComponentLabel = {
    type: 'ChangeComponentLabel',
    payload: {
        componentId: string,
        label: string
    }
}

type ChangeWebAppModel = {
    type: 'ChangeWebAppModel',
    payload: {
        key: string,
        value: string
    }
}

type UpdateActionParameters = {
    type: 'UpdateActionParameters',
    payload: {
        actionReference: string,
        ParameterMappings: WebAppActionParameter
    }
}

type ResolveDependences = {
    type: 'ResolveDependences',
    payload: {}
}

type EditTextOfTextBoxComponent = {
    type: 'EditTextOfTextBoxComponent',
    payload: {
        componentId: string,
        details: TextBoxComponentDetails
    }
}

type MapParameterToGlobalParameter = {
    type: 'MapParameterToGlobalParameter',
    payload: {
        actionReference: string,
        childParameterId: string,
        globalParameterId: string
    }
}

export type SetEditWebAppContextType = (action: EditWebAppActionType) => void

export type EditWebAppActionType = SetContextWithDetails |
                                    AddComponentToWebApp |
                                    ChangeLayout |
                                    DeleteComponent |
                                    AddActionToWebApp |
                                    AddGlobalParameter |
                                    ChangeComponentLabel |
                                    ChangeWebAppModel |
                                    UpdateActionParameters |
                                    ResolveDependences |
                                    EditTextOfTextBoxComponent |
                                    MapParameterToGlobalParameter

const defaultWebAppContext: EditWebAppContextType = {
    webApp: {},
    Components: [],
    Actions: [],
    WebAppParameters: []
}

export const EditWebAppContext = React.createContext<EditWebAppContextType>(defaultWebAppContext)

export const SetEditWebAppContext = React.createContext<SetEditWebAppContextType>(
    (action: EditWebAppActionType) => {}
)

const reducer = (state: EditWebAppContextType, action: EditWebAppActionType): EditWebAppContextType => {
    switch(action.type) {
        case 'SetContextWithDetails': {
            return {
                ...state,
                webApp: action.payload.details.WebApp?.ActionDefinition?.model || {},
                Components: action.payload.details.Components?.map(component => ({
                    ...component, 
                    UILayout: component.Layout ? JSON.parse(component.Layout) : {x: 0, y: Infinity, w: 3, h: 3}})) 
                || [],
                Actions: makeActionsFromWebAppTemplate(action.payload.details.WebApp?.ActionTemplatesWithParameters?.[0]?.model || {}),
                WebAppParameters: action.payload.details.WebApp?.ActionTemplatesWithParameters?.[0]?.actionParameterDefinitions?.map(apd => apd.model || {}) || [],
                ActionTemplate: action.payload.details.WebApp?.ActionTemplatesWithParameters?.[0]?.model
            }
        }
        case 'AddComponentToWebApp': {
            return {
                ...state,
                Components: [...state.Components, {
                    Id: uuidv4(),
                    ...action.payload.component,
                    ActionDefinitionId: state.webApp.Id,
                    UILayout: {
                        x: ((state.Components.length) % 2 === 0 ? 0: 8),
                        y: Infinity,
                        w: 7,
                        h: 30
                    },
                    Config: JSON.stringify(action.payload.config?.details)
                }]
            }
        }
        case 'ChangeLayout': {
            return {
                ...state,
                Components: state.Components.map(initialComponent => {
                    const newLayout = action.payload.loayout.find(item => item.i === initialComponent.Id)
                    return {
                        ...initialComponent,
                        UILayout: {
                            ...newLayout!
                        }
                    }
                })
            }
        }
        case 'DeleteComponent': {
            const component = state.Components.find(component => component.Id === action.payload.componentId)
            if(!!component) {
                if(component.Type === ComponentTypes.INPUT) {
                    const globalParameterId = (JSON.parse(component.Config || "{}") as InputComponentDetails).ParameterReference
                    const parameterExists = !!state.WebAppParameters.find(parameter => parameter.Id === globalParameterId)
                    if(parameterExists) {
                        return state
                    }
                }
            }

            return {
                ...state,
                Components: state.Components.filter(component => component.Id !== action.payload.componentId)
            }
        }
        case 'AddActionToWebApp': {
            const defaultParameterDefinitions = getDefaultTemplateParameters(action.payload.actionDefinitionToAdd)
            var parameterMappings: WebAppActionParameter = {}
            var globalParameterAddedState = state
            defaultParameterDefinitions.forEach(pd => {
                parameterMappings = {
                    ...parameterMappings,
                    [pd.Id!]: {
                        ParameterValue: JSON.parse(pd.DefaultParameterValue || "{}")?.ParameterValue,
                        ParameterName: pd.ParameterName!,
                        UserInputRequired: pd.DefaultParameterValue ? "No" : "Yes"
                    }
                }
                if(parameterMappings[pd.Id!].UserInputRequired === "Yes" ) {
                    const existingGlobalParameter = checkIfGlobalParameterExists(pd, state.WebAppParameters)
                    if(!!existingGlobalParameter) {
                        parameterMappings = {
                            ...parameterMappings,
                            [pd.Id!]: {
                                ...parameterMappings[pd.Id!],
                                GlobalParameterId: existingGlobalParameter.Id
                            }
                        }
                    } else {
                        const globalParameter: ActionParameterDefinition = {
                            Id: uuidv4(),
                            ActionDefinitionId: state.webApp.Id,
                            TemplateId: state.ActionTemplate?.Id,
                            ParameterName: pd.ParameterName,
                            Tag: pd.Tag === ActionParameterDefinitionTag.DATA ? ActionParameterDefinitionTag.TABLE_NAME : pd.Tag,
                            Datatype: pd.Datatype === ActionParameterDefinitionDatatype.PANDAS_DATAFRAME ? ActionParameterDefinitionDatatype.STRING : pd.Datatype,
                            OptionSetValues: pd.OptionSetValues,
                            Description: pd.Description
                        }
                        parameterMappings = {
                            ...parameterMappings,
                            [pd.Id!]: {
                                ...parameterMappings[pd.Id!],
                                GlobalParameterId: globalParameter.Id
                            }
                        }
                        globalParameterAddedState = reducer(globalParameterAddedState, {
                            type: 'AddGlobalParameter',
                            payload: {
                                parameter: globalParameter
                            }
                        })
                    }
                }
            })
            const actionToAdd: WebAppActionDefition = {
                ActionReference: action.payload.referenceName,
                ActionDefinition: {
                    Id: action.payload.actionDefinitionToAdd.ActionDefinition?.model?.Id,
                    DisplayName: action.payload.actionDefinitionToAdd.ActionDefinition?.model?.DisplayName,
                    DefaultActionTemplateId: action.payload.actionDefinitionToAdd.ActionDefinition?.model?.DefaultActionTemplateId
                },
                ParameterMappings: parameterMappings,
                DownstreamDependencies: [],
                ParameterDependencies: []
            }
            const chartsOfActions = JSON.parse(action.payload.actionDefinitionToAdd.ActionDefinition?.model?.Config || "{}")?.charts as ChartOptionType[]
            chartsOfActions?.forEach?.((chart, index) => {
                globalParameterAddedState = reducer(globalParameterAddedState, {
                    type: 'AddComponentToWebApp',
                    payload: {
                        component: {
                            Type: ComponentTypes.CHART,
                            Label: chart.name
                        },
                        config: {
                            type: 'chart',
                            details: {
                                ActionReference: action.payload.referenceName,
                                chartIndex: index,
                                chartKind: chart.kind
                            }
                        }
                    }
                })
            })
            globalParameterAddedState = reducer(globalParameterAddedState, {
                type: 'AddComponentToWebApp',
                payload: {
                    component: {
                        Type: ComponentTypes.OUTPUT,
                        Label: "Output of " + action.payload.referenceName
                    },
                    config: {
                        type: 'output',
                        details: {
                            ActionReference: action.payload.referenceName,
                        }
                    }
                }
            })
            return {
                ...globalParameterAddedState,
                Actions: [...state.Actions, actionToAdd]
            }
        }

        case 'AddGlobalParameter': {

            const newState: EditWebAppContextType = {
                ...state,
                WebAppParameters: [...state.WebAppParameters, action.payload.parameter]
            }
            return reducer(newState, {
                type: 'AddComponentToWebApp',
                payload: {
                    component: {
                        Type: ComponentTypes.INPUT,
                        Label: action.payload.parameter.ParameterName
                    },
                    config: {
                        type: 'input',
                        details: {
                            ParameterReference: action.payload.parameter.Id!
                        }
                    }
                }
            })

        }

        case 'ChangeComponentLabel': {
            return {
                ...state,
                Components: state.Components.map(component => component.Id === action.payload.componentId ? {...component, Label: action.payload.label} : component)
            }
        }

        case 'ChangeWebAppModel': {
            return {
                ...state,
                webApp: {
                    ...state.webApp,
                    [action.payload.key]: action.payload.value
                }
            }
        }

        case 'UpdateActionParameters': {
            return reducer({
                ...state,
                Actions: state.Actions.map(actionDef => actionDef.ActionReference === action.payload.actionReference ? {
                    ...actionDef,
                    ParameterMappings: action.payload.ParameterMappings
                } : actionDef)
            }, {
                type: "ResolveDependences",
                payload: {}
            })
        }

        case 'ResolveDependences': {
            
            const downstreamDependencies: Record<string, string[]> = state.Actions.reduce((downstreamDependencies: Record<string, string[]>, webActionDef) => {
                return Object.entries(webActionDef.ParameterMappings).reduce((downstreams: Record<string, string[]>, [parameterDefId, parameterInstance]) => {
                    if(!!parameterInstance.SourceExecutionId) {
                        return {
                            ...downstreams,
                            [parameterInstance.SourceExecutionId]: [...(downstreams[parameterInstance.SourceExecutionId!] || []), webActionDef.ActionReference]
                        }
                    }
                    return downstreams
                }, downstreamDependencies)
            }, {})
            const parameterDependencies: Record<string, string[]> = state.Actions.reduce((parameterDependencies: Record<string, string[]>, webActionDef) => {
                return Object.entries(webActionDef.ParameterMappings).reduce((params: Record<string, string[]>, [paramDefId, parameterInstance]) => {
                    if(!!parameterInstance.GlobalParameterId){
                        return {
                            ...params,
                            [webActionDef.ActionReference]: [...(params[webActionDef.ActionReference] || []), parameterInstance.GlobalParameterId]
                        }
                    }
                    return parameterDependencies
                }, parameterDependencies)
            }, {})
            return {
                ...state,
                Actions: state.Actions.map(webAppAction => {
                    return {
                        ...webAppAction,
                        DownstreamDependencies: [... new Set(downstreamDependencies[webAppAction.ActionReference] || [])],
                        ParameterDependencies: [... new Set(parameterDependencies[webAppAction.ActionReference] || [])]
                    } 
                })
            }
        }

        case 'EditTextOfTextBoxComponent': {
            return {
                ...state,
                Components: state.Components.map(component => component.Id !== action.payload.componentId ? component : {
                    ...component,
                    Config: JSON.stringify(action.payload.details)
                })
            }
        }

        case 'MapParameterToGlobalParameter': {
            return reducer({
                ...state,
                Actions: state.Actions.map(webAppAction => webAppAction.ActionReference !== action.payload.actionReference ? webAppAction : {
                    ...webAppAction,
                    ParameterMappings: {
                        ...webAppAction.ParameterMappings,
                        [action.payload.childParameterId]: {
                            ...webAppAction.ParameterMappings[action.payload.childParameterId],
                            GlobalParameterId: action.payload.globalParameterId
                        }
                    }
                })
            }, {
                type: 'ResolveDependences',
                payload: {}
            })
        }

        default:
            return state
    }
}

export function checkIfGlobalParameterExists(parameterDefinition: ActionParameterDefinition, globalParameters: ActionParameterDefinition[]): ActionParameterDefinition | undefined {
    return globalParameters.find(globalParameter => globalParameter.ParameterName === parameterDefinition.ParameterName)
}

export function formRequestFromState(state: EditWebAppContextType): {UpdatedAction: ActionDefinitionDetail} & {WithComponents: ComponentDefinition[]} & {ActionDefinitionForm: boolean} {

    const webAppTemplate = state.Actions.reduce((template, currentAction) => {
        return {
            ...template,
            [currentAction.ActionReference]: {
                ActionDefinition: {
                    ...currentAction.ActionDefinition
                },
                ParameterMappings: {
                    ...currentAction.ParameterMappings
                }
            }
        }
    }, {})

    return {
        UpdatedAction: {
            ActionDefinition: {
                model: state.webApp,
                tags: []
            },
            ActionTemplatesWithParameters: [
                {
                    model: {
                        ...state.ActionTemplate,
                        Text: JSON.stringify(webAppTemplate) 
                    },
                    actionParameterDefinitions: state.WebAppParameters.map(parameter => ({model: parameter, tags: []})),
                    tags: []
                }
            ],
        },
        ActionDefinitionForm: true,
        WithComponents: state.Components.map(component => ({
            ...component,
            Layout: JSON.stringify(component.UILayout),
            UILayout: undefined
        }))
    }
}

const makeActionsFromWebAppTemplate = (webAppTemplate: ActionTemplate) => {
    const webAppActions = JSON.parse(webAppTemplate.Text || "{}") as WebAppTemplateTextType

    const actions: WebAppActionDefition[] = Object.entries(webAppActions).map(([actionReference, actionDetails]) => {
        return {
            ActionReference: actionReference,
            ActionDefinition: actionDetails.ActionDefinition,
            ParameterMappings: actionDetails.ParameterMappings,
            DownstreamDependencies: actionDetails.DownstreamDependencies || [],
            ParameterDependencies: actionDetails.DownstreamDependencies || []
        }
    })

    return actions;
}

const EditWebAppContextProvider = ({children}: {children: React.ReactElement}) => {
    const [contextState, dispatch] = React.useReducer(reducer, defaultWebAppContext)

    const setContextState: SetEditWebAppContextType = ( args: EditWebAppActionType) => {
        dispatch(args)
    }

    return (
        <EditWebAppContext.Provider value={contextState}>
            <SetEditWebAppContext.Provider value={setContextState}>
                {children}
            </SetEditWebAppContext.Provider>
        </EditWebAppContext.Provider>
    )

}

export default EditWebAppContextProvider