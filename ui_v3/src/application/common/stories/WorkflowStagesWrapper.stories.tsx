import { Box } from "@mui/material";
import { Story } from "@storybook/react";
import React from "react";
import { withDesign } from 'storybook-addon-designs';
import { v4 as uuidv4 } from 'uuid';
import WorkflowStagesWrapper, { WorkflowStagesWrapperProps } from "../../../pages/applications/workflow/components/WorkflowStagesWrapper";

export default{
    title: "WORKFLOW/Stages/WorkflowStagesWrapper",
    component: WorkflowStagesWrapper,
    decorators: [withDesign],
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/CyosX2UsPUoIbt48of5tIz/Data-Facade-V0?node-id=251%3A15466',
        },
    }
}

const Template: Story<WorkflowStagesWrapperProps> = (args) => {
    const [stages, setStages] = React.useState(args.stages)

    React.useEffect(() => {
        setStages(args.stages)
    }, [args.stages])


    const onStagesChange = (stages: any) => {
        console.log(stages)
        setStages(stages)
    }


    return <Box>
        <WorkflowStagesWrapper {...{...args, onStagesChange: onStagesChange, stages: stages}} /></Box>;
}

export const HappyHappyFlow = Template.bind({})

HappyHappyFlow.args = {
    numberOfStages: 4,
    maxWidthInPixel: 300,
    stages: [
        {
            stageId: uuidv4(),
            stageName: "Stage 1", 
            isDisabled: false, 
            percentageCompleted: 1, 
            failed: false, 
            showDetails: true, 
            numberOfActions: 1, 
            totalRunTime: "835s"
        },
        {
            stageId: uuidv4(),
            stageName: "Data Preparations 2 Randy Orton", 
            isDisabled: false, 
            percentageCompleted: 1, 
            failed: false, 
            showDetails: true, 
            numberOfActions: 1, 
            totalRunTime: "835s"
        },
        {
            stageId: uuidv4(),
            stageName: "Data Preparations 3 John Cena", 
            isDisabled: false, 
            percentageCompleted: 1, 
            failed: false, 
            showDetails: true, 
            numberOfActions: 1, 
            totalRunTime: "835s"
        },
        {
            stageId: uuidv4(),
            stageName: "Data Preparations 4 Kane", 
            isDisabled: false, 
            percentageCompleted: 1, 
            failed: false, 
            showDetails: true, 
            numberOfActions: 1, 
            totalRunTime: "835s"
        },
    ]
};