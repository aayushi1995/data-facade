import { IconButton, Tooltip, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

export const ButtonIconWithToolTip = ({
                                        size = "small",
                                          backgroundColor = 'white',
                                          title, onClick = () => {
    }, Icon, background= true
                                      }) => {
    const theme = useTheme();
    return <Tooltip title={title}>
        <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            backgroundColor: {backgroundColor},
            borderRadius: "100%",
            boxShadow: background? theme.shadows[22]: 'none'
        }}>
            <IconButton
                size={size}
                onClick={onClick}
                color="primary"
                aria-label={title}
                component="span"
            >
                <Icon sx={{height: "15px", width: "15px"}}/>
            </IconButton>
        </Box>
    </Tooltip>;
}