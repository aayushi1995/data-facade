import { Box, Button, FormControl, InputLabel, Select, TextField, Typography } from "@mui/material";
import React from "react";
import VirtualTagHandler, { VirtualTagHandlerProps } from "../../../../common/components/tag-handler/VirtualTagHandler";
import { Tag } from "../../../../generated/entities/Entities";
import { BuildApplicationWizardStepProps } from "../ApplicationCreationWizard";
import { BuildApplicationContext, SetBuildApplicationContext } from "../context/BuildApplicationContext";
import useCreateApplication from "../hooks/useCreateApplication";


const ConfigureAppDescriptionTags = (props: BuildApplicationWizardStepProps) => {
    const context = React.useContext(BuildApplicationContext)
    const setContext = React.useContext(SetBuildApplicationContext)
    const [description, setDescription] = React.useState(context.Application.Description)
    const createApplicationMutation = useCreateApplication({
        mutationOptions: {
            onMutate: () => setContext({ type: "CreatingApplication" }),
            onSettled: () => setContext({ type: "CreatingApplicationOver" }),
            onSuccess: () => {
                setContext({ type: "RefreshId" });
                props.onCreationComplete()
            }

        }
    })
    
    const setDescriptionInContext = () => {
        setContext({
            type: "SetApplicationDescription",
            payload: {
                newDescription: description
            }
        })
    }

    const onCreate = () => {
        createApplicationMutation.mutate({
            tags: context.Tags,
            application: context.Application
        })
    }

    const tagHandlerProps: VirtualTagHandlerProps = {
        selectedTags: context.Tags,
        onSelectedTagsChange: (newTags: Tag[]) => setContext({
            type: "SetApplicationTags",
            payload: {
                newTags: newTags
            }
        }),
        tagFilter: {},
        allowAdd: true,
        allowDelete: true,
        inputFieldLocation: "BOTTOM"
    }

    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 2, width: "100%", px: 5 , py:3}}>
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", gap: 2, flexGrow: 1}}>
                <Box sx={{width: "100%"}}>
                    <TextField onBlur={setDescriptionInContext} variant="outlined" label="App Description" value={description} onChange={(event => setDescription(event.target.value))} fullWidth/>
                </Box>
            </Box>
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1}}>
                <VirtualTagHandler {...tagHandlerProps}/>
            </Box>
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1}}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel>Select an option that resembles your App</InputLabel>
                        <Select
                            variant="outlined"
                            label="Select an option that resembles your App"
                            fullWidth
                            disabled
                        >
                        </Select>
                    </FormControl>
                </Box>
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 2}}>
                <Button variant="contained" onClick={() => onCreate()}>Create</Button>
            </Box>
        </Box>
    )
}

export default ConfigureAppDescriptionTags;