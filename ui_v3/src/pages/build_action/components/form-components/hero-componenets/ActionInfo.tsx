import { Box, Divider, Button, Avatar, TextField} from "@mui/material";
import { Typography } from "@mui/material";
import React from "react";
import UsageStatus from "../../../../../common/components/UsageStatus";


export interface ActionInfoProps {
    Name?: string,
    Author?: string,
    onNameChange?: (newName: string|undefined) => void
    readOnly?: boolean
}

const ActionInfo = (props: ActionInfoProps) => {
    const {Name, onNameChange, Author, readOnly} = props
    const [name, setName] = React.useState<string|undefined>()

    const saveName = () => onNameChange?.(name)
    React.useEffect(() => {
        setName(Name)
    }, [Name])

    return (
        <Box sx={{ display: "flex", flexDirection: "column", pl: 2, pt: 1, gap: 2}}>
            <Box sx={{display: "flex", flexDirection: "column", justifyContent: "flex-start"}} className="header">
                <Box className="name">
                    <TextField value={name} 
                        variant="standard" 
                        fullWidth
                        placeholder="Enter Action Name"
                        onChange={(event) => setName(event.target.value)} 
                        onBlur={saveName}
                        disabled={readOnly}
                        InputProps ={{
                            sx: {
                                fontFamily: "SF Pro Display",
                                fontStyle: "normal",
                                fontWeight: 600,
                                fontSize: "36px",
                                lineHeight: "116.7%",
                                color: "#253858"
                            },
                            disableUnderline: true
                        }}
                    />
                </Box>
                <Box className="meta">
                    <Typography variant="heroMeta">
                        <span>Created By</span>
                        <span><b> {Author}</b></span>
                        <span> | </span>
                        <span>Last Sync on</span>
                        {/* <span>{formTimestampHumanReadable(props.lastSyncTimestamp)}</span> */}
                    </Typography>
                </Box>
            </Box>
            <Box sx={{display: "flex", flexDirection: "row", gap: 4}}>
                <Box sx={{display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 2}} className="info">
                    <Box className="createdBy">
                        <Avatar sx={{ cursor: "pointer", height: 40, width: 40 }} alt={Author}/>
                    </Box>
                        <Divider orientation="vertical" flexItem/>
                    <Box className="status">
                        <UsageStatus status="IN DEVELOPMENT"/>
                    </Box>
                </Box>
                <Box sx={{display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 2}} className="info">
                    <Box className="createdBy">
                        <Button variant="contained" size="small" disabled>ADD TO GROUP</Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default ActionInfo;