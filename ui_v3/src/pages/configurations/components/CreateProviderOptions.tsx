import { Box, Button } from "@mui/material";
import React from "react";
import { ConnectionQueryContext, ConnectionStateContext } from "../context/ConnectionsContext";

const CreateProviderOptions = () => {
    const connectionState = React.useContext(ConnectionStateContext)
    const connectionQuery = React.useContext(ConnectionQueryContext)

    const onCreate = () => {
        connectionQuery?.saveMutation?.mutate(connectionState)
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", px: 2}}>
            <Box>
                <Box>
                
                </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 1}}>
                <Box>
                    <Button variant="outlined" disabled>Test Connection</Button>
                </Box>
                <Box>
                    <Button variant="contained" disabled>Sync</Button>
                </Box>
                <Box>
                    <Button variant="outlined" onClick={() => onCreate()}>Create</Button>
                </Box>
            </Box>
        </Box>
    )
}

export default CreateProviderOptions;