import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router";
import { BuildActionContext, SetBuildActionContext, UseActionHooks } from "../../../pages/build_action/context/BuildActionContext";
import ActionDefinitionSelector from "./ActionDefinitionSelector";
import CreateNewAction, { CreateNewActionProps } from "./CreateNewAction";
import getDefaultCode from "../../../../src/custom_enums/DefaultCode"
export type AddActionToEditProps = {
    addActionWithId: (actionDefId?: string) => void
}

function AddActionToEdit(props: AddActionToEditProps) {
    const { addActionWithId } = props
    const history = useHistory()
    const buildActionContext = React.useContext(BuildActionContext)
    const setBuildActionContext = React.useContext(SetBuildActionContext)
    const useActionHooks = React.useContext(UseActionHooks)
    const currentActionName = buildActionContext.actionDefinitionWithTags.actionDefinition.UniqueName
    const [actionName, setActionName] = React.useState(currentActionName ?? "")
    const activeTemplate = (buildActionContext?.actionTemplateWithParams || []).find(at => at.template.Id===buildActionContext.activeTemplateId)?.template
    const getInitialActionType = () => {
        return buildActionContext.actionDefinitionWithTags.actionDefinition.ActionType
    }
    const getInitialTemplateLanguage = () => {
        return buildActionContext.actionTemplateWithParams.find(at => at.template.Id===buildActionContext.actionDefinitionWithTags.actionDefinition.DefaultActionTemplateId)!.template?.SupportedRuntimeGroup
    }

    const getInitialReturnType = () => {
        return buildActionContext.actionDefinitionWithTags.actionDefinition.PresentationFormat
    }

    const [actionType, setActionType] = React.useState(getInitialActionType())
    const [templateSupportedRuntimeGroup, setTemplateSupportedRuntimeGroup] = React.useState(getInitialTemplateLanguage())
    React.useEffect(() => {
        setBuildActionContext({
            type: "SetActionTemplateText",
            payload: {
                newText: getDefaultCode(actionType, activeTemplate?.SupportedRuntimeGroup)
            }
        })
    }, [actionType, actionName, activeTemplate?.SupportedRuntimeGroup])
    const createNewActionProps: CreateNewActionProps = {
        name: buildActionContext?.actionDefinitionWithTags?.actionDefinition?.DisplayName,
        description: buildActionContext?.actionDefinitionWithTags?.actionDefinition?.Description,
        group: buildActionContext?.actionDefinitionWithTags?.actionDefinition?.ActionGroup,
        applicationId: buildActionContext?.actionDefinitionWithTags?.actionDefinition?.ApplicationId,
        onChangeHandlers: {
            onNameChange: (newName?: string) => setBuildActionContext({ type: "SetActionDefinitionName", payload: { newName: newName } }),
            onDescriptionChange: (newDescription?: string) => setBuildActionContext({ type: "SetActionDefinitionDescription", payload: { newDescription: newDescription } }),
            onGroupChange: (newGroupName?: string) => setBuildActionContext({ type: "SetActionGroup", payload: { newGroup: newGroupName } }),
            onApplicationChange: (newApplicationId?: string) => setBuildActionContext({ type: "SetApplicationId", payload: { newApplicationId: newApplicationId } }),
            onLanguageChange: (newSupportedRuntimeGroup?: string) => newSupportedRuntimeGroup && setBuildActionContext({
                type: "SetActionTemplateSupportedRuntimeGroup",
                payload: {
                    templateId: buildActionContext.actionDefinitionWithTags.actionDefinition.DefaultActionTemplateId!,
                    newSupportedRuntimeGroup: newSupportedRuntimeGroup
                }
            })
        },
        actionHandlers: {
            onSaveAction: () => {
                console.log(buildActionContext)
                useActionHooks.useActionDefinitionFormSave?.mutate(buildActionContext, {
                    onSuccess: () => addActionWithId(buildActionContext?.actionDefinitionWithTags?.actionDefinition?.Id)
                }) 
            }
        }
    }
    console.log(buildActionContext)
    return (
        <Box sx={{p:5}}>
            {buildActionContext.mode==="CREATE" &&
                <CreateNewAction {...createNewActionProps}/>
            }
            <ActionDefinitionSelector
                onActionDefinitionSelectionCallback={(actionDefinitionId?: string) =>  props?.addActionWithId(actionDefinitionId)}
            />
        </Box>
    )
}

export default AddActionToEdit;

