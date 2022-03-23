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
import { ActionDefinition, ActionParameterDefinition, ActionTemplate, Tag } from "../../../generated/entities/Entities";
import { ActionDefinitionDetail } from "../../../generated/interfaces/Interfaces";

// Build Action Context State
type ActionParameterDefinitionWithTags = {
    parameter: ActionParameterDefinition,
    tags: Tag[]
}

export type ContextModes = "CREATE" | "UPDATE"

export type BuildActionContextState = {
    mode: ContextModes,
    actionDefinitionWithTags: {
        actionDefinition: ActionDefinition,
        tags: Tag[]
    },
    actionTemplateWithParams: {
        template: ActionTemplate,
        parameterWithTags: ActionParameterDefinitionWithTags[]
    }[],
    activeTemplateId?: string,
    isLoadingAction: boolean,
    sourcedFromActionDefiniton?: ActionDefinition,
    onSuccessfulBuild?: (actionDefinitionId?: ActionDefinition) => void
}


const formDefaultUpdateContext: () => BuildActionContextState = () => {
    return {
        mode: "UPDATE",
        actionDefinitionWithTags: {
            actionDefinition: {},
            tags: []
        },
        actionTemplateWithParams: [],
        isLoadingAction: false
    }
}

const formDefaultCreateContext: () => BuildActionContextState = () => {
    const actionDefinitionId: string = uuidv4()
    const actionTemplateId: string = uuidv4()
    const newState: BuildActionContextState = {
        mode: "CREATE",
        actionDefinitionWithTags: {
            actionDefinition: {
                Id: actionDefinitionId,
                ActionType: ActionDefinitionActionType.PROFILING,
                PresentationFormat: ActionDefinitionPresentationFormat.TABLE_VALUE
            },
            tags: []
        },
        actionTemplateWithParams: [
            {
                template: {
                    Id: actionTemplateId,
                    DefinitionId: actionDefinitionId,
                    Language: TemplateLanguage.PYTHON,
                    SupportedRuntimeGroup: TemplateSupportedRuntimeGroup.PYTHON
                },
                parameterWithTags: []
            }
        ],
        activeTemplateId: actionTemplateId,
        isLoadingAction: false
    }
    newState.actionDefinitionWithTags.actionDefinition.DefaultActionTemplateId = newState.actionTemplateWithParams[0].template.Id
    return newState
}

export const BuildActionContext = React.createContext<BuildActionContextState>(formDefaultCreateContext()) 

// Set Build Action Context State
type SetBuildActionContextState = (action: BuildActionAction) => void
const defaultSetBuildActionContextState: SetBuildActionContextState = (action: BuildActionAction) => {}
export const SetBuildActionContext = React.createContext<SetBuildActionContextState>(defaultSetBuildActionContextState)

type SetModeAction = {
    type: "SetMode",
    payload: {
        mode: ContextModes
    }
}
// Action Types
// Action Definition
type SetActionDefinitionNameAction = {
    type: "SetActionDefinitionName",
    payload: {
        newName: string|undefined
    }
}

type SetActionDefinitionDescriptionAction = {
    type: "SetActionDefinitionDescription",
    payload: {
        newDescription: string|undefined
    }
}

type SetActionDefinitionActionTypeAction = {
    type: "SetActionDefinitionActionType",
    payload: {
        newActionType: string
    }
}

type SetActionDefinitionReturnTypeAction = {
    type: "SetActionDefinitionReturnType",
    payload: {
        newReturnType: string
    }
}

type AddActionDefinitionTagAction = {
    type: "AddActionDefinitionTag",
    payload: {
        newTag: Tag
    }
}

type RemoveActionDefinitionTagAction = {
    type: "RemoveActionDefinitionTag",
    payload: {
        tag: Tag
    }
}

type ReAssignActionDefinitionTagAction = {
    type: "ReAssignActionDefinitionTag",
    payload: {
        newTags: Tag[]
    }
}


// Action Template
type SetActionTemplateSupportedRuntimeGroupAction = {
    type: "SetActionTemplateSupportedRuntimeGroup",
    payload: {
        templateId: string,
        newSupportedRuntimeGroup: string
    }
}

type SetActionTemplateTextAction = {
    type: "SetActionTemplateText",
    payload: {
        newText: string
    }
}



// Action Parameter
type SetParameterDetailsAction = {
    type: "SetParameterDetails",
    payload: {
        newParamConfig: ActionParameterDefinition
    }
}

type SetParameterTypeAction = {
    type: "SetParameterType",
    payload: {
        newParamConfig: ActionParameterDefinition
    }
}

type AddActionParameterDefinitionAction = {
    type: "AddActionParameterDefinition",
    payload: {
        templateId?: string
    }
}

type ResetActionParameterDefinitions = {
    type: "ResetActionParameterDefinitionsAction",
    payload: {
        templateId?: string
    }
}

type RemoveActionParameterDefinitionsAction = {
    type: "RemoveActionParameterDefinitions",
    payload: {
        actionParameterDefinitions: ActionParameterDefinition[]
    }
}

type SetActionParameterDefintionTagsAction = {
    type: "SetActionParameterDefintionTags",
    payload: {
        parameterId: string,
        newTags: Tag[]
    }
}

type SetSuccessCallbackFunction = {
    type: "SetSuccessCallbackFunction",
    payload: {
        cb: (id?: ActionDefinition) => void
    }
}

type SetApplicationIdAction = {
    type: "SetApplicationId",
    payload: {
        newApplicationId?: string
    }
}

// Other
type RefreshIdsAction = {
    type: "RefreshIds"
}

type ResetAction = {
    type: "Reset"
}

type LoadingAction = {
    type: "Loading"
}

type LoadingOverAction = {
    type: "LoadingOver"
}

type LoadFromExistingAction = {
    type: "LoadFromExisting",
    payload: ActionDefinitionDetail
}

export type BuildActionAction = SetActionDefinitionNameAction |
SetActionDefinitionDescriptionAction |
SetActionDefinitionActionTypeAction |
SetActionDefinitionReturnTypeAction |
AddActionDefinitionTagAction |
RemoveActionDefinitionTagAction |
ReAssignActionDefinitionTagAction |
SetActionTemplateSupportedRuntimeGroupAction |
SetActionTemplateTextAction |
SetParameterDetailsAction |
SetParameterTypeAction |
AddActionParameterDefinitionAction |
RemoveActionParameterDefinitionsAction |
ResetActionParameterDefinitions |
SetActionParameterDefintionTagsAction |
RefreshIdsAction |
ResetAction |
LoadingAction |
LoadingOverAction |
LoadFromExistingAction |
SetSuccessCallbackFunction |
SetModeAction |
SetApplicationIdAction


const reducer = (state: BuildActionContextState, action: BuildActionAction): BuildActionContextState => {
    switch (action.type) {
        case "SetActionDefinitionName": {
            return {
                ...state,
                actionDefinitionWithTags: {
                    ...state.actionDefinitionWithTags,
                    actionDefinition: {
                        ...state.actionDefinitionWithTags.actionDefinition,
                        DisplayName: action.payload.newName,
                        UniqueName: action.payload.newName
                    }
                }
            }
        }

        case "SetActionDefinitionDescription": {
            return {
                ...state,
                actionDefinitionWithTags: {
                    ...state.actionDefinitionWithTags,
                    actionDefinition: {
                        ...state.actionDefinitionWithTags.actionDefinition,
                        Description: action.payload.newDescription
                    }
                }
            }
        }

        case "SetActionDefinitionActionType": {
            return {
                ...state,
                actionDefinitionWithTags: {
                    ...state.actionDefinitionWithTags,
                    actionDefinition: {
                        ...state.actionDefinitionWithTags.actionDefinition,
                        ActionType: action.payload.newActionType
                    }
                }
            }
        }

        case "SetActionDefinitionReturnType": {
            return {
                ...state,
                actionDefinitionWithTags: {
                    ...state.actionDefinitionWithTags,
                    actionDefinition: {
                        ...state.actionDefinitionWithTags.actionDefinition,
                        OutputFormat: action.payload.newReturnType
                    }
                }
            }
        }

        case "AddActionDefinitionTag": {
            return {
                ...state,
                actionDefinitionWithTags: {
                    ...state.actionDefinitionWithTags,
                    tags: [...state.actionDefinitionWithTags.tags, action.payload.newTag]
                }
            }
        }

        case "RemoveActionDefinitionTag": {
            return {
                ...state,
                actionDefinitionWithTags: {
                    ...state.actionDefinitionWithTags,
                    tags: state.actionDefinitionWithTags.tags.filter(tag => tag.Id===action.payload.tag)
                }
            }
        }

        case "ReAssignActionDefinitionTag": {
            return {
                ...state,
                actionDefinitionWithTags: {
                    ...state.actionDefinitionWithTags,
                    tags: action.payload.newTags
                }
            }
        }

        case "SetActionTemplateSupportedRuntimeGroup": {
            return {
                ...state,
                actionTemplateWithParams: state.actionTemplateWithParams.map(actionTemplate => actionTemplate.template.Id!==action.payload.templateId ? actionTemplate : {
                    ...actionTemplate,
                    template: {
                        ...actionTemplate.template,
                        SupportedRuntimeGroup: action.payload.newSupportedRuntimeGroup,
                        Language: getLanguage(action.payload.newSupportedRuntimeGroup)
                    }
                })
            }
        }

        case "SetActionTemplateText": {
            return {
                ...state,
                actionTemplateWithParams: state.actionTemplateWithParams.map(actionTemplate => actionTemplate.template.Id!==state.activeTemplateId ? actionTemplate : {
                    ...actionTemplate,
                    template: {
                        ...actionTemplate.template,
                        Text: action.payload.newText
                    }
                })
            }
        }

        case "SetParameterDetails": {
            return {
                ...state,
                actionTemplateWithParams: state.actionTemplateWithParams.map(at => at.template.Id!==action.payload.newParamConfig.TemplateId ? at : {
                    ...at,
                    parameterWithTags: at.parameterWithTags.map(apwt => apwt.parameter.Id!==action.payload.newParamConfig.Id ? apwt : ({...apwt, parameter: { ...apwt.parameter, ...action.payload.newParamConfig}}))
                })
            }
        }
        
        case "SetParameterType": {
            return {
                ...state,
                actionTemplateWithParams: state.actionTemplateWithParams.map(at => ({
                    ...at, 
                    parameterWithTags: at.parameterWithTags.map(apwt => apwt.parameter.Id!==action.payload.newParamConfig.Id ? apwt : {
                        ...apwt,
                        parameter: {
                            ...apwt.parameter,
                            ...action.payload.newParamConfig,
                            DefaultParameterValue: undefined
                        }
                    })
                }))
            }
        }

        case "AddActionParameterDefinition": {
            return {
                ...state,
                actionTemplateWithParams: state.actionTemplateWithParams.map(at => at.template.Id!==action.payload.templateId ? at : {...at, parameterWithTags: [...at.parameterWithTags, getDefaultParameterWithTags(state.actionDefinitionWithTags.actionDefinition.Id!, at.template.Id!)]})
            }
        }

        case "RemoveActionParameterDefinitions": {
            const toRemoveIds = action.payload.actionParameterDefinitions.map(param => param.Id)
            return {
                ...state,
                actionTemplateWithParams: state.actionTemplateWithParams.map(at => ({...at, parameterWithTags: at.parameterWithTags.filter(apwt => !toRemoveIds.includes(apwt.parameter.Id))}))
            }
        }

        case "ResetActionParameterDefinitionsAction": {
            return {
                ...state,
                actionTemplateWithParams: state.actionTemplateWithParams.map(at => at.template.Id!==action.payload.templateId ? at : {...at, parameterWithTags: []})
            }
        }

        case "SetActionParameterDefintionTags": {
            return {
                ...state,
                actionTemplateWithParams: state.actionTemplateWithParams.map(at => ({...at, parameterWithTags: at.parameterWithTags.map(apwt => apwt.parameter.Id!==action.payload.parameterId ? apwt : {...apwt, tags: action.payload.newTags})}))
            }
        }

        case "RefreshIds": {
            return refreshContextIds(state)
        }
        
        case "Reset": {
            switch(state.mode){
                case "CREATE": return formDefaultCreateContext()
                case "UPDATE": return formDefaultUpdateContext()
                default: return formDefaultCreateContext()
            }
        }

        case "Loading": {
            return {...state, isLoadingAction: true}
        }

        case "LoadingOver": {
            return {...state, isLoadingAction: false}
        }

        case "LoadFromExisting": {
            const activeTemplateId = state?.actionDefinitionWithTags?.actionDefinition?.DefaultActionTemplateId||state?.actionTemplateWithParams[0]?.template?.Id
            const newState = {
                ...state,
                actionDefinitionWithTags: {
                    actionDefinition: action.payload?.ActionDefinition?.model!,
                    tags: action.payload?.ActionDefinition?.tags!
                },
                actionTemplateWithParams: (action.payload?.ActionTemplatesWithParameters||[]).map(at => ({
                    template: at.model!,
                    parameterWithTags: (at?.actionParameterDefinitions||[]).map(apd => ({
                        parameter: apd.model!,
                        tags: apd.tags!
                    }))
                })),
                isLoadingAction: false,
                activeTemplateId: activeTemplateId,
                sourcedFromActionDefiniton: action.payload?.ActionDefinition?.model!
            }

            if(state.mode==="CREATE") {
                const x = assignActiveTemplateId(refreshContextIds(newState))
                return x
            } else if(state.mode==="UPDATE") {
                return assignActiveTemplateId(newState)
            } else {
                return assignActiveTemplateId(newState)
            }
        }

        case "SetSuccessCallbackFunction": {
            return {
                ...state,
                onSuccessfulBuild: action.payload.cb
            }
        }

        case "SetApplicationId": {
            return {
                ...state,
                actionDefinitionWithTags: {
                    ...state.actionDefinitionWithTags,
                    actionDefinition: {
                        ...state.actionDefinitionWithTags.actionDefinition,
                        ApplicationId: action.payload.newApplicationId
                    }
                }
            }
        }

        case "SetMode": {
            switch(action.payload.mode) {
                case "CREATE":
                    return formDefaultCreateContext()

                case "UPDATE":
                    return formDefaultUpdateContext()
                    
                default:
                    return state
            }
        }

        default:
            const neverAction: never = action
            console.log(`Action: ${neverAction} does not match any action`)
            return state
    }
}

const refreshContextIds = (state: BuildActionContextState) => {
    const oldToNewIdMap: Record<string, string> = {}
    setIdMap(state.actionDefinitionWithTags.actionDefinition.Id, oldToNewIdMap)
    state.actionTemplateWithParams.forEach(at => {
        setIdMap(at.template.Id, oldToNewIdMap)
        at.parameterWithTags.forEach(apwt => setIdMap(apwt.parameter.Id, oldToNewIdMap))
    })
  
    const newState: BuildActionContextState = {
        ...state,
        actionDefinitionWithTags: {
            ...state.actionDefinitionWithTags,
            actionDefinition: {
                ...state.actionDefinitionWithTags.actionDefinition,
                Id: getIdMap(state.actionDefinitionWithTags.actionDefinition.Id, oldToNewIdMap),
                DefaultActionTemplateId: getIdMap(state.actionDefinitionWithTags.actionDefinition.DefaultActionTemplateId, oldToNewIdMap)
            }
        },
        actionTemplateWithParams: state.actionTemplateWithParams.map(actionTemplate => {
            return {
                ...actionTemplate,
                template: {
                    ...actionTemplate.template, 
                    Id: getIdMap(actionTemplate.template.Id, oldToNewIdMap),
                    DefinitionId: getIdMap(actionTemplate.template.DefinitionId, oldToNewIdMap)
                },
                parameterWithTags: actionTemplate.parameterWithTags.map(apwt => ({
                    ...apwt,
                    parameter: {
                        ...apwt.parameter,
                        Id: uuidv4(),
                        TemplateId: getIdMap(actionTemplate.template.Id, oldToNewIdMap),
                        ActionDefinitionId: getIdMap(state.actionDefinitionWithTags.actionDefinition.Id, oldToNewIdMap)
                    }
                }))
            }
        }),
        isLoadingAction: false
    }

    return newState
}

const assignActiveTemplateId = (state: BuildActionContextState) => {
    const newState = {...state}
    if(!newState.actionDefinitionWithTags.actionDefinition.DefaultActionTemplateId){ 
        newState.actionDefinitionWithTags.actionDefinition.DefaultActionTemplateId = newState.actionTemplateWithParams[0]?.template?.Id
    }
    newState.activeTemplateId = newState.actionDefinitionWithTags.actionDefinition.DefaultActionTemplateId
    return newState
}

const setIdMap = (id: string|undefined, map: Record<string, string>) => {
    if(!!id) {
        map[id] = uuidv4()
    }
}

const getIdMap = (id: string|undefined, map: Record<string, string>) => {
    if(!!id) {
        return map[id]
    }
    return undefined
}


const defaultParameter: (definitionId: string, templateId: string) => ActionParameterDefinition = (definitionId: string, templateId: string) => ({
    Id: uuidv4(),
    ParameterName: "",
    TemplateId: templateId,
    ActionDefinitonId: definitionId,
    ...getAttributesFromInputType()
})

const getDefaultParameterWithTags: (definitionId: string, templateId: string) => ActionParameterDefinitionWithTags = (definitionId: string, templateId: string) => ({
    parameter: defaultParameter(definitionId, templateId),
    tags: []
})


export const BuildActionContextProvider = ({children}: {children: React.ReactElement}) => {
    const [contextState, dispatch] = React.useReducer(reducer, formDefaultCreateContext())
    const setContextState: SetBuildActionContextState = ( args: BuildActionAction) => dispatch(args)

    return (
        <BuildActionContext.Provider value={contextState}>
            <SetBuildActionContext.Provider value={setContextState}>
                {children}
            </SetBuildActionContext.Provider>
        </BuildActionContext.Provider>
    )
}