
import { Card, Typography } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import styled from 'styled-components';

export const StyledCard = styled(Card)`
 cursor:pointer;
 border-radius : 0px;
 height: 135px;
 pading:10px;
 &:hover { 
      box-shadow: 0 0 11px rgba(33,33,33,.2)
  }
`;

export const StyledTypo1 = styled(Typography)`
font-style: normal;
font-weight: 400;
font-size: 14px;
line-height: 15px;
color: #6B7280;
padding: 0px 0px 10px 0px;
margin-top:20px;
`

export const CardTitleTypo = styled(Typography)`
font-style: normal;
font-weight: 600;
font-size: 18px;
line-height: 20px;
letter-spacing: 0.02em;
text-transform: capitalize;
color: #081935;
margin-top:15px;
margin-bottom:15px;
`

export const CardDescTypo = styled(Paragraph)`
font-style: normal;
font-weight: 400;
font-size: 14px;
line-height: 22px;
color: #6B7280;
`