import { Paper, PaperProps } from "@mui/material";
import { styled } from "@mui/styles";

const StyledInputPaper = ({children}: {children: React.ReactElement}) => (
    <Paper sx={{
        background: "#FFFFFF",
        borderRadius: "8px",
        display: 'flex', 
        alignItems: 'center', 
        p: '10px',
        minHeight: '60px',
        width: '100%',
    }} >
        {children}
    </Paper >
)

export default StyledInputPaper