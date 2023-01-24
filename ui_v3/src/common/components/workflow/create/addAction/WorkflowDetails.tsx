import { Box, Button, Grid, TextField, Typography ,DialogTitle ,IconButton ,} from "@mui/material"
import React, { useContext } from "react"
import { useHistory } from "react-router-dom"
import { APPLICATION_ROUTE } from "../../../../../../src/common/components/header/data/RoutesConfig"
import CloseIcon from "../../../../../../src/images/close.svg"
import { RouteContext } from "../../../../../layout/TabRenderer"
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

    const routes:any = useContext(RouteContext);
    const history = useHistory()
    const handleDialogClose = () => {
        if(routes.length > 0){
            const lastItem:any = routes[routes.length-1]
            history.push(lastItem['path'])
        }
        else{
            history.push(APPLICATION_ROUTE)
        }
        
    }
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
        <Box sx={{padding:'0px'}} >
            <DialogTitle sx={{display: 'flex', justifyContent: 'center',backgroundColor: "ActionConfigDialogBgColor.main", boxShadow: "inset 0px 15px 25px rgba(54, 48, 116, 0.3)"}}>
                    <Grid item xs={6} sx={{display: 'flex', alignItems: 'center'}}>
                        <Typography variant="heroHeader" sx={{
                            fontFamily: "'SF Pro Text'",
                            fontStyle: "normal",
                            fontWeight: 500,
                            fontSize: "18px",
                            lineHeight: "160%",
                            letterSpacing: "0.15px",
                            color: "ActionCardBgColor.main"}}
                        >
                            Create Flow
                        </Typography>
                    </Grid>
                    <Grid item xs={6} style={{display: 'flex', justifyContent: 'flex-end'}} >
                        <IconButton onClick={handleDialogClose}>
                            <img src={CloseIcon} alt="close"/>
                        </IconButton>
                    </Grid>
            </DialogTitle>
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
        </Box>
    )
}

export default WorkflowDetails