import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router";
import getDefaultCode from "../../../custom_enums/DefaultCode";
import ActionDefinitionActionType from "../../../enums/ActionDefinitionActionType";
import { BuildActionContext, SetBuildActionContext, UseActionHooks } from "../../../pages/build_action/context/BuildActionContext";
import ActionDefinitionSelector from "./ActionDefinitionSelector";
import CreateNewAction, { CreateNewActionProps } from "./CreateNewAction";
export type AddActionToEditProps = {
    addActionWithId: (actionDefId?: string) => void
}

function AddActionToEdit(props: AddActionToEditProps) {
    const { addActionWithId } = props
    const history = useHistory()
    const buildActionContext = React.useContext(BuildActionContext)
    const setBuildActionContext = React.useContext(SetBuildActionContext)
    const useActionHooks = React.useContext(UseActionHooks)
  
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
            onSaveAction: (newSupportedRuntimeGroup: string, language: string) => {
                useActionHooks.useActionDefinitionFormSave?.mutate({
                    ...buildActionContext,
                    actionTemplateWithParams: buildActionContext.actionTemplateWithParams.map(templateWithParam => templateWithParam.template.Id === buildActionContext.actionDefinitionWithTags.actionDefinition.DefaultActionTemplateId ? {
                        ...templateWithParam,
                        template: {
                            ...templateWithParam.template,
                            SupportedRuntimeGroup: newSupportedRuntimeGroup,
                            Language: language,
                            Text: getDefaultCode(ActionDefinitionActionType.PROFILING, newSupportedRuntimeGroup)
                        }
                    }: templateWithParam)
                }, {
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
