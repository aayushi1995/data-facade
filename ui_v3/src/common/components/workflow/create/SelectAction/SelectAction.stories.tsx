import { Box } from "@material-ui/core";
import { Story } from "@storybook/react";
import SelectAction, {SelectActionProps} from "./SelectAction";

export default {
    title: "Workflow/Create/SelectAction",
    component: SelectAction
}


const Template: Story<SelectActionProps> = (args) => <Box sx={{}}><SelectAction {...args} /></Box>


export const DefaultView = Template.bind({});
DefaultView.args = {
    groups: [
        {groupName: "Group Name 1", actionCount: 5},
        {groupName: "Group Name 2", actionCount: 3},
        {groupName: "Group Name 3", actionCount: 9},
        {groupName: "Group Name 4", actionCount: 10},
        {groupName: "Group Name 5", actionCount: 7},
    ]
}
