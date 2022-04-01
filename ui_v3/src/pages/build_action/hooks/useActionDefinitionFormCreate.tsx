import { useMutation, UseMutationOptions } from "react-query"
import { ActionDefinition, ActionParameterDefinition, ActionTemplate, Tag } from "../../../generated/entities/Entities"
import labels from "../../../labels/labels"
import { BuildActionContextState, ContextModes } from "../context/BuildActionContext"
import dataManagerInstance from './../../../data_manager/data_manager'


export type ActionDefinitionFormPayload = {
    ActionDefinition: {
        model: ActionDefinition;
        tags: Tag[];
    };
    ActionTemplatesWithParameters: {
        model: ActionTemplate;
        tags: never[];
        actionParameterDefinitions: {
            model: ActionParameterDefinition,
            tags: Tag[]
        }[];
    }[];
}

export interface UseActionDefinitionFormCreateProps {
    options: UseMutationOptions<ActionDefinitionFormPayload, unknown, unknown, unknown>,
    mode: ContextModes
}

export interface UseActionDefinitionFormUpdateProps {
    
}

const useActionDefinitionFormSave = (props: UseActionDefinitionFormCreateProps) => {
    const { options, mode } = props
    const fetchedDataManagerInstance = dataManagerInstance.getInstance as {retreiveData: Function, deleteData: Function, saveData: Function, patchData: Function}

    const createMutation = useMutation((state: BuildActionContextState) => {
        console.log(formCreateRequestBodyFromContextState(state))
            return fetchedDataManagerInstance.saveData(labels.entities.ActionDefinition, 
                formCreateRequestBodyFromContextState(state)
            )
        },
        {
            ...options
        }
    )

    const updateMutation = useMutation((state: BuildActionContextState) => {
            return fetchedDataManagerInstance.patchData(labels.entities.ActionDefinition, 
                formUpdateRequestBodyFromContextState(state)
            )
        },
        {
            ...options
        }
    )

    const getMutation = (mode: ContextModes) => {
        switch(mode){
            case "CREATE":
                return createMutation
            case "UPDATE":
                return updateMutation
            default:
                return updateMutation
        }   
    }
    return  getMutation(mode)
}



const formCreateRequestBodyFromContextState = (state: BuildActionContextState) => {
    const entityToCreate: ActionDefinitionFormPayload = {
        ActionDefinition: {
            model: {
                ...state.actionDefinitionWithTags.actionDefinition,
                ApplicationId: state.SourceApplicationId
            },
            tags: state.actionDefinitionWithTags.tags
        },
        ActionTemplatesWithParameters: state.actionTemplateWithParams.map(at => ({
            model: at.template,
            tags: [],
            actionParameterDefinitions: at.parameterWithTags.map(apwt => ({
                model: apwt.parameter,
                tags: apwt.tags
            }))
        }))
    }

    return {
        entityProperties: {},
        CreateActionDefinitionForm: true,
        ...entityToCreate
    }
}

const formUpdateRequestBodyFromContextState = (state: BuildActionContextState) => {
    const updatedAction: ActionDefinitionFormPayload = {
        ActionDefinition: {
            model: state.actionDefinitionWithTags.actionDefinition,
            tags: state.actionDefinitionWithTags.tags
        },
        ActionTemplatesWithParameters: state.actionTemplateWithParams.map(at => ({
            model: at.template,
            tags: [],
            actionParameterDefinitions: at.parameterWithTags.map(apwt => ({
                model: apwt.parameter,
                tags: apwt.tags
            }))
        }))
    }

    return {
        ActionDefinitionForm: true,
        UpdatedAction: updatedAction
    }
}

export default useActionDefinitionFormSave;