import WorkflowStage, {WorkflowStageProps} from "../workflowStages/WorkflowStage";
import { withDesign } from 'storybook-addon-designs'
import { Story } from "@storybook/react";
import { Box } from "@material-ui/core";

export default{
    title: "WorkflowStage",
    component: WorkflowStage,
    decorators: [withDesign],
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/CyosX2UsPUoIbt48of5tIz/Data-Facade-V0?node-id=251%3A15466',
        },
    }
}
const Template: Story<WorkflowStageProps> = (args) => <Box sx={{width: 400}}><WorkflowStage {...args} /></Box>

export const HappyFlow = Template.bind({});

HappyFlow.args = {
    stageName: "Data Preparations sjadhsad  asd saasd", 
    isDisabled: false, 
    color: "blue", 
    percentageCompleted: 1, 
    cardButton: "minus", 
    failed: false, 
    showDetails: true, 
    numberOfActions: 21123, 
    totalRunTime: "835s"
};
