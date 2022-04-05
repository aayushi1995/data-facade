import { Box, Button, Card, Grid, TextField, Typography } from "@mui/material"
import React from "react"
import { BuildActionContext, SetBuildActionContext } from "../../../../../pages/build_action/context/BuildActionContext"

export interface WorkflowDetailsProps {
    onContinue?: () => void
}

const WorkflowDetails = (props: WorkflowDetailsProps) => {
    const actionContext = React.useContext(BuildActionContext)
    const setActionContext = React.useContext(SetBuildActionContext)
    const [error, setError] = React.useState(true)
    const [name, setName] = React.useState<string|undefined>()
    const [description, setDescription] = React.useState<string|undefined>()

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setActionContext({type: 'SetActionDefinitionName', payload: {newName: name}})
    }

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setActionContext({type: 'SetActionDefinitionDescription', payload: {newDescription: description}})
    }

    const handleContinue = () => {
        props?.onContinue?.()
    }

    // Responsible for setting Error true if name is empty
    React.useEffect(() => {
        setError(name === "")
    }, [name])

    // Responsible for setting initial value of states from context
    React.useEffect(() => {
        setName(actionContext?.actionDefinitionWithTags?.actionDefinition?.UniqueName || "")
        setDescription(actionContext?.actionDefinitionWithTags?.actionDefinition?.Description || "")
    }, [])

    return (
        <Grid container rowSpacing={12}>
            <Grid item xs = {12}>
                <Card sx={{width: '100%', display: 'block' , fontWeight: 'normal', borderRadius: '10px 10px 0px 0px', p: 2}}>
                    <Typography>
                        Create Flow
                    </Typography>
                </Card>
            </Grid>
            <Grid item xs = {12}>
                <Grid container rowSpacing={2} justifyContent='center' alignItems='center'>
                    <Grid item xs={12}>
                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <Typography sx={{fontSize: '25px', fontWeight: 'lighter', fontStyle: 'normal'}}>
                                Create Flow
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <TextField value={name} error={error} label="Flow Name" sx={{minWidth: '30%'}} onChange={(event) => setName(event.target.value)} onBlur={handleNameChange}></TextField>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <TextField value={description} label="description" multiline={true} sx={{minWidth: '30%'}} onChange={(event) => {setDescription(event.target.value)}} onBlur={handleDescriptionChange}></TextField>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <Button variant="contained" disabled={error} onClick={handleContinue}>Continue</Button>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default WorkflowDetails