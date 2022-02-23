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
    actionId: "1",
    actionName: "Amazing Action",
    actionDescription: "This Amazing Action was created by an amazing Author and has amazing tags.",
    onAddAction: (ad) => console.log(ad)
}
