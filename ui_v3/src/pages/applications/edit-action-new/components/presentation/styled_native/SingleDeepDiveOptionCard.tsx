import { Card, CardProps, styled } from "@mui/material";


export const SingleDeepDiveOptionCard = styled(Card)<CardProps>(({theme}) => ({
    background: "#FFFFFF",
    boxShadow:
      "0px 0.691186px 1.38237px rgba(0, 0, 0, 0.12), 0px 0px 0px 0.691186px rgba(0, 0, 0, 0.05)",
    borderRadius: "5px"
}))