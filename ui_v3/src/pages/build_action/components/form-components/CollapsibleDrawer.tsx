import { ArrowRight } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";

export interface CollapsibleDrawerProps {
    open: boolean,
    openWidth: string,
    closedWidth: string,
    children: React.ReactNode,
    showClosed?: boolean,
    openDrawer: () => void,
}
 

const CollapsibleDrawer = (props: CollapsibleDrawerProps) => {
    const { open, openWidth, closedWidth, openDrawer, children} = props

    return (
        <Box sx={{
            minWidth: open ? openWidth : closedWidth,
            marginY: 1,
            pb: 2,
            minHeight: "100%",
           ...(open ? {
                backgroundColor: "#F5F9FF"
           } : props.showClosed === false ? {} : {
                background:
                "linear-gradient(135.37deg, rgba(0, 0, 0, 0.4) 4.29%, rgba(255, 255, 255, 0.4) 95.6%), #A6CEE3",
                backgroundBlendMode: "soft-light, normal",
                border: "1px solid rgba(255, 255, 255, 0.4)",
                boxSizing: "border-box",
                boxShadow: "-5px -5px 10px #FAFBFF, 5px 5px 10px #A6ABBD",
                borderRadius: '10px'
           }),
           px: 1
        }}>
            {open ?
                children
                :
                <Box sx={{display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center"}}>
                    {props.showClosed === false ? <></> : (
                        <IconButton onClick={() => openDrawer()}>
                            <ArrowRight/>
                        </IconButton>
                    )}
                </Box>
            }
        </Box>
    )
}

export default CollapsibleDrawer;