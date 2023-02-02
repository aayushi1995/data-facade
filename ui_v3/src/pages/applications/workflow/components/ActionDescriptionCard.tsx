import { Card, Box, Typography } from "@mui/material"


interface ActionDescriptionCardProps {
    description?: string,
    mode: "READONLY" | "EDIT"
}

const ActionDescriptionCard = (props: ActionDescriptionCardProps) => {


    return (
        <Card sx={{
            backgroundColor: "buildActionDrawerCardBgColor.main",
            border: "0.439891px solid #FFFFFF",
            boxShadow: "3.99px 3.99px 5px rgba(54, 48, 116, 0.3)",
            borderRadius: "16px",
            maxWidth: '100%'
        }}>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
                <Box sx={{
                    display: 'flex', alignItems: 'center',
                    backgroundColor: "lightBlueDF.main",
                    // borderRadius: "0px 0px 16px 16px",
                }}>
                    <Typography sx={{
                        fontFamily: "SF Pro Display",
                        fontStyle: "normal",
                        fontWeight: 700,
                        fontSize: "24px",
                        lineHeight: "24px",
                        color: "cardIconBtn1HoverColor.main",
                        p: 2
                    }}>
                        What's this app about?
                    </Typography>
                </Box>
                <Box sx={{minWidth: '100%', display: 'flex', alignItems: 'center', minHight: '100%', p: 2}}>
                    <Typography sx={{
                        fontFamily: "SF Pro Text",
                        fontStyle: "normal",
                        fontWeight: 400,
                        fontSize: "15px",
                        lineHeight: "143%",
                        letterSpacing: "0.15px",
                        color: "typographyColor1.main",
                        maxHeight:  "140px",
                        overflowY: "auto"
                    }}>
                        {props.description}
                    </Typography>
                </Box>
            </Box>
        </Card>
    )
}

export default ActionDescriptionCard