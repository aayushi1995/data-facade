import { Card, Typography } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import styled from "styled-components";

export const HeaderWelcm = styled.div`
 border-radius : 0px;
 border-radius: 0px 16px 16px 16px;
 background: #F3F4F6;
 display: flex;
flex-direction: row;
align-items: flex-start;
padding: 16px;
gap: 8px;
width: 350px;
height: 52px;
margin: 25px 0px 15px 0px;
`;

export const HeaderStyledTypo = styled(Typography)`
font-style: normal;
font-weight: 600;
font-size: 24px;
line-height: 20px;
`

export const TextTypo1 = styled(Typography)`
font-style: normal;
font-weight: 400;
font-size: 14px;
line-height: 22px;
color: #6B7280;
padding: 0px 0px 10px 0px;
`

export const TextTypo2 = styled(Typography)`
width:60%;
font-weight: 500;
font-size: 14px;
line-height: 15px;
letter-spacing: 0.02em;
text-transform: capitalize;
margin-top:1em;
`

export const ChatStyledCard = styled.div`
border-radius:0px;
height:45px;
border: 1px solid #D1D5DB;
padding: 0px 10px 0px 10px;
cursor : pointer;
`

export const ChatCardContainer = styled.div`
padding:0px 30px 35px 30px;
margin: 20px -30px 20px -30px;
border-bottom: 1px solid #D1D5DB;
`