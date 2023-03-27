import { Card, Typography } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import styled from "styled-components";

interface CardProps {
    backgroundImage: string;
  }
  
export const StyledCardApp = styled(Card)<CardProps>`
cursor:pointer;
border-radius : 0px;
height: 190px;
background: linear-gradient(265.76deg, rgba(255, 255, 255, 0) -21.4%, #FFFFFF 51.08%),url(${props => props.backgroundImage});
background-repeat: no-repeat;
background-size: cover;
&:hover { 
      box-shadow: 0 0 11px rgba(33,33,33,.2)
  }
`

export const CardTitleTypo = styled(Typography)`
font-style: normal;
font-weight: 500;
font-size: 18px;
line-height: 10px;
letter-spacing: 0.02em;
text-transform: capitalize;
color: #081935;
margin-top:15px;
margin-bottom:15px;
`

export const CardDescTypo = styled(Paragraph)`
width: 221px;
font-style: normal;
font-weight: 400;
font-size: 14px;
line-height: 20px;
color: #6B7280;
`