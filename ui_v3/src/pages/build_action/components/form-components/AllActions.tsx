import { Grid } from "@mui/material";
import LoadingWrapper from "../../../../common/components/LoadingWrapper";
import useFetchActionDefinitions from "../../../../common/components/workflow/create/hooks/useFetchActionDefinitions";
import ActionCard from "./ActionCard";

export interface AllActionsProps {
    actionDefinitionNameSearchQuery: string,
    selectedActionId?: string,
    onSelectAction: (actionDefinitionId: string|undefined) => void
}

const AllActions = (props: AllActionsProps) => {
    const [allActionDefinitionsData, allActionDefinitionsIsLoading, allActionDefinitionsError] = useFetchActionDefinitions({})

    return (
        <LoadingWrapper isLoading={allActionDefinitionsIsLoading} error={allActionDefinitionsError} data={allActionDefinitionsData}>
            <Grid container spacing={3} sx={{px: 2}}>
                {allActionDefinitionsData.filter(actionDefinition => actionDefinition.UniqueName?.toLocaleLowerCase()?.includes(props.actionDefinitionNameSearchQuery.toLocaleLowerCase())).map(actionDefinition =>
                    <Grid item xs={12}>
                        <ActionCard
                            actionId={actionDefinition.Id||"NA"}
                            actionName={actionDefinition.UniqueName||"NAME NA"}
                            actionDescription={actionDefinition.Description||"DESCRIPTION NA"}
                            selectedActionId={props.selectedActionId}
                            onRadioToggle={props.onSelectAction}
                        />
                    </Grid>)}
            </Grid>
        </LoadingWrapper>
    )
}

export default AllActions;