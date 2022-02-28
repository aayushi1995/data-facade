import DashboardNavbar from './DashboardNavbar';
import { withDesign } from 'storybook-addon-designs'
import App from "../../../App";
import {RootComponent} from "../../../index";

export default {
    component: DashboardNavbar,
    title: 'DashboardNavbar',
    decorators: [withDesign],
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File',
        },
    }
};

// @ts-ignore
const Template = args => <RootComponent>
    <App>{(props)=>
        <div style={{width: 400}}>
            <DashboardNavbar {...{...args, ...props}}/>
        </div>}
    </App>
</RootComponent>;

export const Default = Template.bind({});
// @ts-ignore
Default.args = {
    title: 'RFM Modeling',
    description: 'lorem ipsum'
};
