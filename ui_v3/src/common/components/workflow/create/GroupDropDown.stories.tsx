import { Box } from "@material-ui/core";
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
            actionName: "Amazing Action 1",
            actionDescription: "This Amazing Action was created by an amazing Author and has amazing tags.",
            actionTags: ["Amazing Tag 1", "Amazing Tag 2", "Amazing Tag 3", "Amazing Tag 4"],
            actionIcon: "ok",
            onAddAction: (event) => console.log("Added to stage")
        },
        {
            actionName: "Amazing Action 2",
            actionDescription: "This Amazing Action was created by an amazing Author and has amazing tags.",
            actionTags: ["Amazing Tag 1", "Amazing Tag 2", "Amazing Tag 3", "Amazing Tag 4"],
            actionIcon: "ok",
            onAddAction: (event) => console.log("Added to stage")
        },
        {
            actionName: "Amazing Action 3",
            actionDescription: "This Amazing Action was created by an amazing Author and has amazing tags.",
            actionTags: ["Amazing Tag 1", "Amazing Tag 2", "Amazing Tag 3", "Amazing Tag 4"],
            actionIcon: "ok",
            onAddAction: (event) => console.log("Added to stage")
        },
        {
            actionName: "Amazing Action 4",
            actionDescription: "This Amazing Action was created by an amazing Author and has amazing tags.",
            actionTags: ["Amazing Tag 1", "Amazing Tag 2", "Amazing Tag 3", "Amazing Tag 4"],
            actionIcon: "ok",
            onAddAction: (event) => console.log("Added to stage")
        }
    ]
}
