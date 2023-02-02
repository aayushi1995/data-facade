// @ts-nocheck

import { Box } from "@mui/material";
import { Story } from "@storybook/react";
import React from "react";
import { ActionCardProps } from "../components/ActionCard";
import WorkflowActionContainer, { WorkflowActionContainerProps } from "../WorkflowActionContainer";


export default {
    title: "WORKFLOW/Workflow Actions Container",
    component: WorkflowActionContainer
}

const Template: Story<WorkflowActionContainerProps> = (args) => {
    const [actions, setActions] = React.useState(args.Actions)

    const onActionListChange = (e: ActionCardProps[]) => {
        setActions(e)
        console.log(e)
    }

    React.useEffect(() => {
        setActions(args.Actions)
    }, [args.Actions])

    return (
        <Box sx={{ display: 'flex', width: "400px", maxHeight: "600px"}}>
            <WorkflowActionContainer Actions={actions} onActionListChange={onActionListChange} />
        </Box>)
}

export const BuildingWorkflow = Template.bind({});

var actions = [{
                actionId: "Id1",
                actionName: "name1",
                actionGroup: "Data Ceansing",
                isComplete: false,
                displayRowsEffected: false,
                deleteButtonAction: ((e) => {})
            },
            {
                actionId: "Id2",
                actionName: "name2",
                actionGroup: "Data Ceansing",
                isComplete: false,
                displayRowsEffected: false,
                deleteButtonAction: ((e) => {})
            },
            {
                actionId: "Id3",
                actionName: "name3",
                actionGroup: "Data Ceansing",
                isComplete: false,
                displayRowsEffected: false,
                deleteButtonAction: ((e) => {}),
                isCardSelected: true
            },
            {
                actionId: "Id4",
                actionName: "name4",
                actionGroup: "Data Ceansing",
                isComplete: false,
                displayRowsEffected: false,
                deleteButtonAction: ((e) => {})
            },
            {
                actionId: "Id5",
                actionName: "name5",
                actionGroup: "Data Ceansing",
                isComplete: false,
                displayRowsEffected: false,
                deleteButtonAction: ((e) => {})
            },
            {
                actionId: "Id6",
                actionName: "name6",
                actionGroup: "Data Ceansing",
                isComplete: false,
                displayRowsEffected: false,
                deleteButtonAction: ((e) => {})
            },
            {
                actionId: "Id7",
                actionName: "name7",
                actionGroup: "Data Ceansing",
                isComplete: false,
                displayRowsEffected: false,
                deleteButtonAction: ((e) => {})
            }]

BuildingWorkflow.args = {
    stageName: 'preprocess',
    Actions: actions,
    onActionListChange: ((x) => {
        console.log("here")
    })
}


