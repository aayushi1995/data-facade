import { Box, Button, Checkbox, FormControlLabel, FormGroup, TextField, Typography, Autocomplete } from "@mui/material"
import React from "react"
import { Link } from "react-router-dom"
import DropDown from "../../../../src/images/new_frame.png"
import ActionDefinitionActionGroups from "../../../enums/ActionDefinitionActionGroups"
import ActionDefinitionPublishStatus from "../../../enums/ActionDefinitionPublishStatus"
import { Application } from "../../../generated/entities/Entities"
import { SetWorkflowContext, WorkflowContext } from "../../../pages/applications/workflow/WorkflowContext"
import LoadingWrapper from "../LoadingWrapper"
import useGetApplications from "./edit/hooks/useGetApplications"

interface WorkflowButtonOptionProps {
    handleSave?: () => void
    handleRun?: () => void
}

const WorkflowButtonOptions = (props: WorkflowButtonOptionProps) => {

    const workflowContext = React.useContext(WorkflowContext)
    const setWorkflowContext = React.useContext(SetWorkflowContext)

    const [applications, isLoading, error] = useGetApplications({filter: {}})
    const handlePinToDashboardChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWorkflowContext({type: 'SET_PINNED_TO_DASHBOAD', payload: event.target.checked})
    }
    const handleReadyToRunChange = (event: React.ChangeEvent<HTMLInputElement>) => {    
        if(event.target.checked) {
            setWorkflowContext({type: 'SET_PUBLISHED_STATUS', payload: ActionDefinitionPublishStatus.READY_TO_USE})
        } else {
            setWorkflowContext({type: 'SET_PUBLISHED_STATUS', payload: ActionDefinitionPublishStatus.DRAFT})
        }
    }

    const handleActionGroupChange = (actionGroup?: string) => {
        setWorkflowContext({type: 'SET_ACTION_GROUP', payload: actionGroup})
    }

    const handleApplicationChange = (application?: Application) => {
        setWorkflowContext({type: 'SET_APPLICATION_ID', payload: application?.Id})
    }

    const handleSave = () => {
        props.handleSave?.()
    }
    const handleRun = () => {
        props.handleRun?.()
    }

    const groupsDictonary: {[key: string]: string} = ActionDefinitionActionGroups

    return (
        <Box sx={{display: 'flex', gap: 1, minWidth: '100%'}}>
            <FormGroup>
                <FormControlLabel control={<Checkbox checked={workflowContext.PinnedToDashboard} onChange={handlePinToDashboardChange}/>} label="Pin To Dashboard"/>
                <FormControlLabel control={<Checkbox checked={workflowContext.PublishStatus === ActionDefinitionPublishStatus.READY_TO_USE} onChange={handleReadyToRunChange}/> } label="Ready to run"/>
            </FormGroup>
            <Box sx={{display: 'flex', gap: 1, flexDirection: 'column', minWidth: '100%'}}>
                <Box sx={{display: 'flex', gap: 1, minWidth: '100%'}}>
                    <Button variant="contained" size="small" onClick={handleSave}>Save</Button>
                    <Autocomplete
                        options={Object.entries(groupsDictonary).map(([groupKey, groupName]) => groupName)}
                        renderInput={(params) => <TextField {...params} label="Add to Group" />}
                        filterSelectedOptions
                        fullWidth
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        value={workflowContext.ActionGroup}
                        onChange={(event, value, reason, details) => {
                            handleActionGroupChange(value ?? undefined)
                        }}
                    />
                </Box>
                <Box sx={{display: 'flex', gap: 1}}>
                    <Button variant="contained" size="small" disabled={workflowContext.PublishStatus !== ActionDefinitionPublishStatus.READY_TO_USE} onClick={handleRun}>
                        Run
                    </Button>
                    <LoadingWrapper
                        isLoading={isLoading}
                        error={error}
                        data={applications}
                    >
                        <Autocomplete
                            options={applications}
                            getOptionLabel={(application: Application) => application.Name || "Name NA"}
                            renderInput={(params) => <TextField {...params} label="Add to Application" />}
                            filterSelectedOptions
                            fullWidth
                            selectOnFocus
                            clearOnBlur
                            handleHomeEndKeys
                            value={applications.find(app => app.Id === workflowContext.ApplicationId)}
                            onChange={(event, value, reason, details) => {
                                handleApplicationChange(value ?? undefined)
                            }}
                        />
                    </LoadingWrapper>
                </Box>
            </Box>
            
        </Box>
    )
}

export default WorkflowButtonOptions