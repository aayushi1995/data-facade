import styled from "@emotion/styled"
import { Tab, TabProps } from "@mui/material"


const StyledTabs = styled(Tab)<TabProps>(({theme}) => ({
    fontFamily: "SF Pro Text",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "14px",
    lineHeight: "24px",
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    opacity: 0.7
}))



export default StyledTabs