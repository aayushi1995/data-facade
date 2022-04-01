import { Card , Grid , Typography, Box, TextField, Button} from "@mui/material"
import React from "react"
import { SetWorkflowContext, WorkflowContext } from "../../../../../pages/applications/workflow/WorkflowContext"

export interface WorkflowDetailsProps {
    onContinue?: () => void
}

const WorkflowDetails = (props: WorkflowDetailsProps) => {
    const setWorkflowContext = React.useContext(SetWorkflowContext)
    const [error, setError] = React.useState(true)
    const [name, setName] = React.useState("")
    const [description, setDescription] = React.useState("")

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value
        setName(name)
        if(name === "") {
            setError(true)
            return;
        }
        setWorkflowContext({type: 'CHANGE_NAME', payload: {newName: name}})
        setError(false)
    }

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const description = e.target.value
        setDescription(description)
        setWorkflowContext({type: 'CHANGE_DESCRIPTION', payload: {newDescription: description}})
    }

    const handleContinue = () => {
        // setWorkflowContext({type: 'SET_WORKFLOW_DETAILS', payload: {actionName: name, description: description}})
        props?.onContinue?.()
    }

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
                            <TextField value={name} error={error} label="Flow Name" sx={{minWidth: '30%'}} onChange={handleNameChange}></TextField>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <TextField value={description} label="description" multiline={true} sx={{minWidth: '30%'}} onChange={handleDescriptionChange}></TextField>
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