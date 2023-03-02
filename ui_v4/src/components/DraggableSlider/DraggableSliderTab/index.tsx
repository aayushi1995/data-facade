
import { IIconStack } from '..'
import { StyledWrapper, CustomButton } from './DraggableSliderTab.styles'

const DraggableSliderTab = ({iconStack, activeTab}:{iconStack: IIconStack[], activeTab?:string}) => {
    return (
        <StyledWrapper>
            {iconStack?.map((obj:IIconStack, index:number) => 
                <CustomButton type="text" size='middle' icon={obj?.icon} onClick={() => obj?.onClick(obj?.value)} isActive={obj?.value === activeTab}/>
            )}
        </StyledWrapper> 
    )
}

export default DraggableSliderTab

