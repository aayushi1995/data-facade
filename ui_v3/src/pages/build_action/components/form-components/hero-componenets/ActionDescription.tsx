import { Box, Card, Divider, Typography, Button, Avatar, TextField} from "@mui/material";
import { IconButton } from "@mui/material";
import React from "react";

export interface ActionDescriptionProps {
    Description?: string,
    Author?: string,
    Name?: string,
    onDescriptionChange?: (newDescription: string|undefined) => void,
    readOnly: boolean
}

const ActionDescription = (props: ActionDescriptionProps) => {
    const {Description, onDescriptionChange, Author, readOnly, Name} = props
    const [description, setDescription] = React.useState<string|undefined>()

    const saveDescription = () => onDescriptionChange?.(description)

    React.useEffect(() => {
        setDescription(Description)
    }, [Description])

    return (
        <Box sx={{display: "flex", flexDirection: "row"}} className="master">
            <Box sx={{pl: 1, pt: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start", flexGrow: 1}} className="data">
                <Box sx={{display: "flex", flexDirection: "row"}} className="data-author">
                    <Box sx={{mr: 1, display: "flex", alignItems: "center", justifyContent: "center"}}className="data-author-avatar">
                        <Button sx={{m:0, p:0}}>
                            <Avatar sx={{ cursor: "pointer", height: 40, width: 40 }} alt={Author}>

                            </Avatar>
                        </Button>
                    </Box>
                    <Box sx={{display: "flex", flexDirection: "column", justifyContent: "space-around"}} className="data-author-info">
                        <Box className="header">
                            <Typography variant="h6" sx={{
                                fontFamily: "SF Pro Text",
                                fontStyle: "normal",
                                fontWeight: "normal",
                                fontSize: "16px",
                                lineHeight: "175%",
                                letterSpacing: "0.15px",
                                color: "#253858"
                            }}>{Name||"Description"}</Typography>
                        </Box>
                        <Box className="meta">
                            <Typography variant="body1" sx={{
                                fontFamily: "SF Pro Text",
                                fontStyle: "normal",
                                fontWeight: "normal",
                                fontSize: "14px",
                                lineHeight: "143%",
                                letterSpacing: "0.15px",
                                color: "rgba(66, 82, 110, 0.86)"
                            }}>
                                <span>By <b>{Author}</b></span>
                                <span> | </span>
                                <span>Updated </span>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ml: 3, mb: 2, mt: 1}} className="description">
                    <TextField value={readOnly? (description||"NA") : description} 
                        variant="standard" 
                        fullWidth
                        multiline
                        placeholder="Enter Action Description"
                        minRows={4}
                        maxRows={6}
                        disabled={readOnly}
                        onChange={(event) => setDescription(event.target.value)} 
                        onBlur={saveDescription}
                        InputProps ={{
                            sx: {
                                fontFamily: "SF Pro Text",
                                fontStyle: "normal",
                                fontWeight: "normal",
                                fontSize: "14px",
                                lineHeight: "143%",
                                letterSpacing: "0.15px",
                                color: "rgba(66, 82, 110, 0.86)"
                            },
                            disableUnderline: true
                        }}
                    />
                </Box>
            </Box>
        </Box>
    )
}

export default ActionDescription;