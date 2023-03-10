import Avatar from "antd/es/avatar"
import { useEffect, useState } from "react"
import { AnimateContainer, StyledUpdatedBy } from "../ActionOutput.styles"

const ActionUpdatedByPopup = ({updatedBy}:any) => {
    // const [updatedBy, setUpdatedBy] = useState<string | undefined>(undefined)

    // useEffect(() => {
    //     if(chatContextActionData?.hasOwnProperty(actionDefiniton?.Id)){
    //         setUpdatedBy(chatContextActionData[actionDefiniton.Id])
    //     }
    // },[chatContextActionData])
    return (
       <AnimateContainer show={updatedBy}>
        
        {updatedBy && (
            <StyledUpdatedBy>
                <Avatar style={{ backgroundColor: '#0770E3', verticalAlign: 'middle' }} size="default" gap={5}>
                    {updatedBy?.charAt(0)}
                </Avatar>
                <div>Edited by {updatedBy}</div>
            </StyledUpdatedBy>
        )
       }
       </AnimateContainer>

    )
}
export default ActionUpdatedByPopup