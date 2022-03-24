import { Typography } from "@mui/material";
import { Box, Button, FormControl, InputLabel, Select, TextField } from "@mui/material";
import React from "react";
import { BuildApplicationWizardStepProps } from "../ApplicationCreationWizard";
import { BuildApplicationContext, SetBuildApplicationContext } from "../context/BuildApplicationContext";


const ConfigureAppNameGroup = (props: BuildApplicationWizardStepProps) => {
    const context = React.useContext(BuildApplicationContext)
    const setContext = React.useContext(SetBuildApplicationContext)
    const [name, setName] = React.useState(context.Application.Name)
    
    const setNameInContext = () => {
        setContext({
            type: "SetApplicationName",
            payload: {
                newName: name
            }
        })
    }

    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 2, width: "100%"}}>
            <Box sx={{display: "flex", flexDirection: "row", justifyContent: "center", flexGrow: 1}}>
                <Typography sx={{
                    fontFamily: "'SF Compact Display'",
                    fontStyle: "normal",
                    fontWeight: 300,
                    fontSize: "25px",
                    lineHeight: "45px",
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                    color: "#A7A9AC"
                }}>
                    Type your Application Name
                </Typography>
            </Box>
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", gap: 3, flexGrow: 1}}>
                <Box sx={{width: "40%"}}>
                    <TextField onBlur={setNameInContext} variant="outlined" label="Application Name" value={name} onChange={(event => setName(event.target.value))} fullWidth/>
                </Box>
                <Box sx={{width: "40%"}}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel>Select App Group</InputLabel>
                        <Select
                            variant="outlined"
                            label="Select App Group"
                            fullWidth
                            disabled
                        >
                        </Select>
                    </FormControl>
                </Box>
            </Box>
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 2}}>
                <Button variant="contained" onClick={() => props.nextStep()}>Continue</Button>
            </Box>
        </Box>
    )
}

export default ConfigureAppNameGroup;