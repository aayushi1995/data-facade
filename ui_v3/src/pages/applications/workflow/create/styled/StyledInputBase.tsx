import { InputBase, InputBaseProps } from "@mui/material";
import { styled } from "@mui/styles";

export const StyledInputBase = styled(InputBase)<InputBaseProps>(({theme}) => ({
    sx: {
        fontFamily: "'Segoe UI'",
        fontStyle: "normal",
        fontWeight: 600,
        fontSize: "13px",
        lineHeight: "20px",
        color: "#050505"
    }
}))