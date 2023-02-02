import { styled, Tab, TabProps } from "@mui/material";
import { ActionTabStyle } from "../../../style/ActionTabStyle"


export const ActionTab = styled(Tab)<TabProps>(({ theme }) => ({
    ...ActionTabStyle 
}))
