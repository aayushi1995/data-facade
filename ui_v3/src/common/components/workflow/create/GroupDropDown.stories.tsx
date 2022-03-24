// @ts-nocheck

import { Box } from "@mui/material";
import { Story } from "@storybook/react";
import GroupDropDown, {GroupDropDownProps} from "./GroupDropDown";

export default {
    title: "Workflow/Create/GroupDropDown",
    component: GroupDropDown
}


const Template: Story<GroupDropDownProps> = (args) => <Box sx={{}}><GroupDropDown {...args} /></Box>


export const DefaultView = Template.bind({});
DefaultView.args = {
    groupName: "Data Cleaning And Wrenching",
    actionCount: 4,
    actions: [
        {
            actionId: "1",
            actionName: "Amazing Action 1",
            actionDescription: "This Amazing Action was created by an amazing Author and has amazing tags.",
            onAddAction: (ad) => console.log(ad)
        },
        {
            actionId: "2",
            actionName: "Amazing Action 2",
            actionDescription: "This Amazing Action was created by an amazing Author and has amazing tags.",
            onAddAction: (ad) => console.log(ad)
        },
        {
            actionId: "3",
            actionName: "Amazing Action 3",
            actionDescription: "This Amazing Action was created by an amazing Author and has amazing tags.",
            onAddAction: (ad) => console.log(ad)
        },
        {
            actionId: "4",
            actionName: "Amazing Action 4",
            actionDescription: "This Amazing Action was created by an amazing Author and has amazing tags.",
            onAddAction: (ad) => console.log(ad)
        }
    ]
}
