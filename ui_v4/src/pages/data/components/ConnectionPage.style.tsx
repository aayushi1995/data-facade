import { Card, Typography } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import styled from "styled-components";

export const StyledConnectioncard = styled.div`
border: 1px solid #E5E7EB;
border-radius: 10px;
padding: 16px;
height: 216px;
`

export const StyledIconContainer = styled.div`
border: 0.5px solid #D1D5DB;
border-radius: 6px;
padding: 8px;
width: 40px;
height: 40px;
`

export const CardUniqeName = styled(Typography)`
font-style: normal;
font-weight: 600;
font-size: 18px;
line-height: 20px;
letter-spacing: 0.02em;
text-transform: capitalize;
color: #111827;
margin-top:6px;
`
export const CardDesc = styled(Paragraph)`
height: 50px;
font-style: normal;
font-weight: 400;
font-size: 14px;
line-height: 22px;
color: #6B7280;
margin-top:12px;
`

export const Paramheader = styled(Typography)`
font-style: normal;
font-weight: 600;
font-size: 14px;
line-height: 18px;
color: #374151;
`

export const ConnectorCardHeader = styled(Typography)`
font-style: normal;
font-weight: 500;
font-size: 18px;
line-height: 24px;
color: #111827;
`

export const NumTableDetails = styled(Typography)`
font-weight: 400;
font-size: 16px;
line-height: 18px;
text-align: left;
color: #4B5563;
`
export const ConnectionCard = styled(Card)`
width: 100%;
min-width:500px;
height: 230px;
background: #FFFFFF;
border: 1px solid #E5E7EB;
border-radius: 10px;
cursor: pointer;
&:hover {
  box-shadow: 0 0 8px rgba(0,128,255,1);; 
}
`
export const LastSyncMsg = styled(Typography)`
font-style: normal;
font-weight: 400;
font-size: 14px;
line-height: 18px;
color: #9CA3AF;
`
export const DialogLogoContainer = styled.div`
justify-content: center;
text-align:center;
`

export const DilogTypo1 = styled(Typography)`
font-style: normal;
font-weight: 600;
font-size: 18px;
line-height: 20px;
text-align: center;
letter-spacing: 0.02em;
color: #111827;
`

export const DilogTypo2 = styled(Typography)`
font-style: normal;
font-weight: 400;
font-size: 14px;
line-height: 22px;
text-align: center;
color: #6B7280;
`

export const DilogTypoContaioner = styled.div`
margin : 20px 0px 20px 0px;
`