import { List } from 'antd'
import styled from 'styled-components'

export const ChatWrapper = styled.div`
    display:flex;
`
export const StyledPrivacyPolicyFooter = styled.div`
    font-size: 12px;
    padding: 10px;
    text-align:center;
`
export const MessageWrapper = styled.div`
    margin: 0 .6%;
    overflow-y: scroll;
    height: calc(100vh - 180px);
    &::-webkit-scrollbar {
        width: 0px;
    }
`

export const RightWrapperStyled = styled.div`
    height:100%;
    width: 100%;
    background-color:white;
    z-index:1
`

export const ChatWrapperStyled = styled.div`
    position: relative;
    height:100%;
    width: 100%;
    min-width: 800px;
`
export const MainWrapper = styled.div`
    display:flex;
    position:relative;

    & .Horizontal {
        overflow: inherit;
    }
    
    & div[dir="Horizontal"] {
        position: relative;
        width: 50px;
        right: -50px;
        height: 80vh;
        background-color: transparent !important;
    }
    & div[dir="Horizontal"] ~ div {
        min-width: 50px !important;
    }
    & div[dir="Horizontal"] > div {
        background: #9CA3AF;
        position: relative;
        right: 4px;
        border-radius: 0px;
    }

    & div[dir="Horizontal"] > div::before {
        content: "";
        display: block;
        height: 24px;
        width: 4px;
        position: relative;
        background: #9CA3AF;
        right: -8px;
    }
`

export const RecommendedActionsMainDiv = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 30vw;
`

export const RecommendedActionsMainListItem = styled(List.Item)`
    padding: 0px;
`
export const StyledListItem = styled.div`
    color: #0770E3;
    background: #FFFFFF;
    border: 1px solid #0770E3;
    border-radius: 8px;
    padding: 8px;
    &:hover {
      cursor: pointer;
      background-color: #e7e7e7;
    }
`

export const ButtonContainer = styled.div`
    gap:10px;
`

export const LoaderContainer = styled.div`
    margin-top:20px;
    margin-left:5px;
`
export const ChatinputContainer = styled.div`
max-width:300px;
margin-top:10px;
`