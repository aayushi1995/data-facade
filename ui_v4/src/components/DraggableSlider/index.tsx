
import ReactSplit from '@devbookhq/splitter';
import DraggableSliderTab from './DraggableSliderTab';
import {DraggableSliderWrapper, SliderFlexBox } from './DraggableSlider.styles'


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
                <SliderFlexBox>
                    <DraggableSliderTab iconStack={iconStack} activeTab={activeTab}/> 
                    {rightChild}
                </SliderFlexBox>
            </ReactSplit>
        </DraggableSliderWrapper>
    )
}


export default DraggableSlider