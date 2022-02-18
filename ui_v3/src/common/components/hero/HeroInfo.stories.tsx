import React from 'react';
import { Box, IconButton } from '@material-ui/core';
import DeleteIcon from '@mui/icons-material/Delete';
import AlarmIcon from '@mui/icons-material/Alarm';import {Meta, Story} from "@storybook/react";
import HeroInfo, {HeroInfoProps} from "./HeroInfo"


export default {
    title: "Hero/Hero",
    component: HeroInfo,
    argTypes: { onAvatarClick: { action: 'clicked' } }
}


const Template: Story<HeroInfoProps> = (args) => <Box><HeroInfo {...args} /></Box>


export const DefaultView = Template.bind({});
DefaultView.args = {
    header: "Amazing Action",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam, incidunt vero, cum architecto similique aliquid obcaecati debitis hic odit mollitia voluptatum atque maxime a! Repellendus nisi inventore placeat animi iure.",
    author: "Amazing Author",
    lastUpdatedTimestamp: new Date(),
    buttons: [
    <IconButton>
        <DeleteIcon/>
    </IconButton>,
    <IconButton>
        <AlarmIcon/>
    </IconButton>,
    <IconButton>
        <DeleteIcon/>
    </IconButton>,
    ],
    onAvatarClick: (event) => console.log(event),
    onCardClick: (event) => console.log(event)
}

export const LongDescription = Template.bind({});
LongDescription.args = {
    header: "Amazing Action",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam, incidunt vero, cum architecto similique aliquid obcaecati debitis hic odit mollitia voluptatum atque maxime a! Repellendus nisi inventore placeat animi iure. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam, incidunt vero, cum architecto similique aliquid obcaecati debitis hic odit mollitia voluptatum atque maxime a! Repellendus nisi inventore placeat animi iure. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam, incidunt vero, cum architecto similique aliquid obcaecati debitis hic odit mollitia voluptatum atque maxime a! Repellendus nisi inventore placeat animi iure.",
    author: "Amazing Author",
    lastUpdatedTimestamp: new Date(),
    buttons: [
    <IconButton>
        <DeleteIcon/>
    </IconButton>
    ],
    onAvatarClick: (event) => console.log(event),
    onCardClick: (event) => console.log(event)
}

export const ManyButtons = Template.bind({});
ManyButtons.args = {
    header: "Amazing Action",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi consequuntur iure atque fugiat hic nisi. Assumenda quis sed, minima cupiditate sequi fugit aliquam. Tempora expedita quas animi praesentium tenetur minus.",
    author: "Amazing Author",
    lastUpdatedTimestamp: new Date(),
    buttons: [
    <IconButton>
        <DeleteIcon/>
    </IconButton>,
    <IconButton>
        <AlarmIcon/>
    </IconButton>,
    <IconButton>
        <DeleteIcon/>
    </IconButton>,
    <IconButton>
        <AlarmIcon/>
    </IconButton>,
    <IconButton>
        <DeleteIcon/>
    </IconButton>,
    <IconButton>
        <AlarmIcon/>
    </IconButton>,
    <IconButton>
        <DeleteIcon/>
    </IconButton>,
    <IconButton>
        <AlarmIcon/>
    </IconButton>,
    ],
    onAvatarClick: (event) => console.log(event),
    onCardClick: (event) => console.log(event)
}
