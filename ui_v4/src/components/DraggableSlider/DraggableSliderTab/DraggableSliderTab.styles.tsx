import { Button } from 'antd'
import styled from 'styled-components'

export const StyledWrapper = styled.div`
    height: 85vh;
    right: 0px;
    background: #f3f4f6;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 50px;
`
export const CustomButton = styled<any>(Button)`
    width: 50px !important;
    border-radius: 0px;
    height: 50px;
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.isActive ? '#ffffff' : '#f3f4f6' };
`
