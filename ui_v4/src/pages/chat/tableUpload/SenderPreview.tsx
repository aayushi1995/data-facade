import { Filename, FileNameContainer, FileSendBy, UploadFileContainer } from "./SenderPreview.styles"
import GsheetIcon from "@assets/icons/GSheet.svg"
import chevron_rightIcon from "@assets/icons/chevron_right.svg"
export type SenderPreviewProps = {
    fileName : String,
}

export const SenderPreview = (props:SenderPreviewProps)=>{
    return(
        <>
            <UploadFileContainer>
                <div>
                    <img src={GsheetIcon} alt="" />
                </div>
                <FileNameContainer>
                    <Filename ellipsis={{rows:1}}>{props.fileName}</Filename>
                </FileNameContainer>
                <div>
                    <img src={chevron_rightIcon} alt="" />
                </div>
            </UploadFileContainer>
        </>
    )
}