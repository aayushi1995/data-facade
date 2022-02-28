import { Grid } from "@material-ui/core";
import useFetchActionDefinitions from "./hooks/useFetchActionDefinitions";
import { ActionDefinitionToAdd } from "./SelectAction/SelectAction";
import SelectActionCard from "./SelectActionCard";

export interface SelectFromAllActionsProps {
    onAddAction: (actionDefinitionDetail: ActionDefinitionToAdd) => void,
    actionDefinitionNameSearchQuery: string
}

const SelectFromAllActions = (props: SelectFromAllActionsProps) => {
    const [allActionDefinitionsData, allActionDefinitionsIsLoading, allActionDefinitionsError] = useFetchActionDefinitions({})

    if(allActionDefinitionsIsLoading) {
        return <>Loading...</>
    } else if(!!allActionDefinitionsError) {
        return <>{allActionDefinitionsError}</>
    } else {
        return(
            <Grid container spacing={1}>
                {allActionDefinitionsData.filter(actionDefinition => actionDefinition.UniqueName?.toLocaleLowerCase()?.includes(props.actionDefinitionNameSearchQuery.toLocaleLowerCase())).map(actionDefinition =>
                    <Grid item xs={12} md={6} lg={4}>
                        <SelectActionCard
                            actionId={actionDefinition.Id||"NA"}
                            actionName={actionDefinition.UniqueName||"NAME NA"}
                            actionDescription={actionDefinition.Description||"DESCRIPTION NA"}
                            onAddAction={props.onAddAction}
                            defaultTemplateId={actionDefinition.DefaultActionTemplateId||"TEMPLATE NA"}
                        />
                    </Grid>)}
            </Grid>
        )
    }
}

export default SelectFromAllActions;