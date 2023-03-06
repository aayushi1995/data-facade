import { Typography } from 'antd'
import Input from 'antd/es/input'
import styled from 'styled-components'


export const StyledCustomInput = styled(Input)<any>`
    background-color:  #F3F4F6; 
    border-radius: 0px !important;

    & > .ant-input{
        height: 40px;
        background-color:  inherit;
        border-radius: 0px !important;
        font-size: 16px !important;
        padding-left:30px !important;
    }
`

export const SearchInputWrapper = styled.div`
    display:flex;
    align-items: center;    

    svg {
        position: relative;
        right: -29px;
        z-index: 2;
    }
`

export const ChatHistoryItems = styled.div`
    display: flex;
    padding: 10px 20px;
    align-items: center;
    justify-content: space-between;

`
export const StickyHeader = styled.div`
    position: sticky;
    top:0px;
    background-color:white;
    padding:20px 0px;
    z-index:1
`

export const StyledChatName = styled(Typography.Title)<any>`
    margin: 0px;
    padding-left: 30px;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 400px;
    overflow: hidden;
`