import { Card } from "antd";
import styled from "styled-components";


export const ActionCard = styled(Card)`
    border-radius: 0px 8px 8px 8px;
    border: 0.87659px solid #D1D5DB;
    margin-bottom:10px;
    & .ant-card-body {
        padding: 20px;
    }
`

export const StyledActionOutput = styled.div<any>`
    background-color:  ${props => props.isBot ? "#FFFBEB" : "#edffeb"};
    display:flex;
    color: black;
    display:inline-flex;
    padding:10px;
`

export const StyledIcon = styled.span`
    display:flex;
    justify-content: space-between;
    min-width:300px;
    
`