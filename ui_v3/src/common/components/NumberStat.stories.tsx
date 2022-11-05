import React from 'react';
import { Story} from "@storybook/react";
import NumberStat, {NumberStatProp} from "./NumberStat"


export default {
    title: "Elemental/NumberStat",
    component: NumberStat,
    argTypes: { onAvatarClick: { action: 'clicked' } }
}


const Template: Story<NumberStatProp> = (args) => <NumberStat {...args} />


export const DefaultView = Template.bind({});
DefaultView.args = {
    value: 120,
    label: "Datsets"
}