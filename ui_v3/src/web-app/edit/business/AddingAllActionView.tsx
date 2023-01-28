import { Grid, Box, TextField, InputAdornment } from "@mui/material"
import { ReactQueryWrapper } from "../../../common/components/ReactQueryWrapper"
import useFetchActionDefinitions from "../../../common/components/workflow/create/hooks/useFetchActionDefinitions"
import SearchIcon from '@mui/icons-material/Search';
import ActionDefinitionActionType from "../../../enums/ActionDefinitionActionType";
import React from "react";
import { ActionDefinitionDetail } from "../../../generated/interfaces/Interfaces";
import AddActionCard from "./AddActionCard";

interface AddingActionActionViewProps {
    onAddAction: (actionToAdd: ActionDefinitionDetail, actionReferenceName?: string) => void
}

const AddingAllActionView = ({onAddAction}: AddingActionActionViewProps) => {

    const [actionDefinitionNameSearchQuery, setActionDefinitionNameSearchQuery] = React.useState<string>("")

    const [allActionDefinitionsData, allActionDefinitionsIsLoading, allActionDefinitionsError] = useFetchActionDefinitions({filter: {IsVisibleOnUI: true}})

    const filteredActionDefinitions = allActionDefinitionsData?.filter?.(actionDefinition => actionDefinition.ActionDefinition?.model?.ActionType !== ActionDefinitionActionType.AUTO_FLOW)?.filter(actionDefinition => actionDefinition?.ActionDefinition?.model?.UniqueName?.toLocaleLowerCase()?.includes(actionDefinitionNameSearchQuery.toLocaleLowerCase())) || []

    return (
        <ReactQueryWrapper isLoading={allActionDefinitionsIsLoading} error={allActionDefinitionsError} data={allActionDefinitionsData}>
            {() => (
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 1, mt:1}}>
                    <TextField
                        id="input-with-icon-textfield"
                        placeholder="Search action..."
                        value={actionDefinitionNameSearchQuery}
                        onChange={(event) => {setActionDefinitionNameSearchQuery(event.target.value)}}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon/>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            width: "100%"
                        }}
                        variant="outlined"
                    />
                    <Grid container spacing={3} sx={{mt:1}}>
                        {filteredActionDefinitions?.map(actionDefinitionDetail => (
                            <Grid item xs={12} sm={6} md={4}>
                                <AddActionCard actionDefinitionDetail={actionDefinitionDetail} handleAdd={onAddAction}/>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </ReactQueryWrapper>
    )
}

export default AddingAllActionView