import { ArrowRight } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { minHeight } from "@mui/system";

export interface CollapsibleDrawerProps {
    open: boolean,
    openWidth: string,
    closedWidth: string,
    children: React.ReactNode,
    openDrawer: () => void,
    minHeight: string
}
 

const CollapsibleDrawer = (props: CollapsibleDrawerProps) => {
    const { open, openWidth, closedWidth, openDrawer, children, minHeight} = props

    return (
        <Box sx={{
            width: open ? openWidth : closedWidth,
            marginY: 1,
           ...(open ? {
                backgroundColor: "#F5F9FF"
           } : {
                background:
                "linear-gradient(135.37deg, rgba(0, 0, 0, 0.4) 4.29%, rgba(255, 255, 255, 0.4) 95.6%), #A6CEE3",
                backgroundBlendMode: "soft-light, normal",
                border: "1px solid rgba(255, 255, 255, 0.4)",
                boxSizing: "border-box",
                boxShadow: "-5px -5px 10px #FAFBFF, 5px 5px 10px #A6ABBD",
                borderRadius: 3
           }),
           px: 1
        }}>
            {open ?
                children
                :
                <Box sx={{display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", height: "100%"}}>
                    <IconButton onClick={() => openDrawer()}>
                        <ArrowRight/>
                    </IconButton>
                </Box>
            }
        </Box>
    )
}

export default CollapsibleDrawer;