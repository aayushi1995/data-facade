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
    height: calc(100vh - 300px);
    &::-webkit-scrollbar {
        width: 0px;
    }
`

export const DeepDiveWrapperStyled = styled.div`
    height:100%;
    width: 100%;
`

export const ChatWrapperStyled = styled.div`
    position: relative;
    height:100%;
    width: 100%;
    // min-width:550px;
`
export const MainWrapper = styled.div`
    display:flex;
    position:relative;

    & div[dir="Horizontal"] {
        height: 80vh;
        background-color: transparent !important;
    }
    & div[dir="Horizontal"] ~ div {
        min-width: 50px !important;
    }
    & div[dir="Horizontal"] > div {
        background: #9CA3AF;
        position: relative;
        right: -25px;
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
    &:hover {
      cursor: pointer;
      background-color: #e7e7e7;
    }
`