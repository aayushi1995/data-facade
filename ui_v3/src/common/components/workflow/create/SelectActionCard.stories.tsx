import { Box } from "@material-ui/core";
import { Story } from "@storybook/react";
import SelectActionCard, {SelectActionCardProps} from "./SelectActionCard";

export default {
    title: "Workflow/Create/SelectActionCard",
    component: SelectActionCard
}


const Template: Story<SelectActionCardProps> = (args) => <Box sx={{}}><SelectActionCard {...args} /></Box>


export const DefaultView = Template.bind({});
DefaultView.args = {
    actionName: "Amazing Action",
    actionDescription: "This Amazing Action was created by an amazing Author and has amazing tags.",
    actionTags: ["Amazing Tag 1", "Amazing Tag 2", "Amazing Tag 3", "Amazing Tag 4"],
    actionIcon: "ok",
    onAddAction: (event) => console.log("Added to stage")
}
