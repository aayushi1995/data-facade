import { Box, Divider, Typography, Button, Avatar, TextField} from "@material-ui/core";
import React from "react";
import UsageStatus from "../../../../../common/components/UsageStatus";

export interface ActionInfoProps {
    Name?: string,
    Author?: string,
    onNameChange: (newName: string|undefined) => void
}

const ActionInfo = (props: ActionInfoProps) => {
    const {Name, onNameChange, Author} = props
    const [name, setName] = React.useState<string|undefined>()

    const saveName = () => onNameChange(name)
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
                    <Typography sx={{
                        fontFamily: "SF Pro Text",
                        fontStyle: "normal",
                        fontWeight: "normal",
                        fontSize: "12px",
                        lineHeight: "143%",
                        letterSpacing: "0.0961957px",
                        color: "rgba(66, 82, 110, 0.86)"
                    }}>
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
                        <Button variant="contained" size="small">ADD TO GROUP</Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default ActionInfo;