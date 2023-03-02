
import ReactSplit from '@devbookhq/splitter';
import DraggableSliderTab from './DraggableSliderTab';
import {DraggableSliderWrapper, FlexBox } from './DraggableSlider.styles'


// Index Type
export interface IPlayGround {
    size: number[]
    leftChild: JSX.Element
    rightChild: JSX.Element
    iconStack: IIconStack[]
    activeTab?:string
}

// types for chat experience
export interface IIconStack {
    id: string
    value:string
    icon: React.ReactElement,
    onClick: (activeTab?:string) => void
    isActive?: boolean
}


const DraggableSlider = ({size, leftChild, rightChild, iconStack, activeTab}:IPlayGround) => {
    return (
        <DraggableSliderWrapper>
            <ReactSplit initialSizes={[...size]}>
                {leftChild}
                <FlexBox>
                    <DraggableSliderTab iconStack={iconStack} activeTab={activeTab}/> 
                    {rightChild}
                </FlexBox>
            </ReactSplit>
        </DraggableSliderWrapper>
    )
}


export default DraggableSlider