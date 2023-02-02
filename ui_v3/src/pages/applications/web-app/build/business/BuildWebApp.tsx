import { Box, Button, TextField } from "@mui/material"
import useBuildWebApp from "../hooks/useBuildWebApp"


const BuildWebApp = () => {

    const {
        webAppName,
        webAppDescription,
        handleWebAppDescriptionChange,
        handleWebAppNameChange,
        onSave
    } = useBuildWebApp({})

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', gap: 2}}>
            <TextField sx={{width: '50%'}} label="Name" value={webAppName} onChange={handleWebAppNameChange}/>
            <TextField sx={{width: '50%'}} label="Description" multiline value={webAppDescription} onChange={handleWebAppDescriptionChange} />
            <Box sx={{display: 'flex', width: '100%', height: '30%', justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                <Button variant="contained" onClick={onSave}>
                    Create
                </Button>
            </Box>
        </Box>
    )
}

export default BuildWebApp