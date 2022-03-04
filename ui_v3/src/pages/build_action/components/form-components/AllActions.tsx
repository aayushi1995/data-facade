import { Grid } from "@material-ui/core";
import useFetchActionDefinitions from "../../../../common/components/workflow/create/hooks/useFetchActionDefinitions";
import ActionCard from "./ActionCard";

export interface AllActionsProps {
    actionDefinitionNameSearchQuery: string,
    selectedActionId?: string,
    onSelectAction: (actionDefinitionId: string|undefined) => void
}

const AllActions = (props: AllActionsProps) => {
    const [allActionDefinitionsData, allActionDefinitionsIsLoading, allActionDefinitionsError] = useFetchActionDefinitions({})

    if(allActionDefinitionsIsLoading) {
        return <>Loading...</>
    } else if(!!allActionDefinitionsError) {
        return <>{allActionDefinitionsError}</>
    } else {
        return(
            <Grid container spacing={1}>
                {allActionDefinitionsData.filter(actionDefinition => actionDefinition.UniqueName?.toLocaleLowerCase()?.includes(props.actionDefinitionNameSearchQuery.toLocaleLowerCase())).map(actionDefinition =>
                    <Grid item xs={12}>
                        <ActionCard
                            actionId={actionDefinition.Id||"NA"}
                            actionName={actionDefinition.UniqueName||"NAME NA"}
                            actionDescription={actionDefinition.Description||"DESCRIPTION NA"}
                            selectedActionId={props.selectedActionId}
                            onSelectAction={props.onSelectAction}
                        />
                    </Grid>)}
            </Grid>
        )
    }
}

export default AllActions;