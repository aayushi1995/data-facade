import { Box } from "@mui/material"
import React from "react"
import ActionDefinitionActionType from "../../../../../enums/ActionDefinitionActionType"
import { ActionDefinitionDetail } from "../../../../../generated/interfaces/Interfaces"
import GroupDropDown from "../GroupDropDown"
import useFetchActionDefinitions from "../hooks/useFetchActionDefinitions"
import { ActionDefinitionToAdd } from "../SelectAction/SelectAction"
import { SelectActionCardProps } from "../SelectActionCard"


interface SelectFromGroups {
    onAddAction: (actionDefinitionDetail: ActionDefinitionToAdd) => void,
}

const SelectFromGroups = (props: SelectFromGroups) => {
    
    const [groupActions, setGroupActions] = React.useState<{[key: string]: SelectActionCardProps[]}>({})
    const handleSuccess = (data: ActionDefinitionDetail[]) => {
        let newActions: {[key: string]: SelectActionCardProps[]} = {}
        const filteredActionDefinitions = data.filter(actionDefinition => actionDefinition?.ActionDefinition?.model?.ActionType !== ActionDefinitionActionType.WORKFLOW && actionDefinition.ActionDefinition?.model?.ActionType !== ActionDefinitionActionType.AUTO_FLOW)
        filteredActionDefinitions.forEach(actionDefinition => {
            if(!!actionDefinition?.ActionDefinition?.model?.ActionGroup) {
                const existingActions = newActions?.[actionDefinition?.ActionDefinition?.model?.ActionGroup] || []
                existingActions.push({
                    actionId: actionDefinition?.ActionDefinition?.model?.Id!,
                    actionName: actionDefinition?.ActionDefinition?.model?.DisplayName || "Name NA",
                    actionDescription: actionDefinition?.ActionDefinition?.model?.Description || "NA",
                    defaultTemplateId: actionDefinition?.ActionDefinition?.model?.DefaultActionTemplateId || "NA",
                    onAddAction: props.onAddAction,
                    parameters: actionDefinition?.ActionTemplatesWithParameters?.[0]?.actionParameterDefinitions,
                    actionGroup: actionDefinition?.ActionDefinition?.model?.ActionGroup
                })
                newActions[actionDefinition?.ActionDefinition?.model?.ActionGroup] = existingActions
            }
        })    
        setGroupActions(newActions)
    }

    const [allActionDefinitionsData, allActionDefinitionsIsLoading, allActionDefinitionsError] = useFetchActionDefinitions({handleSuccess: handleSuccess, filter: {IsVisibleOnUI: true}})

    React.useEffect(() => {
        handleSuccess(allActionDefinitionsData)
    }, [allActionDefinitionsData])

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1, overflowY: 'auto', maxHeight: '550px'}}>
            {Object.entries(groupActions)?.map(([actionGroup, actionDefinitions]) => {
                return (
                    <Box sx={{width: '100%'}}>
                        <GroupDropDown groupName={actionGroup} actionCount={actionDefinitions.length} actions={actionDefinitions}/>
                    </Box>
                )
            })}
        </Box>
            
    )
}

export default SelectFromGroups