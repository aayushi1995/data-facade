import { Box, styled } from "@mui/material";
import { BoxProps } from "@mui/system";


export const DataGridShowRelationshipBox = styled(Box)<BoxProps>(({theme}) => ({
    height: "100%", 
    width: "100%", 
    display: "flex", 
    justifyContent: "flex-start", 
    alignItems: "center", 
    cursor: "pointer", 
    color: "#2155CD", 
    "&:hover": { backgroundColor: "#E6E6E6", color: "#40DFEF" } 
    
}))