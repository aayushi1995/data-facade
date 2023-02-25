import { Grid } from "@mui/material";
import LoadingWrapper from "../../../../../common/components/LoadingWrapper";
import { ActionDefinition } from "../../../../../generated/entities/Entities";
import useFetchActionDefinitions from "../../../workflow/create/hooks/useFetchActionDefinitions";
import ActionCard from "./ActionCard";

export interface AllActionsProps {
    actionDefinitionNameSearchQuery: string,
    selectedActionId?: string,
    onSelectAction: (actionDefinitionId: string|undefined) => void,
    filter?: ActionDefinition
}

const AllActions = (props: AllActionsProps) => {
    const [allActionDefinitionsData, allActionDefinitionsIsLoading, allActionDefinitionsError] = useFetchActionDefinitions({filter: {...props.filter, IsVisibleOnUI: true}})

    return (
        <LoadingWrapper isLoading={allActionDefinitionsIsLoading} error={allActionDefinitionsError} data={allActionDefinitionsData}>
            <Grid container spacing={3} sx={{px: 2}}>
                {allActionDefinitionsData?.filter(actionDefinition => actionDefinition?.ActionDefinition?.model?.UniqueName?.toLocaleLowerCase()?.includes(props.actionDefinitionNameSearchQuery.toLocaleLowerCase())).map(actionDefinition =>
                    <Grid item xs={12}>
                        <ActionCard
                            actionId={actionDefinition?.ActionDefinition?.model?.Id||"NA"}
                            actionName={actionDefinition?.ActionDefinition?.model?.UniqueName||"NAME NA"}
                            actionDescription={actionDefinition?.ActionDefinition?.model?.Description||"DESCRIPTION NA"}
                            selectedActionId={props.selectedActionId}
                            onSelectAction={props.onSelectAction}
                        />
                    </Grid>)}
            </Grid>
        </LoadingWrapper>
    )
}

export default AllActions;