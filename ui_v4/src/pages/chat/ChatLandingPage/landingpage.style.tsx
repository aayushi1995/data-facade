import { Button, Typography } from "antd";
import styled from "styled-components";

export const HeaderTypo = styled(Typography)`
font-style: normal;
font-weight: 600;
font-size: 24px;
line-height: 26px;
letter-spacing: 0.02em;
margin-bottom: 10px;
`

export const HeaderTextTypo = styled(Typography)`
font-style: normal;
font-weight: 400;
font-size: 16px;
line-height: 18px;
color: #6B7280;
`
export const ChatCreateButton = styled(Button)`
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
padding: 12px 16px;
gap: 8px;
width: 126px;
height: 44px;
background: #0770E3;
border-radius: 4px;
`
export const BtnText = styled(Typography)`
font-style: normal;
font-weight: 600;
font-size: 14px;
line-height: 18px;
text-align: center;
color: #FFFFFF;
`
export const InputStyle ={
    background: '#fff',
    border: '1px solid #E5E7EB',
    borderRadius: 2,
    height: '44px'
}