import { ArrowRight } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";

export interface CollapsibleDrawerProps {
    open: boolean,
    openWidth: string,
    closedWidth: string,
    children: React.ReactNode[],
    openDrawer: () => void,
    maxHeight: string
}
 

const CollapsibleDrawer = (props: CollapsibleDrawerProps) => {
    const { open, openWidth, closedWidth, openDrawer, children, maxHeight} = props
    return (
        <Box sx={{
            width: open ? openWidth : closedWidth,
            marginY: 1,
            maxHeight: maxHeight,
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
                <Box sx={{ display: "flex", flexDirection: "column",  gap: 3}}>
                    <Box>
                        {children?.[0]}
                    </Box>
                    <Box sx={{overflowY: "auto", maxHeight: `calc(${props.maxHeight} - 150px)`, flexGrow: 1}}>
                        {children?.[1]}
                    </Box>
                </Box>
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