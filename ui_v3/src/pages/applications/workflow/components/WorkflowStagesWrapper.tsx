import { Box, Collapse } from "@mui/material";
import React from "react";
import { TransitionGroup } from 'react-transition-group';
import { v4 as uuidv4 } from 'uuid';
import { SetWorkflowContext, WorkflowActionDefinition } from "../context/WorkflowContext";
import WorkflowStage, { WorkflowStageProps } from "./WorkflowStage";
// import './WorkflowStagesWrapper.css'

export interface WorkflowStagesWrapperProps {
    maxWidthInPixel?: number
    fromAddActionsView?: boolean
    numberOfStages?: number
    selectedStage?: {
        stageId: string,
        stageName: string
    },
    allowEdit?: boolean
    stages: {
        stageId: string
        stageName: string
        numberOfActions?: number
        totalRunTime?: string
        isDisabled?: boolean
        showDetails?: boolean
        failed?: boolean
        completed?: boolean
        percentageCompleted?: number
    }[]
    onAddStage?: (e: {Id: string, Name: string, Actions: WorkflowActionDefinition[]}, stageId?: string) => void
    onDeleteStage?: (stageId: string) => void,
    percentageWidth?: string
}

const WorkflowStagesWrapper = (props: WorkflowStagesWrapperProps) => {
    const setWorkflowContext = React.useContext(SetWorkflowContext)
    var color1 = '#7efa73'
    var color2 = '#f29d9d'
    var color = 'rgba(238, 238, 255, 1)'
    var color3 = '#faf8c8'
    const workflowStages: any = props.stages.map((stage, index) => {
        color = index%2===1 ? 'rgba(238, 238, 255, 1)' : 'rgba(166, 206, 227, 1)'
        color1 = index%2===1 ? '#7efa73' : '#d5fcd2'
        color2 = index%2===1 ? '#f29d9d' : '#fc586e'
        color3 = index%2=== 1? '#faf8c8' : '#d1cd64'
        const cardButton: string = (index !== props?.stages?.length-1 ) ? 'minus' : 'plus'
        return {
            stageCompleted: stage.completed || false,
            color: (props.allowEdit || props.fromAddActionsView)? color:(stage.completed?(stage.failed?color2:color1):color3),
            showDetails: !props.allowEdit && !props.fromAddActionsView,
            cardButton: cardButton,
            numberOfActions : props.stages[index].numberOfActions,
            totalRunTime: props.stages[index].totalRunTime,
            stageFailed: stage.failed || false,
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
            <Box sx={{ display: 'flex', flexGrow: 1, flexShrink: 1, overflowX: 'clip', overflowY: 'hidden', height: "100%"}} p={1} pl={2}>
                <TransitionGroup style={{display: 'flex', flexGrow: 1, flexShrink: 1, overflowX: 'clip', overflowY: 'hidden', height: "100%"}}>
                    {workflowStages.map((stage: WorkflowStageProps, index: number) => 
                        <Collapse key={stage.stageId} sx={{ 
                            width: props.percentageWidth ? props.percentageWidth: (props.selectedStage?.stageId===stage.stageId || props.selectedStage?.stageId===undefined) ? "24.5%": "10%", 
                            height: "100%", 
                            "& .MuiCollapse-wrapper": { height: "100%"}, 
                            "& .MuiCollapse-wrapperInner": { height: "100%"}
                        }}>
                            <WorkflowStage {...
                                {...stage, 
                                selectedStageId: props.selectedStage?.stageId, 
                                allowEdit: props.allowEdit,
                                handleDeleteStage: handleDeleteStage,
                                handleAddStage: handleAddStage, 
                                fromAddActions: props.fromAddActionsView,
                                setSelectedStage: setSelectedStage,
                                
                                }}/>
                        </Collapse>
                    )}
                </TransitionGroup>
            </Box>
    )
}

export default WorkflowStagesWrapper
