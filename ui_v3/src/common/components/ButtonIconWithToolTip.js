import {useTheme} from "@material-ui/core/styles";
import {IconButton, Tooltip} from "@material-ui/core";
import React from "react";
import {Box} from "@mui/system";

export const ButtonIconWithToolTip = ({
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
            boxShadow: background? theme.shadows[23]: 'none'
        }}>
        <IconButton
            size="small"
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