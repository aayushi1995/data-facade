import styled from 'styled-components';
import { ReactComponent as SendIcon } from '../../../assets/icons/send.svg'
import { ReactComponent as DBConnectionIcon } from '../../../assets/icons/database.svg'
import { ReactComponent as UploadIcon } from '../../../assets/icons/upload.svg'
import { ReactComponent as FileReplaceIcon } from '../../../assets/icons/find_replace.svg'
import { Button, Card } from 'antd';


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
`;

export const StyledChatInputWrapper = styled.div`
    width:100%;
    display: flex;
    justify-content: center;
    align-items: center;    
`
export const StyledCardChartFooterWrapper = styled.div`
    display: block;
    position: fixed;
    bottom: 25px;
    width:100%;
    z-index:2;
    background-color:white;
    
    & > div {
        width:90%;
    }

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

export const ConnectionButton = styled(Button)`
    text-align:left;

`;
export const PopOverCard = styled(Card)`
    padding:0px;
    background:#F3F4F6;
    border: 0.5px solid #D1D5DB;
    box-shadow: 0px 4px 40px rgba(0, 0, 0, 0.05), 0px 2px 6px rgba(0, 0, 0, 0.15);
    border-radius:8px;
    margin-bottom:30px;
    z-index:1
    
`;