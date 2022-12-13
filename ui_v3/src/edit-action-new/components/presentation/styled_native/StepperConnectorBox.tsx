import { Box, BoxProps, styled } from "@mui/material";

const StepperConnectorBox = styled(Box)<BoxProps>(({ theme }) => ({
    height: "6px",
    width: "100%",
    background: "#6B7280"
}))

export const StepperNonSelectedConnectorBox = styled(Box)<BoxProps>(({ theme }) => ({
    height: "6px",
    width: "100%",
    background: "#C1C9D2"
}))

export default StepperConnectorBox;