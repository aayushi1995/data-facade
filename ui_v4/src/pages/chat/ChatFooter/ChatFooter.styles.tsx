import styled from 'styled-components';
import { Card } from 'antd';
import { ReactComponent as SendIcon } from '../../../assets/icons/send.svg'
import { ReactComponent as DBConnectionIcon } from '../../../assets/icons/database.svg'
import { ReactComponent as UploadIcon } from '../../../assets/icons/upload.svg'
import { ReactComponent as FileReplaceIcon } from '../../../assets/icons/find_replace.svg'


export const ChatInput = styled.input`
    background: #FFFFFF;
    border: 1px solid #D1D5DB;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0px 24px;
    font-size: 18px;
    color: #111827;
    width: 100%;
    height: 56px;

    &:focus{
        border: 1px solid #111827;
    }
`;

export const StyledChatInputWrapper = styled.div`
    width:100%;
    display: flex;
    justify-content: center;
    align-items: center;    
`
export const StyledCardChartFooterWrapper = styled(Card)`
    display: block;
    position: sticky;
    bottom: 0px;
    background-color: #F3F4F6;
    padding: 50px;
`
export const StyledSendIcon = styled(SendIcon)`
    position: relative;
    left: -40px;
    cursor:pointer;
`

export const ChatFooterButtonWrapper = styled.div`
    & > * {
        display:block;
        cursor:pointer;
    }
    display: flex;
    width: 200px;
    justify-content: space-around;
    align-items: center;
`

export const StyledDBConnectionIcon = styled(DBConnectionIcon)`
    display:block;
`
export const StyledUploadIcon = styled(UploadIcon)`
    display:block;
`

export const StyledFileReplaceIcon = styled(FileReplaceIcon)`
    display:block;
`

export const FlexBox = styled.div`
    display:flex;
`