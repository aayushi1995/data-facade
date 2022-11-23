import {BaseCard} from './BaseCard.tsx';
import { withDesign } from 'storybook-addon-designs'
import App from "../../../App";
import {RootComponent} from "../../../index";

export default {
    component: BaseCard,
    title: 'BaseCard',
    decorators: [withDesign],
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File',
        },
    }
};

const Template = args => <RootComponent>
    <App>{(props)=>
        <div style={{width: 400}}><BaseCard {...{...args, ...props}}/></div>}
    </App>
</RootComponent>;

export const Default = Template.bind({});
Default.args = {
    title: 'RFM Modeling',
    description: 'lorem ipsum'
};
