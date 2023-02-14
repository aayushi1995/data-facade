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
