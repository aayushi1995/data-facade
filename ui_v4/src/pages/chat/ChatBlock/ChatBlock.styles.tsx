import styled from "styled-components"
import { IChatMessage } from "./ChatBlock.type"

export const ChatStyles = styled.div<IChatMessage>`
    display: flex;
    width:auto;
    max-width: 60vw;
    font-size: 18px;
    color: black;
    padding: 16px;
    font-weight:500;
    border-radius: ${props => props.from === "user" ? '16px 16px 0px 16px' : '0px 16px 16px 16px' }; 
    background-color: ${props => props.from === "user" ? '#E0F2FE' : '#F3F4F6;' };
`
export const ChatBlockWrapper = styled.div<IChatMessage>`
    display:flex;
    width:100%;
    justify-content: ${props => props.from === "user" ? 'flex-end' : 'flex-start' };
`
export const ChatMetaData = styled.div<IChatMessage>`
    display:flex;
    padding: 5px 0px;
    justify-content: ${props => props.from === "user" ? 'flex-end' : 'flex-start' };
`

export const StyledUserName = styled.span`
    font-size: 12px;
    font-weight:500;
    padding-right: 5px;
`
export const StyledTime = styled.span`
    font-size: 12px;
`