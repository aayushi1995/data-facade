import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { withDesign } from 'storybook-addon-designs';
import App from "../../../App";
import { RootComponent } from "../../../index";
import { SetModuleContextType } from "./data/ModuleContext";
import { ModuleSwitcher } from './ModuleSwitcher';

export default {
    component: ModuleSwitcher,
    title: 'ModuleSwitcher',
    decorators: [withDesign],
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File',
        },
    }
};

function ModuleSwitcherWrapper(props: { args: any, props: any }) {
    const {push} = useHistory();
    useEffect(()=>{
        push('/data/connections/column');
    },[]);
    return <div style={{display: "flex", width: "100%"}}>
        <ModuleSwitcher {...{...props.args, ...props.props}}/></div>;
}

// @ts-ignore
const Template = args => {
    return <RootComponent>
        <App>{(props) =><ModuleSwitcherWrapper args={args} props={props}/>
        }
        </App>
    </RootComponent>;
}

export const Default = Template.bind({});
const handleTabChange: SetModuleContextType = (module)=>{
    return null;
}

// @ts-ignore
Default.args = {
    handleTabChange: (event: any)=>alert(event.index)
};
