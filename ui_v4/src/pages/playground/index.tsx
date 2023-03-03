import { PlaygroundWrapper } from "./Playground.styles"
import { useState } from "react";
import DraggableSlider from "@/components/DraggableSlider";
import {IconStack} from './constants'
import LeftChildEditor from "./LeftChildEditor";
import { ChatProvider } from '@contexts/ChatContext/index';

const Playground = () => {
    const [size, setSize] = useState<number[]>([96,3])
    const [visibleTab, setVisibleTab] = useState<string>('playground')
  
    const handleTabClick = (value:string) => {
        if(value === 'playground') {
            setSize([100,3])
            setVisibleTab('playground')
        } else if (value === 'database'){
            setSize([60,40])
            setVisibleTab('database')
        } else if (value === 'actionrun') {
            setSize([60,40])
            setVisibleTab('actionrun')
        }

    }

    return (
        <ChatProvider>
            <PlaygroundWrapper>
                <DraggableSlider 
                    size={[...size]}
                    leftChild={<LeftChildEditor/>}
                    rightChild={
                        <RightPanel visibleTab={visibleTab}/>
                    }
                    iconStack={IconStack(handleTabClick)}
                    activeTab={visibleTab}
                    />
            </PlaygroundWrapper>
        </ChatProvider>
        
    )
}

export default Playground


const RightPanel = ({visibleTab}:any) => {
    return (
        <div style={{padding:'20px'}}>
            {visibleTab === "actionrun" ? <div> Action run </div> : <div>Data Source run </div>}
        </div>
    )
}