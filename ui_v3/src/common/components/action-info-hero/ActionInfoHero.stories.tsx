import React from 'react';
import { Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AlarmIcon from '@mui/icons-material/Alarm';
import {Meta, Story} from "@storybook/react";
import ActionInfoHero, {ActionInfoHeroProps} from './ActionInfoHero';


export default {
    title: "Hero/ActionInfoHero",
    component: ActionInfoHero
}

const Template: Story<ActionInfoHeroProps> = (args) => <Box><ActionInfoHero {...args} /></Box>


export const DefaultView = Template.bind({});
DefaultView.args = {
    name: "Amazing Action",
    createdBy: {name: "Amazing Author"},
    lastSyncTimestamp: new Date(),
    status: "In Development",
    outputType: "Table",
    avgRuntimeInS: 781263
} 