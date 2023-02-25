import { Filename, FileNameContainer, FileSendBy, UploadFileContainer } from "./SenderPreview.styles"
import GsheetIcon from "@assets/icons/GSheet.svg"
import chevron_rightIcon from "@assets/icons/chevron_right.svg"
export type SenderPreviewProps = {
    fileName : String,
    sendBy : String
}

export const SenderPreview = (props:SenderPreviewProps)=>{
    return(
        <>
            <UploadFileContainer>
                <div>
                    <img src={GsheetIcon} alt="" />
                </div>
                <FileNameContainer>
                    <Filename>{props.fileName}</Filename>
                    <FileSendBy>{props.sendBy}</FileSendBy>
                </FileNameContainer>
                <div>
                    <img src={chevron_rightIcon} alt="" />
                </div>
            </UploadFileContainer>
        </>
    )
}