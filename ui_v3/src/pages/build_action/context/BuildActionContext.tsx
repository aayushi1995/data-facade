import React from "react";
import { UseMutationResult, useQueryClient } from "react-query";
import { v4 as uuidv4 } from 'uuid';
import ChartOptionType, { ChartKindsType } from "../../../common/components/charts/types/ChartTypes";
import useCopyAndSaveDefinition from "../../../common/components/workflow/create/hooks/useCopyAndSaveDefinition";
import { ActionParameterAdditionalConfig, ActionParameterColumnAdditionalConfig } from "../../../common/components/workflow/create/ParameterInput";
import { getAttributesFromInputType } from "../../../custom_enums/ActionParameterDefinitionInputMap";
import getDefaultCode from "../../../custom_enums/DefaultCode";
import { getLanguage } from "../../../custom_enums/SupportedRuntimeGroupToLanguage";
import ActionDefinitionActionType from "../../../enums/ActionDefinitionActionType";
import ActionDefinitionPresentationFormat from "../../../enums/ActionDefinitionPresentationFormat";
import ActionDefinitionPublishStatus from "../../../enums/ActionDefinitionPublishStatus";
import ActionDefinitionQueryLanguage from "../../../enums/ActionDefinitionQueryLanguage";
import ActionDefinitionVisibility from "../../../enums/ActionDefinitionVisibility";
import ActionParameterDefinitionDatatype from "../../../enums/ActionParameterDefinitionDatatype";
import ActionParameterDefinitionInputType from "../../../enums/ActionParameterDefinitionInputType";
import ActionParameterDefinitionTag from "../../../enums/ActionParameterDefinitionTag";
import TemplateLanguage from "../../../enums/TemplateLanguage";
import TemplateSupportedRuntimeGroup from "../../../enums/TemplateSupportedRuntimeGroup";
import { ActionDefinition, ActionParameterDefinition, ActionParameterInstance, ActionTemplate, TableProperties, Tag } from "../../../generated/entities/Entities";
import { ActionDefinitionDetail } from "../../../generated/interfaces/Interfaces";
import { safelyParseJSON } from "../../execute_action/util";
import { ActionParameterDefinitionConfig } from "../components/common-components/EditActionParameter";
import useActionDefinitionDetail from "../hooks/useActionDefinitionDetail";
import useActionDefinitionFormSave, { ActionDefinitionFormPayload } from "../hooks/useActionDefinitionFormCreate";

// Build Action Context State
export type ActionContextActionParameterDefinitionWithTags = {
    parameter: ActionParameterDefinition,
    tags: Tag[],
    existsInDB: boolean
}

export type ContextModes = "CREATE" | "UPDATE" | "EMPTY" | undefined

export type BuildActionContextState = {
    mode: ContextModes,
    actionDefinitionWithTags: {
        actionDefinition: ActionDefinition,
        tags: Tag[]
    },
    actionTemplateWithParams: {
        template: ActionTemplate,
        parameterWithTags: ActionContextActionParameterDefinitionWithTags[],
        parameterAdditionalConfig?: ActionParameterAdditionalConfig[],
        activeParameterId?: string
    }[],
    activeTemplateId?: string,
    lastSavedActionDefinition?: ActionDefinition,
    savingAction: boolean,
    loadingActionForEdit: boolean,
    actionDefinitionToLoadId?: string,
    SourceApplicationId?: string,
    testMode?: boolean,
    charts?: ChartOptionType[]
}

const formEmptyDefaultContext: () => BuildActionContextState = () => {
    return {
        mode: undefined,
        actionDefinitionWithTags: {
            actionDefinition: {},
            tags: []
        },
        actionTemplateWithParams: [],
        isLoadingAction: false,
        savingAction: false,
        loadingActionForEdit: false
    }
}

const formDefaultUpdateContext: () => BuildActionContextState = () => {
    return {
        mode: "UPDATE",
        actionDefinitionWithTags: {
            actionDefinition: {},
            tags: []
        },
        actionTemplateWithParams: [],
        isLoadingAction: false,
        savingAction: false,
        loadingActionForEdit: false
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
                PresentationFormat: ActionDefinitionPresentationFormat.TABLE_VALUE,
                PinnedToDashboard: true,
                Visibility: ActionDefinitionVisibility.CREATED_BY,
                PublishStatus: ActionDefinitionPublishStatus.READY_TO_USE,
                DefaultActionTemplateId: actionTemplateId
            },
            tags: []
        },
        actionTemplateWithParams: [
            {
                template: {
                    Id: actionTemplateId,
                    DefinitionId: actionDefinitionId,
                    Language: TemplateLanguage.PYTHON,
                    SupportedRuntimeGroup: TemplateSupportedRuntimeGroup.PYTHON,
                    Text: getDefaultCode(ActionDefinitionActionType.PROFILING, TemplateSupportedRuntimeGroup.PYTHON)
                },
                parameterWithTags: [],
                parameterAdditionalConfig: []
            }
        ],
        activeTemplateId: actionTemplateId,
        savingAction: false,
        loadingActionForEdit: false
    }
    newState.actionDefinitionWithTags.actionDefinition.DefaultActionTemplateId = newState.actionTemplateWithParams[0].template.Id
    return newState
}

export const BuildActionContext = React.createContext<BuildActionContextState>(formEmptyDefaultContext()) 

// Set Build Action Context State
export type SetBuildActionContextState = (action: BuildActionAction) => void
const defaultSetBuildActionContextState: SetBuildActionContextState = (action: BuildActionAction) => {}
export const SetBuildActionContext = React.createContext<SetBuildActionContextState>(defaultSetBuildActionContextState)


// Data Query Hooks Context
type UseActionHooksState = {
    useActionDefinitionFormSave?: UseMutationResult<ActionDefinitionFormPayload, unknown, BuildActionContextState, unknown>,
    refreshActionDefinitionToLoad?: () => void,
    duplicateActionMutation?: UseMutationResult<ActionDefinition[], unknown, {actionDefinitionId: string}, unknown>
}
export const UseActionHooks = React.createContext<UseActionHooksState>({})

type SetModeAction = {
    type: "SetMode",
    payload: {
        mode: ContextModes,
        saveOldContextCallback?: (oldContext?: BuildActionContextState) => void,
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

type AddGenerateCodeAction = {
    type: "AddGenerateCode",
    payload: {
        generatedCode: string
    }
}

type SetActionGroupAction = {
    type: "SetActionGroup",
    payload: {
        newGroup?: string
    }
}

type SetActionDefinitionAction = {
    type: "SetActionDefinition",
    payload: {
        newActionDefinition?: ActionDefinition
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

type DuplicateActionParameterDefinitionsAction = {
    type: "DuplicateActionParameterDefinitions",
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

type LoadFromExistingAction = {
    type: "LoadFromExisting",
    payload: ActionDefinitionDetail
}

type SaveActionToLastCreatedAction = {
    type: "SaveActionToLastCreated"
}

type TogglePinnedToDashboardAction = {
    type: "TogglePinnedToDashboard"
}

type ToggleVisibilityAction = {
    type: "ToggleVisibility"
}

type TogglePublishStatusAction = {
    type: "TogglePublishStatus"
}

type SaveActionDefinitionMutatingAction = {
    type: "SaveActionDefinitionMutating"
}

type SaveActionDefinitionSettledAction = {
    type: "SaveActionDefinitionSettled"
}

type LoadActionForEditMutatingAction = {
    type: "LoadActionForEditMutating"
}

type LoadActionForEditSettledAction = {
    type: "LoadActionForEditSettled"
}

type SetActionDefinitionToLoadIdAction = {
    type: "SetActionDefinitionToLoadId",
    payload: {
        actionDefinitionToLoadId?: string,
        saveOldContextCallback?: (oldContext?: BuildActionContextState) => void,
        cachedContext?: BuildActionContextState
    }
}

type InferParametersAction = {
    type: "InferParameters"
}

type FormAdditionalConfigAction = {
    type: "FormAdditionalConfig"
}

type SetTestMode = {
    type: "SetTestMode",
    payload: boolean
}

type AddChartToConfig = {
    type: "AddChartToConfig"
}

type ChangeChartKind = {
    type: 'ChangeChartKind',
    payload: {
        chartIndex: number,
        chartKind: ChartKindsType
    }
}

type ChangeChartName = {
    type: 'ChangeChartName',
    payload: {
        chartIndex: number,
        newName: string
    }
}

type SetChartConfigForIndex = {
    type: 'SetChartConfigForIndex',
    payload: {
        chartConfig: ChartOptionType,
        chartIndex: number
    }
}

type SetActiveParameterId = {
    type: 'SetActiveParameterId',
    payload: {
        newActiveParameterId?: string
    }
}

type SetEntireState = {
    type: "SetEntireState",
    payload: {
        newState: BuildActionContextState,
        oldStateCallback?: (oldState?: BuildActionContextState) => void
    }
}

export type BuildActionAction = SetActionDefinitionNameAction |
SetActionDefinitionDescriptionAction |
SetActionDefinitionActionTypeAction |
SetActionDefinitionReturnTypeAction |
SetActionGroupAction |
AddActionDefinitionTagAction |
RemoveActionDefinitionTagAction |
ReAssignActionDefinitionTagAction |
SetActionTemplateSupportedRuntimeGroupAction |
SetActionTemplateTextAction |
AddGenerateCodeAction |
SetParameterDetailsAction |
SetParameterTypeAction |
SetActionDefinitionAction |
AddActionParameterDefinitionAction |
RemoveActionParameterDefinitionsAction |
DuplicateActionParameterDefinitionsAction |
ResetActionParameterDefinitions |
SetActionParameterDefintionTagsAction |
RefreshIdsAction |
ResetAction |
LoadFromExistingAction |
SetModeAction |
SetApplicationIdAction |
SaveActionToLastCreatedAction |
TogglePinnedToDashboardAction |
ToggleVisibilityAction |
TogglePublishStatusAction |
SaveActionDefinitionMutatingAction |
SaveActionDefinitionSettledAction |
LoadActionForEditMutatingAction |
LoadActionForEditSettledAction |
SetActionDefinitionToLoadIdAction |
InferParametersAction |
FormAdditionalConfigAction |
SetTestMode |
AddChartToConfig |
ChangeChartKind |
ChangeChartName |
SetChartConfigForIndex |
SetActiveParameterId |
SetEntireState


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
                        PresentationFormat: action.payload.newReturnType
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

        case "SetActionGroup": {
            return {
                ...state,
                actionDefinitionWithTags: {
                    ...state.actionDefinitionWithTags,
                    actionDefinition: {
                        ...state?.actionDefinitionWithTags?.actionDefinition,
                        ActionGroup: action.payload.newGroup
                    }
                }
            }
        }

        case "SetActionDefinition": {
            return {
                ...state,
                actionDefinitionWithTags: {
                    ...state?.actionDefinitionWithTags,
                    actionDefinition: {
                        ...state?.actionDefinitionWithTags?.actionDefinition,
                        ...action?.payload?.newActionDefinition
                    }
                }
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

        case "AddGenerateCode": {
            const activeTemplateCode = state.actionTemplateWithParams.find(actionTemplate => actionTemplate.template.Id===state.activeTemplateId)?.template?.Text
            const newTemplateCode = activeTemplateCode + "\n\n" + action.payload.generatedCode
            
            return reducer(state, {
                type: "SetActionTemplateText",
                payload: {
                    newText: newTemplateCode
                }
            })
        }

        case "InferParameters": {
            const activeTemplate = state?.actionTemplateWithParams.find(at => at?.template?.Id===state?.activeTemplateId)
            const inferredParameters = extractParametersFromCode(activeTemplate?.template?.Text, activeTemplate?.template?.Language)
            const existingParameters = activeTemplate?.parameterWithTags
            const newParameters = inferredParameters.map(inferredParam => {
                const existingParameterDefinition = existingParameters?.find(p => p?.parameter?.ParameterName===inferredParam?.ParameterName)?.parameter
                const parameterTag = ( inferredParam.Tag === ActionParameterDefinitionTag.OTHER || inferredParam.Tag === undefined ) ? existingParameterDefinition?.Tag : inferredParam.Tag
                if(existingParameterDefinition){
                    return {
                        parameter: {
                            ...existingParameterDefinition,
                            ...inferredParam,
                            Tag: parameterTag
                        },
                        tags: []
                    }
                }
                return getDefaultParameterDefinition(inferredParam, activeTemplate?.template?.Language, activeTemplate?.template?.Id, state?.actionDefinitionWithTags?.actionDefinition?.Id)
            })
            const newState = {
                ...state,
                actionTemplateWithParams: state.actionTemplateWithParams.map(actionTemplate => actionTemplate.template.Id!==state.activeTemplateId ? actionTemplate : {
                    ...actionTemplate,
                    parameterWithTags: newParameters
                })
            }

            return reducer(newState, {type: "FormAdditionalConfig"})
        }

        case "SetParameterDetails": {
            const oldState = {
                ...state,
                actionTemplateWithParams: state.actionTemplateWithParams.map(at => at.template.Id!==action.payload.newParamConfig.TemplateId ? at : {
                    ...at,
                    parameterWithTags: at.parameterWithTags.map(apwt => apwt.parameter.Id!==action.payload.newParamConfig.Id ? apwt : ({
                        ...apwt, 
                        parameter: { 
                            ...apwt.parameter, 
                            ...action.payload.newParamConfig
                        }
                    }))
                })
            }
            return reducer(oldState, {type: "FormAdditionalConfig"})
        }
        
        case "SetParameterType": {
            const oldState = {
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
            return reducer(oldState, {type: "FormAdditionalConfig"})
        }

        case "AddActionParameterDefinition": {
            const oldState = {
                ...state,
                actionTemplateWithParams: state.actionTemplateWithParams.map(at => at.template.Id!==action.payload.templateId ? at : {...at, parameterWithTags: [...at.parameterWithTags, getDefaultParameterWithTags(state.actionDefinitionWithTags.actionDefinition.Id!, at.template.Id!)]})
            }
            return reducer(oldState, {type: "FormAdditionalConfig"})
        }

        case "RemoveActionParameterDefinitions": {
            const toRemoveIds = action.payload.actionParameterDefinitions.map(param => param.Id)
            const oldState = {
                ...state,
                actionTemplateWithParams: state.actionTemplateWithParams.map(at => ({...at, parameterWithTags: at.parameterWithTags.filter(apwt => !toRemoveIds.includes(apwt.parameter.Id))}))
            }
            return reducer(oldState, {type: "FormAdditionalConfig"})
        }

        case "DuplicateActionParameterDefinitions": {
            const newState = {
                    ...state,
                    actionTemplateWithParams: state?.actionTemplateWithParams?.map?.(actionTemplateWithParam => {
                        const duplicateParams = actionTemplateWithParam?.parameterWithTags
                            ?.filter(paramWithTag => action.payload?.actionParameterDefinitions?.find(paramDef => paramDef?.Id===paramWithTag?.parameter?.Id))
                            ?.map(paramWithTag => {
                                return {
                                    ...paramWithTag,
                                    parameter: {
                                        ...paramWithTag?.parameter,
                                        Id: uuidv4(),
                                        ParameterName: (paramWithTag?.parameter?.ParameterName || "") + " Copy",
                                        DisplayName: (paramWithTag?.parameter?.DisplayName || "") + " Copy"
                                    }
                                }
                            })
                        return {
                            ...actionTemplateWithParam,
                            parameterWithTags: [...actionTemplateWithParam?.parameterWithTags, ...duplicateParams]
                        }
                    })
                }

            return reducer(newState, {type: "FormAdditionalConfig"})
        }

        case "ResetActionParameterDefinitionsAction": {
            const oldState = {
                ...state,
                actionTemplateWithParams: state.actionTemplateWithParams.map(at => at.template.Id!==action.payload.templateId ? at : {...at, parameterWithTags: []})
            }
            return reducer(oldState, {type: "FormAdditionalConfig"})
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

        case "LoadFromExisting": {
            const activeTemplateId = state?.actionDefinitionWithTags?.actionDefinition?.DefaultActionTemplateId||state?.actionTemplateWithParams[0]?.template?.Id
            const newState = {
                ...state,
                mode: "UPDATE",
                actionDefinitionWithTags: {
                    actionDefinition: {
                        ...action.payload?.ActionDefinition?.model!
                    },
                    tags: action.payload?.ActionDefinition?.tags!
                },
                actionTemplateWithParams: (action.payload?.ActionTemplatesWithParameters||[]).map(at => ({
                    template: at.model!,
                    parameterWithTags: (at?.actionParameterDefinitions||[]).map(apd => ({
                        parameter: apd.model!,
                        tags: apd.tags!,
                        existsInDB: true
                    }))
                })),
                isLoadingAction: false,
                activeTemplateId: activeTemplateId,
                sourcedFromActionDefiniton: action.payload?.ActionDefinition?.model!,
                charts: formChartsFromActionDefinitionConfig(action.payload?.ActionDefinition?.model?.Config || "{}"),
                actionDefinitionToLoadId: undefined
            } as BuildActionContextState
        
            const finalState = assignActiveTemplateId(newState)
            return reducer(finalState, {type: "FormAdditionalConfig"})
        }

        case "SetApplicationId": {
            return {
                ...state,
                actionDefinitionWithTags: {
                    ...state?.actionDefinitionWithTags,
                    actionDefinition: {
                        ...state?.actionDefinitionWithTags?.actionDefinition,
                        ApplicationId: action.payload.newApplicationId
                    }
                }
            }
        }

        case "SetMode": {
            if(state.mode==="UPDATE"){
                action.payload?.saveOldContextCallback?.(state)
            }
            
            switch(action.payload.mode) {
                case "CREATE":
                    return formDefaultCreateContext()

                case "UPDATE":
                    return formDefaultUpdateContext()
                    
                default:
                    return state
            }
        }

        case "SaveActionToLastCreated": {
            return {
                ...state,
                lastSavedActionDefinition: state?.actionDefinitionWithTags?.actionDefinition
            }
        }
        
        case "TogglePinnedToDashboard": {
            return {
                ...state,
                actionDefinitionWithTags: {
                    ...state.actionDefinitionWithTags,
                    actionDefinition: {
                        ...state.actionDefinitionWithTags.actionDefinition,
                        PinnedToDashboard: !(state.actionDefinitionWithTags.actionDefinition.PinnedToDashboard)
                    }
                }
            }
        }

        case "ToggleVisibility": {
            return {
                ...state,
                actionDefinitionWithTags: {
                    ...state.actionDefinitionWithTags,
                    actionDefinition: {
                        ...state.actionDefinitionWithTags.actionDefinition,
                        Visibility: (state.actionDefinitionWithTags.actionDefinition.Visibility === ActionDefinitionVisibility.CREATED_BY ? ActionDefinitionVisibility.ORG : ActionDefinitionVisibility.CREATED_BY)
                    }
                }
            }
        }

        case "TogglePublishStatus": {
            return {
                ...state,
                actionDefinitionWithTags: {
                    ...state.actionDefinitionWithTags,
                    actionDefinition: {
                        ...state.actionDefinitionWithTags.actionDefinition,
                        PublishStatus: (state.actionDefinitionWithTags.actionDefinition.PublishStatus === ActionDefinitionPublishStatus.READY_TO_USE ? ActionDefinitionPublishStatus.DRAFT : ActionDefinitionPublishStatus.READY_TO_USE)
                    }
                }
            }
        }

        case "SaveActionDefinitionMutating": {
            return {
                ...state,
                savingAction: true
            }
        }

        case "SaveActionDefinitionSettled": {
            return {
                ...state,
                savingAction: false
            }
        }
        
        case "LoadActionForEditMutating": {
            return {
                ...state,
                loadingActionForEdit: true
            }
        }
        
        case "LoadActionForEditSettled": {
            return {
                ...state,
                loadingActionForEdit: false
            }
        }

        case "SetActionDefinitionToLoadId": {
            if(state.mode==="UPDATE") {
                action?.payload?.saveOldContextCallback?.(state)
            }
            
            if(action.payload.cachedContext) {
                return action.payload.cachedContext
            }

            return {
                ...state,
                actionDefinitionToLoadId: action.payload.actionDefinitionToLoadId
            }
        }

        case "FormAdditionalConfig": {
            const newTemplateWithParams = state?.actionTemplateWithParams?.map(at => {
                const parameters = assignIndex(validateColumnParameters(at?.parameterWithTags?.map(apwt => apwt?.parameter)))
                const additionalConfs = [
                    ...formAdditionalConfForColumnParameters(parameters)
                ]

                return {
                    ...at,
                    parameterWithTags: parameters.map(param => {
                        const currentParameterWithTags= at?.parameterWithTags?.find(apwt => apwt?.parameter?.Id === param?.Id)
                        return {
                            ...currentParameterWithTags,
                            parameter: param
                        } as ActionContextActionParameterDefinitionWithTags
                    }),
                    parameterAdditionalConfig: additionalConfs
                }
            })

            return {
                ...state,
                actionTemplateWithParams: newTemplateWithParams
            }
        }

        case "SetTestMode": {
            return {
                ...state,
                testMode: action.payload
            }
        }

        case 'AddChartToConfig': {
            return {
                ...state,
                charts: [...state.charts || [], {
                    kind: 'bar',
                    expose_data: false,
                    name: 'New chart',
                    options: {
                        x: '',
                        y: ''
                    }
                }]
            }
        }

        case 'ChangeChartKind': {
            var newCharts = state.charts || []
            newCharts[action.payload.chartIndex] = {kind: action.payload.chartKind, name: state.charts?.[action.payload.chartIndex]?.name || "New Chart", expose_data: state.charts?.[action.payload.chartIndex]?.expose_data || false}
            return {
                ...state,
                charts: newCharts
            }
        }

        case 'ChangeChartName': {
            return {
                ...state,
                charts: state.charts?.map((chartConfig, index) => index === action.payload.chartIndex ? {
                    ...chartConfig,
                    name: action.payload.newName
                } : chartConfig)
            }
        }

        case 'SetChartConfigForIndex': {
            return {
                ...state,
                charts: state.charts?.map((chart, index) => index === action.payload.chartIndex ? action.payload.chartConfig : chart)
            }
        }

        case "SetActiveParameterId": {
            const {newActiveParameterId} = action.payload

            return {
                ...state,
                actionTemplateWithParams: (state?.actionTemplateWithParams || [])?.map(atwp => ({
                    ...atwp,
                    activeParameterId: (atwp?.parameterWithTags||[])?.find(apwp => apwp?.parameter?.Id===newActiveParameterId) ? newActiveParameterId : undefined
                }))                
            }
        }

        case "SetEntireState": {
            const { newState, oldStateCallback } = action.payload
            oldStateCallback?.(state)
            return newState
        }

        default:
            const neverAction: never = action
            return state
    }
}

export const assignIndex = (parameters: ActionParameterDefinition[]) => {
    const paramWithIndex = parameters?.filter(param => param?.Index !== undefined)
    const paramWithoutIndex = parameters?.filter(param => param?.Index === undefined)

    const paramWithIndexCount = paramWithIndex.length

    const paramWithIndexCompressed = paramWithIndex?.sort(param => param?.Index || 0)?.map((param, index) => ({...param, Index: index+1}))
    const paramWithNewAssignedIndex = paramWithoutIndex?.map((param, index) => ({...param, Index: paramWithIndexCount+index+1}))

    return [...paramWithIndexCompressed, ...paramWithNewAssignedIndex]
}

const formChartsFromActionDefinitionConfig = (config: string): ChartOptionType[] => {
    const actionDefinitionConfig = safelyParseJSON(config) as any
    return actionDefinitionConfig?.charts
}

const validateColumnParameters = (parameters: ActionParameterDefinition[]) => {
    // Validate Parent Parameter In Config For Column Parameters
    const newParameters1 = parameters?.map?.(param => {
        const config = safelyParseJSON(param?.Config) as ActionParameterDefinitionConfig
        const parentParameterDefinitionId = config?.ParentParameterDefinitionId
        const isColumnTypeParameter = param?.Tag === ActionParameterDefinitionTag?.COLUMN_NAME || param?.Datatype === ActionParameterDefinitionDatatype.COLUMN_NAMES_LIST
        const doesParentParameterExist = parameters?.find(oldParam => oldParam?.Id === parentParameterDefinitionId)

        return {
            ...param,
            Config: (isColumnTypeParameter && doesParentParameterExist) ? param?.Config : "{}"
        }
    })

    // Validate Default Value For Column Parameters
    const newParameters2 = newParameters1?.map?.(param => {
        const isColumnTypeParameter = param?.Tag === ActionParameterDefinitionTag?.COLUMN_NAME
        const defaultParameterInstance = safelyParseJSON(param?.DefaultParameterValue) as ActionParameterInstance
        const defaultColumnTableId = defaultParameterInstance?.TableId

        const someTableParametersHasThisAsDefaultTableId = newParameters1
            ?.filter(oldParam => oldParam.Tag===ActionParameterDefinitionTag.TABLE_NAME || oldParam.Datatype === ActionParameterDefinitionDatatype.PANDAS_DATAFRAME || oldParam.Tag===ActionParameterDefinitionTag.DATA)
            ?.some(oldParam => {
                const oldParamDefaultParamterInstance = safelyParseJSON(oldParam?.DefaultParameterValue) as ActionParameterInstance
                return oldParamDefaultParamterInstance?.TableId===defaultColumnTableId
        })
        return {
            ...param,
            DefaultParameterValue: (isColumnTypeParameter && !someTableParametersHasThisAsDefaultTableId) ? "{}" : param.DefaultParameterValue 
        }
    })

    return newParameters2;
}

const formAdditionalConfForColumnParameters = (parameters: ActionParameterDefinition[]) => {
    const tableParameters = parameters?.filter(param => param.Tag===ActionParameterDefinitionTag.TABLE_NAME || param.Datatype === ActionParameterDefinitionDatatype.PANDAS_DATAFRAME || param.Tag===ActionParameterDefinitionTag.DATA)
    const availableTablesFilterDefault = tableParameters?.map(tableParam =>{
        const defaultValue = safelyParseJSON(tableParam?.DefaultParameterValue) as ActionParameterInstance
        const tableId = defaultValue?.TableId
        if(!!tableId) {
            return {
                Id: tableId
            } as TableProperties
        } else {
            return undefined
        }
    })?.filter(x => x!==undefined)

    const additionalConfForColumns = parameters?.filter(param => param.Tag===ActionParameterDefinitionTag.COLUMN_NAME || param.Datatype===ActionParameterDefinitionDatatype.COLUMN_NAMES_LIST)
        ?.map(columnParam => {
            const parameterConfig = safelyParseJSON(columnParam?.Config) as ActionParameterDefinitionConfig
            if(parameterConfig?.ParentParameterDefinitionId !== undefined) {
                const tableParam = tableParameters?.find(tableParameters => tableParameters?.Id === parameterConfig?.ParentParameterDefinitionId)
                if(tableParam!==undefined) {
                    const tableParamDefaultParameterInstance = safelyParseJSON(tableParam?.DefaultParameterValue) as ActionParameterInstance
                    if(tableParamDefaultParameterInstance?.TableId!==undefined){
                        const tableFilter: TableProperties = {
                            Id: tableParamDefaultParameterInstance?.TableId
                        }
                        return {
                            type: "Column",
                            parameterDefinitionId: columnParam?.Id,
                            availableTablesFilter: [tableFilter]
                        } as ActionParameterColumnAdditionalConfig
                    } else {
                        return {
                            type: "Column",
                            parameterDefinitionId: columnParam?.Id,
                            availableTablesFilter: []
                        } as ActionParameterColumnAdditionalConfig
                    }
                } else {
                    return {
                        type: "Column",
                        parameterDefinitionId: columnParam?.Id,
                        availableTablesFilter: availableTablesFilterDefault
                    } as ActionParameterColumnAdditionalConfig
                }
            } else {
                return {
                    type: "Column",
                    parameterDefinitionId: columnParam?.Id,
                    availableTablesFilter: availableTablesFilterDefault
                } as ActionParameterColumnAdditionalConfig
            }
        }
    )

    return additionalConfForColumns
}

const extractParametersFromCode = (code?: string, language?: string): ActionParameterDefinition[] => {
    if(!!code && !!language) {
        const parametersArray = []
        if (language === ActionDefinitionQueryLanguage.PYTHON) {
            for (let i = 0; i < code.length; i++) {
                if (code.substring(i, i + 3) === "def") {
                    let j = i + 4
                    if (code.substring(j, j + 7) === "execute") {
                        while (j < code.length && code.charAt(j) !== ',') {
                            j++
                        }
                        let parameter = ""
                        let isDataTypeOrValue = false;
                        while (j < code.length && code.charAt(j) !== ')') {
                            if (code.charAt(j) !== ',' && code.charAt(j) !== ' ') {
                                if(code.charAt(j) === ':' || code.charAt(j) === '=') {
                                    isDataTypeOrValue = true;
                                }
                                if(!isDataTypeOrValue) {
                                    parameter = parameter + code.charAt(j)
                                }
                            }
                            if (code.charAt(j) === ',' || code.charAt(j + 1) === ')') {
                                if (parameter.length !== 0) {
                                    parametersArray.push({ParameterName: parameter})
                                    parameter = ""
                                }
                                isDataTypeOrValue = false
                            }
                            j++
                        }
                    }
                }
            }
            if(parametersArray.length===0) {
                code?.split("\n").map(line => {
                    // removing lines which starts with #
                    if(line.trim().length > 0 && line.trim().charAt(0) === '#') {
                        return;
                    }
                    if(line.includes("df_helper.get")) {
                        const match = get_match_for_df_helper(line);
                        if(match == null){
                            return;
                        }
                        const name = match?.groups?.["Name"]
                        const displayName = match?.groups?.["DisplayName"] ?? name
                        const description = match?.groups?.["Description"] ?? name
                        const type = match?.groups?.["Type"]
                        if(name && type) {
                            parametersArray.push({
                                ParameterName: name,
                                DisplayName: displayName,
                                Description: description,
                                ...getAttributesFromInputType(inferInputType(type), language)

                            } as ActionParameterDefinition)
                        }
                    }
                })
            }
        } else if (language === ActionDefinitionQueryLanguage.SQL) {
            console.log("Wo")
            code?.split("\n").map(line => {
                // Ignoring commented lines. Ideally we should use something else like using editor itself or parser
                if (line.trim().length > 0 && line.trim().charAt(0) === '-'){
                    return;
                }
                for (let i = 0; i < line.length; i++) {
                    let matches = line.match(/(?<=(?<!\{)\{)[^{}]*(?=\}(?!\}))/g)
                    matches?.forEach(parameter => {
                        parameter = parameter.replace('{','')
                        parameter = parameter.replace('}','')
                        parametersArray.push({ParameterName: parameter})
                    })
                }
            })
            console.log(parametersArray)
        }
        // https://stackoverflow.com/questions/45439961/remove-duplicate-values-from-an-array-of-objects-in-javascript
        const deDupedParams = parametersArray.filter((v,i,a)=>a.findIndex(v2=> v.ParameterName === v2.ParameterName)===i)
        return deDupedParams;
    }
    return []
}

const inferInputType = (type?: string) => {
        const inputTypeMapping = [
            ["table", ActionParameterDefinitionInputType.TABLE_NAME],
            ["column_list", ActionParameterDefinitionInputType.COLUMN_LIST],
            ["column", ActionParameterDefinitionInputType.COLUMN_NAME],
            ["string", ActionParameterDefinitionInputType.STRING],
            ["integer", ActionParameterDefinitionInputType.INTEGER],
            ["decimal", ActionParameterDefinitionInputType.DECIMAL],
            ["boolean", ActionParameterDefinitionInputType.BOOLEAN]
        ]

        const detectedType = inputTypeMapping.find(([key, val]) => type?.includes(key))?.[1]
        return detectedType || ActionParameterDefinitionInputType.STRING
}

const getDefaultParameterDefinition = (param: ActionParameterDefinition, language?: string, templateId?: string, definitionId?: string): ActionContextActionParameterDefinitionWithTags => {
    if (param?.ParameterName?.includes('table') || param?.ParameterName?.includes("df")) {
        return {
            parameter: {
                Id: uuidv4(),
                ParameterName: param?.ParameterName,
                TemplateId: templateId,
                ActionDefinitionId: definitionId,
                Index: 0,
                ...getAttributesFromInputType(ActionParameterDefinitionInputType.TABLE_NAME, language),
                ...param
            },
            tags: [],
            existsInDB: false
        }
    } else if (param?.ParameterName?.includes('column')) {
        return {
            parameter: {
                Id: uuidv4(),
                ParameterName: param?.ParameterName,
                TemplateId: templateId,
                ActionDefinitionId: definitionId,
                Index: 0,
                ...getAttributesFromInputType(ActionParameterDefinitionInputType.COLUMN_NAME, language),
                ...param
            },
            tags: [],
            existsInDB: false
        }
    } else {
        return {
            parameter: {
                Id: uuidv4(),
                ParameterName: param?.ParameterName,
                TemplateId: templateId,
                ActionDefinitionId: definitionId,
                Index: 0,
                ...getAttributesFromInputType(ActionParameterDefinitionInputType.STRING, language),
                ...param
            },
            tags: [],
            existsInDB: false
        }
    }
}

const refreshContextIds = (state: BuildActionContextState) => {
    const oldToNewIdMap: Record<string, string> = {}
    setIdMap(state.actionDefinitionWithTags.actionDefinition.Id, oldToNewIdMap)
    setIdMap(state.actionDefinitionWithTags.actionDefinition.DefaultActionTemplateId, oldToNewIdMap)
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
        activeTemplateId: getIdMap(state.activeTemplateId, oldToNewIdMap)
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

const getDefaultParameterWithTags: (definitionId: string, templateId: string) => ActionContextActionParameterDefinitionWithTags = (definitionId: string, templateId: string) => ({
    parameter: defaultParameter(definitionId, templateId),
    tags: [],
    existsInDB: false
})


export const BuildActionContextProvider = ({children, mode, newActionCallback}: {children: React.ReactElement, mode?: ContextModes, newActionCallback?: (newAction: BuildActionContextState) => void}) => {
    const queryClient = useQueryClient()
    const getInitialState = (mode: ContextModes) => {
        switch(mode){
            case "CREATE": return formDefaultCreateContext()
            case "UPDATE": return formDefaultUpdateContext()
            default: return formEmptyDefaultContext()
        }
    }
    const [contextState, dispatch] = React.useReducer(reducer, getInitialState(mode))
    const setContextState: SetBuildActionContextState = ( args: BuildActionAction) => dispatch(args)

    // Data Query Hooks
    // Save Action(Create/ Update)
    const saveMutation = useActionDefinitionFormSave({
        options: {
            onMutate: () => {
                setContextState({type: "SaveActionDefinitionMutating"})
            },
            onSuccess: (data, variables, context) => {
                setContextState({type: "SaveActionToLastCreated"})
                if(contextState.mode==="UPDATE" && !!contextState.actionDefinitionToLoadId){ loadActionForEditQuery.refetch() }
            },
            onSettled: () => {
                setContextState({type: "SaveActionDefinitionSettled"})
            }
        },
        mode: contextState.mode
    })

    const duplicateActionMutation = useCopyAndSaveDefinition({mutationName: "DuplicateWhileEditing"})


    const loadActionForEditQuery = useActionDefinitionDetail({
        options: {
            onSuccess: (data) => {
                setContextState({type: "LoadFromExisting", payload: data[0]})
            },
            onSettled: () => {
                setContextState({type: "LoadActionForEditSettled"})
            },
            enabled: false
        },
        actionDefinitionId: contextState.actionDefinitionToLoadId
    })

    // Hook to refetch Action Data on selection change
    React.useEffect(() => {
        if(!!contextState.actionDefinitionToLoadId){
            loadActionForEditQuery.refetch()
        }
    }, [contextState.actionDefinitionToLoadId]) 

    React.useEffect(() => {
        if(loadActionForEditQuery.isLoading===true){
            setContextState({type: "LoadActionForEditMutating"})
        }
    }, [loadActionForEditQuery.isLoading])
    
    React.useEffect(() => {
        if(contextState?.mode==="UPDATE"){
            newActionCallback?.(contextState)
        }
    }, [contextState?.actionDefinitionWithTags?.actionDefinition?.Id, contextState?.mode]) 

    // Hook to infer params on code change
    const activeTemplate = contextState?.actionTemplateWithParams.find(at => at.template.Id===contextState?.activeTemplateId)
    React.useEffect(() => {
        if(activeTemplate?.template?.Text!==undefined){
            setContextState({ type: "InferParameters" })
        }
    }, [activeTemplate?.template?.Text])
    

    const actionHooks: UseActionHooksState = {
        useActionDefinitionFormSave: saveMutation,
        refreshActionDefinitionToLoad: () => { loadActionForEditQuery.refetch() },
        duplicateActionMutation: duplicateActionMutation
    }

    return (
        <UseActionHooks.Provider value={actionHooks}>
            <BuildActionContext.Provider value={contextState}>
                <SetBuildActionContext.Provider value={setContextState}>
                    {children}
                </SetBuildActionContext.Provider>
            </BuildActionContext.Provider>
        </UseActionHooks.Provider>
    )
}

function get_match_for_df_helper(line: string) {
    const expressions = [
        '.*= *df_helper.get_(?<Type>.*)\(.*"(?<Name>.*)".*,.*"(?<DisplayName>.*)".*,.*"(?<Description>.*)".*\)',
        '.*= *df_helper.get_(?<Type>.*)\(.*"(?<Name>.*)".*,.*"(?<DisplayName>.*)".*".*\)',
        '.*= *df_helper.get_(?<Type>.*)\(.*"(?<Name>.*)".*\)'
    ]

    for (let i=0, len=expressions.length, text=""; i<len; i++){
        const match = get_match_from_regx(expressions[i], line);
        if (match != null)
            return match;
    }
}
function get_match_from_regx(expression: string, line: string) {
    const reg = new RegExp(expression, "gm");
    const match = reg.exec(line);
    return match;
}

