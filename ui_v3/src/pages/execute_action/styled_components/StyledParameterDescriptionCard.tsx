import { Card, styled } from "@mui/material"


const StyledParameterDescriptionCard = styled(Card)(({theme}) => ({
    padding: "9px 15px",
    background: "#FFFFFF",
    borderRadius: "8px",
    margin: theme.spacing(0)
}))

export default StyledParameterDescriptionCard