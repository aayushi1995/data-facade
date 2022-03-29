import WorkflowStage, { WorkflowStageProps } from "./WorkflowStage";
import { Card, Box, Grid, Button, IconButton, Collapse, formLabelClasses } from "@mui/material";
import { v4 as uuidv4 } from 'uuid'
import { WorkflowContextType, WorkflowActionDefinition, SetWorkflowContext } from "../../../pages/applications/workflow/WorkflowContext";
import CloseIcon from '@mui/icons-material/Close';
import { DialogContent } from "@mui/material";
import { TransitionGroup } from 'react-transition-group';
import React from "react";
import { lightShadows } from "../../../css/theme/shadows";
// import './WorkflowStagesWrapper.css'

export interface WorkflowStagesWrapperProps {
    maxWidthInPixel?: number
    fromAddActionsView?: boolean
    numberOfStages?: number
    selectedStage?: {
        stageId: string,
        stageName: string
    }
    stages: {
        stageId: string
        stageName: string
        numberOfActions?: number
        totalRunTime?: string
        isDisabled?: boolean
        showDetails?: boolean
        failed?: boolean
        percentageCompleted?: number
    }[]
    onAddStage?: (e: {Id: string, Name: string, Actions: WorkflowActionDefinition[]}, stageId?: string) => void
    onDeleteStage?: (stageId: string) => void
}

const WorkflowStagesWrapper = (props: WorkflowStagesWrapperProps) => {
    const setWorkflowContext = React.useContext(SetWorkflowContext)
    var color = 'pink'
    const workflowStages: any = props.stages.map((stage, index) => {
        color = index%2===1 ? 'rgba(238, 238, 255, 1)' : 'rgba(166, 206, 227, 1)'
        const cardButton: string = (index !== props?.stages?.length-1 ) ? 'minus' : 'plus'
        return {
            color: color,
            cardButton: cardButton,
            ...stage
        }
    })

    // console.log(workflowStages)
    
    const handleDeleteStage = (stageId: string) => {
        // // TODO: show pop-up to confirm delete and all it's actions
        props.onDeleteStage?.(stageId)
        if(props.numberOfStages === 1) {
            const newStage = {
                Id: uuidv4(),
                Name: "Stage " + 1,
                Actions: []
            }
            props.onAddStage?.(newStage)
        }
    }

    const handleAddStage = (stageId?: string) => {
        console.log(props.numberOfStages)
        const newStage = {
            Id: uuidv4(),
            Name: "Stage " + ((props.numberOfStages || 0) + 1),
            Actions: []
        }

        props.onAddStage?.(newStage, stageId)
    }

    const setSelectedStage = (stageId: string) => {
        setWorkflowContext({type: 'CHANGE_CURRENT_SELECTED_STAGE', payload: {stageId: stageId}})
    }

    return (
        <Card sx={{ boxShadow: lightShadows[27], height: "100px" }}>
            <Box sx={{ display: 'flex', flexGrow: 1, flexShrink: 1, overflowX: 'clip', overflowY: 'hidden', height: "100%"}} p={1} pl={2}>
                <TransitionGroup style={{display: 'flex', flexGrow: 1, flexShrink: 1, overflowX: 'clip', overflowY: 'hidden', height: "100%"}}>
                    {workflowStages.map((stage: WorkflowStageProps, index: number) => 
                        <Collapse key={stage.stageId} sx={{ 
                            width: (props.selectedStage?.stageId===stage.stageId || props.selectedStage?.stageId===undefined) ? "24.5%": "10%", 
                            height: "100%", 
                            "& .MuiCollapse-wrapper": { height: "100%"}, 
                            "& .MuiCollapse-wrapperInner": { height: "100%"}
                        }}>
                            <WorkflowStage {...
                                {...stage, 
                                selectedStageId: props.selectedStage?.stageId, 
                                handleDeleteStage: handleDeleteStage,
                                handleAddStage: handleAddStage, 
                                fromAddActions: props.fromAddActionsView,
                                setSelectedStage: setSelectedStage
                                }}/>
                        </Collapse>
                    )}
                </TransitionGroup>
            </Box>
        </Card>
    )
}

export default WorkflowStagesWrapper
