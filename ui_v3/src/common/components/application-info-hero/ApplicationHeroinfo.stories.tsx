import React from 'react';
import { Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AlarmIcon from '@mui/icons-material/Alarm';
import {Meta, Story} from "@storybook/react";
import ApplicationHeroInfo, {ApplicationHeroInfoProps} from "./ApplicationHeroInfo"


export default {
    title: "Hero/ApplicationHeroInfo",
    component: ApplicationHeroInfo,
    argTypes: { onAvatarClick: { action: 'clicked' } }
}


const Template: Story<ApplicationHeroInfoProps> = (args) => <Box><ApplicationHeroInfo {...args} /></Box>


export const DefaultView = Template.bind({});
DefaultView.args = {
    applicationName: "Amazing Application",
    status: "In Use",
    createdBy: {name: "Amazing Author"},
    lastUpdatedTimestamp: new Date(),
    providers: [{name: "Databricks"}, {name: "Snowflake"}, {name: "Redshift"}, {name: "LocalDB"}],
    numberStats: [{label: "Datsets", value: 12}, {label: "Actions", value: 233}, {label: "Workflows", value: 220}],
    usedBy: [{name: "Anna Karenina"}, {name: "Jane Smith"}, {name: "Rick Gonzalez"}, {name: "Peter Medevic"}, {name: "Xiao Li"}, {name: "Anna Karenina"}, {name: "Jane Smith"}, {name: "Rick Gonzalez"}, {name: "Peter Medevic"}]
}

export const ManyStats = Template.bind({});
ManyStats.args = {
    applicationName: "Amazing Application",
    status: "In Use",
    createdBy: {name: "Amazing Author"},
    lastUpdatedTimestamp: new Date(),
    providers: [{name: "Databricks"}, {name: "Snowflake"}, {name: "Redshift"}, {name: "LocalDB"}],
    numberStats: [{label: "Datsets", value: 12}, {label: "Actions", value: 233}, {label: "Workflows", value: 220}, {label: "Dashboards", value: 120}, {label: "Predictions", value: 10}, {label: "Predictions", value: 10}, {label: "Predictions", value: 10}, {label: "Predictions", value: 10}, {label: "Predictions", value: 10}],
    usedBy: [{name: "Anna Karenina"}, {name: "Jane Smith"}, {name: "Rick Gonzalez"}, {name: "Peter Medevic"}, {name: "Xiao Li"}, {name: "Anna Karenina"}, {name: "Jane Smith"}, {name: "Rick Gonzalez"}, {name: "Peter Medevic"}]
}
