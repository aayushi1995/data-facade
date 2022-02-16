import {ThemeToggle} from './ThemeToggle';
import { withDesign } from 'storybook-addon-designs'

export default {
    component: ThemeToggle,
    title: 'ThemeToggle',
    decorators: [withDesign],
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File',
        },
    }
};

const Template = args => <ThemeToggle {...args} />;

export const Default = Template.bind({});
Default.args = {
    task: {
        id: '1',
        title: 'Test ThemeToggle',
        state: 'ThemeToggle',
        updatedAt: new Date(2021, 0, 1, 9, 0),
    },
};
