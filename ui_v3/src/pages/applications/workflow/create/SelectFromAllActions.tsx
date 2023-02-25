import { Grid } from "@mui/material";
import ActionDefinitionActionType from "../../../../enums/ActionDefinitionActionType";
import useFetchActionDefinitions from "./hooks/useFetchActionDefinitions";
import { ActionDefinitionToAdd } from "./SelectAction/SelectAction";
import SelectActionCard from "./SelectActionCard";

export interface SelectFromAllActionsProps {
    onAddAction: (actionDefinitionDetail: ActionDefinitionToAdd) => void,
    actionDefinitionNameSearchQuery: string
}

const SelectFromAllActions = (props: SelectFromAllActionsProps) => {
    const [allActionDefinitionsData, allActionDefinitionsIsLoading, allActionDefinitionsError] = useFetchActionDefinitions({filter: {IsVisibleOnUI: true}})

    if(allActionDefinitionsIsLoading) {
        return <>Loading...</>
    } else if(!!allActionDefinitionsError) {
        return <>{allActionDefinitionsError}</>
    } else {
        const filteredActionDefinitions = allActionDefinitionsData?.filter(actionDefinition => actionDefinition?.ActionDefinition?.model?.ActionType !== ActionDefinitionActionType.WORKFLOW && actionDefinition.ActionDefinition?.model?.ActionType !== ActionDefinitionActionType.AUTO_FLOW)
        return(
            <Grid container spacing={1} sx={{overflowY: 'auto', maxHeight: '550px'}}>
                {filteredActionDefinitions.filter(actionDefinition => actionDefinition?.ActionDefinition?.model?.UniqueName?.toLocaleLowerCase()?.includes(props.actionDefinitionNameSearchQuery.toLocaleLowerCase())).map(actionDefinition =>
                    <Grid item xs={12} md={6} lg={6} xl={4} sm={12}>
                        <SelectActionCard
                            actionId={actionDefinition?.ActionDefinition?.model?.Id||"NA"}
                            actionName={actionDefinition?.ActionDefinition?.model?.DisplayName || actionDefinition?.ActionDefinition?.model?.UniqueName||"NAME NA"}
                            actionDescription={actionDefinition?.ActionDefinition?.model?.Description||"DESCRIPTION NA"}
                            onAddAction={props.onAddAction}
                            defaultTemplateId={actionDefinition?.ActionDefinition?.model?.DefaultActionTemplateId||"TEMPLATE NA"}
                            actionGroup={actionDefinition?.ActionDefinition?.model?.ActionGroup}
                            parameters={actionDefinition?.ActionTemplatesWithParameters?.[0]?.actionParameterDefinitions}
                        />
                    </Grid>)}
            </Grid>
        )
    }
}

export default SelectFromAllActions;