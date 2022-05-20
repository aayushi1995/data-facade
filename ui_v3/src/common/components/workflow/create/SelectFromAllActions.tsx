import { Grid } from "@mui/material";
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
        return(
            <Grid container spacing={1}>
                {allActionDefinitionsData.filter(actionDefinition => actionDefinition?.ActionDefinition?.model?.UniqueName?.toLocaleLowerCase()?.includes(props.actionDefinitionNameSearchQuery.toLocaleLowerCase())).map(actionDefinition =>
                    <Grid item xs={12} md={6} lg={4}>
                        <SelectActionCard
                            actionId={actionDefinition?.ActionDefinition?.model?.Id||"NA"}
                            actionName={actionDefinition?.ActionDefinition?.model?.UniqueName||"NAME NA"}
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