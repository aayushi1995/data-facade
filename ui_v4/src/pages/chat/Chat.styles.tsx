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
    height:550px;
    max-height:550px;
    overflow:auto;
    &::-webkit-scrollbar {
        width: 0px;
    }
`
