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

export const StyledActionOutputFooter = styled.div<any>`
    background-color:  ${props => props.isBot ? "#FFFBEB" : "#edffeb"};
    display:flex;
    color: black;
    display:flex;
    justify-content: space-between;
    padding:10px;
    width:100%;
`

export const StyledIcon = styled.span`
    display:flex;
    justify-content: space-between;
    min-width:300px;
    
`

export const AnimateContainer = styled.div<any>`
    opacity: 0;
    transform: translateX(-10%);
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
    ${props => props.show && {
        opacity: '1',
        transform: 'translateX(0)'
    }};
    
`

export const StyledUpdatedBy = styled.div`
    display:flex;
    display: flex;
    width: 300px;
    margin: 10px;
    align-items: center;
    justify-content: space-evenly;

`