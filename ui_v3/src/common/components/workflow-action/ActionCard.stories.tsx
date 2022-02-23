import { Box } from "@mui/material";
import { Story } from "@storybook/react";
import ActionCard, { ActionCardProps } from './ActionCard'

export default {
    title: "WORKFLOW/Workflow Action Card",
    component: ActionCard
}

const Template: Story<ActionCardProps> = (args) => <Box sx={{width: 300, height: '50px'}}><ActionCard {...args} /></Box>

export const SingleCard = Template.bind(({}))
export const RowsEffected = Template.bind(({})) 
export const CardOnCompletions = Template.bind({})
SingleCard.args = {
    actionName: "Test Action",
    actionGroup: "Data Cleansing",
    displayRowsEffected: false,
    isComplete: false,
    isCardSelected: true
}

RowsEffected.args = {
    actionName: "Test Action",
    actionGroup: "Data Cleansing",
    displayRowsEffected: true,
    isComplete: false,
    rowsEffected: 1000
}

CardOnCompletions.args = {
    actionName: "Test Action",
    actionGroup: "Data Cleansing",
    displayRowsEffected: true,
    isComplete: true,
    rowsEffected: 1000
}

