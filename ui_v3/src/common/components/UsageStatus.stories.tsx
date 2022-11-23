import React from 'react';
import { Story} from "@storybook/react";
import UsageStatus, {UsageStatusProp} from "./UsageStatus"


export default {
    title: "Elemental/UsageStatus",
    component: UsageStatus,
    argTypes: { onAvatarClick: { action: 'clicked' } }
}


const Template: Story<UsageStatusProp> = (args) => <UsageStatus {...args} />


export const InUseView = Template.bind({});
InUseView.args = {
    status: "In Use"
}

export const InDevelopmentView = Template.bind({});
InDevelopmentView.args = {
    status: "In Development"
}

export const InDraftView = Template.bind({});
InDraftView.args = {
    status: "Draft"
}
