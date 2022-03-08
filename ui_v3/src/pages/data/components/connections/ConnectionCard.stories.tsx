import {ConnectionCard, ConnectionCardType} from './ConnectionCard';
import { withDesign } from 'storybook-addon-designs'
import App from "../../../../App";
import {RootComponent} from "../../../../index";
import {Meta, Story} from "@storybook/react";

export default {
    component: ConnectionCard,
    title: 'ConnectionCard',
    decorators: [withDesign],
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File',
        },
    }
};

const Template: Story<ConnectionCardType> = (args) => <RootComponent>
    <App>{(props)=>
        <div style={{width: 400}}><ConnectionCard {...{...args, ...props}}/></div>}
    </App>
</RootComponent>;

export const DefaultView = Template.bind({});
DefaultView.args = {
    Name: 'Google Analytics'
};
