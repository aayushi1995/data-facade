import { Box } from "@mui/material"
import React from "react"
import { ActionDefinition } from "../../../../../generated/entities/Entities"
import GroupDropDown from "../GroupDropDown"
import useFetchActionDefinitions from "../hooks/useFetchActionDefinitions"
import { ActionDefinitionToAdd } from "../SelectAction/SelectAction"
import { SelectActionCardProps } from "../SelectActionCard"


interface SelectFromGroups {
    onAddAction: (actionDefinitionDetail: ActionDefinitionToAdd) => void,
}

const SelectFromGroups = (props: SelectFromGroups) => {
    
    const [groupActions, setGroupActions] = React.useState<{[key: string]: SelectActionCardProps[]}>({})
    const handleSuccess = (data: ActionDefinition[]) => {
        let newActions: {[key: string]: SelectActionCardProps[]} = {}
        data.forEach(actionDefinition => {
            if(!!actionDefinition.ActionGroup) {
                const existingActions = newActions?.[actionDefinition.ActionGroup] || []
                existingActions.push({
                    actionId: actionDefinition.Id!,
                    actionName: actionDefinition.DisplayName || "Name NA",
                    actionDescription: actionDefinition.Description || "NA",
                    defaultTemplateId: actionDefinition.DefaultActionTemplateId || "NA",
                    onAddAction: props.onAddAction
                })
                newActions[actionDefinition.ActionGroup] = existingActions
            }
        })    
        setGroupActions(newActions)
    }

    const [allActionDefinitionsData, allActionDefinitionsIsLoading, allActionDefinitionsError] = useFetchActionDefinitions({handleSuccess: handleSuccess})

    React.useEffect(() => {
        handleSuccess(allActionDefinitionsData)
    }, [allActionDefinitionsData])

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1, overflowY: 'clip'}}>
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