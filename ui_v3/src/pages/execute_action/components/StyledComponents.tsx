import styled from "@emotion/styled";
import { Card, CardProps } from "@mui/material";

export const StyledIPCard = styled(Card)<CardProps>(({theme})=>({
    background: "#FFFFFF",
    boxShadow:"-2.49615px -2.49615px 7.48846px rgba(255, 255, 255, 0.5), 2.49615px 2.49615px 7.48846px rgba(163, 177, 198, 0.5)",
    borderRadius: "16px",
    minWidth: '100%',
    height: '100%'
}))