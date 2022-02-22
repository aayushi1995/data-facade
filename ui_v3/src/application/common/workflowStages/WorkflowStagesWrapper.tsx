import WorkflowStage, { WorkflowStageProps } from "./WorkflowStage";
import { Card, Box } from "@material-ui/core";
import { v4 as uuidv4 } from 'uuid'
// import './WorkflowStagesWrapper.css'

export interface WorkflowStagesWrapperProps {
    maxWidthInPixel: number;
    numberOfStages: number
    stages: {
        stageId: string
        stageName: string
        numberOfActions?: number
        totalRunTime?: string
        isDisabled: boolean
        showDetails: boolean
        failed?: boolean
        percentageCompleted?: number
    }[]
    onStagesChange?: (e: any) => void
}

const WorkflowStagesWrapper = (props: WorkflowStagesWrapperProps) => {
    var color = 'pink'
    const workflowStages: any = props.stages.map((stage, index) => {
        color = index%2===0 ? 'rgba(238, 238, 255, 1)' : 'rgba(166, 206, 227, 1)'
        const cardButton: string = (index !== props?.stages?.length-1 || props?.stages?.length === 1) ? 'minus' : 'plus'
        return {
            color: color,
            cardButton: cardButton,
            ...stage
        }
    })

    console.log(workflowStages)
    
    const handleDeleteStage = (stageId: string) => {
        const newActions = props.stages.filter(action => action.stageId !== stageId)
        // TODO: show pop-up to confirm delete and all it's actions
        props.onStagesChange?.(newActions)
    }

    const handleAddStage = (event: React.MouseEvent<HTMLButtonElement>) => {
        const newActions = [...props.stages]
        const newStage = {
            stageId: uuidv4(),
            stageName: "Stage " + (props.stages.length + 1),
            showDetails: false,
            isDisabled: false
        }
        newActions.push(newStage)
        props.onStagesChange?.(newActions)
    }

    const handleStageNameChange = (stageId: string, stageName: string) => {
        const newActions = props.stages.map(stage => {
            if(stage.stageId === stageId) {
                return {...stage, stageName: stageName}
            }
            else {
                return {...stage}
            }
        })

        props.onStagesChange?.(newActions)
    }

    return (
        <Card className="root" sx={{maxHeight: '100%'}}>
            <Box sx={{ display: 'flex', flexGrow: 1, flexShrink: 1, overflowX: 'auto', overflowY: 'hidden'}} p={1} pl={3}>
                {workflowStages.map((stage: WorkflowStageProps, index: number) =>  
                    <Box sx={{minWidth: '24%', maxWidth: '24%', maxHeight: '100%'}}>
                        <WorkflowStage {...{...stage, handleDeleteStage: handleDeleteStage, handleStageNameChange: handleStageNameChange, handleAddStage: handleAddStage}}/>
                    </Box>
                )}
            </Box>
        </Card>
    )
}

export default WorkflowStagesWrapper