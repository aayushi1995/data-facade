import { Card, CardProps } from "@mui/material";
import { styled } from "@mui/styles";

export const StyledAddActionCard = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
    backgroundColor: theme.palette.background.default
    },
    borderRadius: 1,
    p: 2,
    height: "100%"
}))