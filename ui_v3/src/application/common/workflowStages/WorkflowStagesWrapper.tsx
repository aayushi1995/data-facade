import WorkflowStage, { WorkflowStageProps } from "./WorkflowStage";
import { Card, Box, Grid } from "@material-ui/core";
import { v4 as uuidv4 } from 'uuid'
import { WorkflowContextType, WorkflowActionDefinition } from "../../../pages/applications/workflow/WorkflowContext";
// import './WorkflowStagesWrapper.css'

export interface WorkflowStagesWrapperProps {
    maxWidthInPixel: number;
    numberOfStages?: number
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
    onAddStage?: (e: {Id: string, Name: string, Actions: WorkflowActionDefinition[]}) => void
    onDeleteStage?: (stageId: string) => void
    handleStageNameChange?: (stageId: string, stageName: string) => void
}

const WorkflowStagesWrapper = (props: WorkflowStagesWrapperProps) => {

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
            handleAddStage(1)
        }
    }

    const handleAddStage = (index?: number) => {
        const newStage = {
            Id: uuidv4(),
            Name: "Stage " + (index !== undefined ? index : ((props.numberOfStages === undefined) ? 1: props.numberOfStages + 1)),
            Actions: []
        }
        props.onAddStage?.(newStage)
    }

    return (
        <Card className="root" sx={{maxHeight: '100%', boxShadow: '-6.41304px -6.41304px 12.8261px #E3E6F0, 6.41304px 6.41304px 12.8261px 0.641304px #A6ABBD'}}>
            <Box sx={{ display: 'flex', flexGrow: 1, flexShrink: 1, overflowX: 'clip', overflowY: 'hidden'}} p={1} pl={2}>
                <Grid container >
                {workflowStages.map((stage: WorkflowStageProps, index: number) =>  
                    <Grid item xs={3} sx={{maxHeight: '100%', maxWidth: '24.55%'}}>
                        <WorkflowStage {...{...stage, handleDeleteStage: handleDeleteStage, handleStageNameChange: props.handleStageNameChange, handleAddStage: handleAddStage}}/>
                    </Grid>
                )}
                </Grid>
            </Box>
        </Card>
    )
}

export default WorkflowStagesWrapper