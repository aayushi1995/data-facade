import { TextField, Box } from "@mui/material"
import React from "react"
import { EditWebAppContext } from "../context/EditWebAppContextProvider"
import useWebAppHeader from "../hooks/useWebAppHeader"


const WebAppHeader = () => {

    const editWebAppContext = React.useContext(EditWebAppContext)

    const {handleWebAppModelChange} = useWebAppHeader()

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
            <TextField fullWidth value={editWebAppContext.webApp.DisplayName} onChange={(event) => handleWebAppModelChange("DisplayName", event.target.value)}/>
            <TextField fullWidth value={editWebAppContext.webApp.Description} multiline onChange={(event) => handleWebAppModelChange("Description", event.target.value)}/>
        </Box>
    )
}

export default WebAppHeader
