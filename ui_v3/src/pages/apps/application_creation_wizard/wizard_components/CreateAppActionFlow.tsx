import { Box, Button, Checkbox, FormControlLabel, Grid, Radio, Typography } from "@mui/material";
import React from "react";
import { useHistory } from "react-router-dom";
import { BuildApplicationWizardStepProps } from "../ApplicationCreationWizard";


const CreateAppActionFlow = (props: BuildApplicationWizardStepProps) => {
    const history = useHistory()
    const createOptions = [
        {
            value: "Create a Package",
            description: "A package can contain multiple flows and actions with Multiple Dashboards and visualization schema "
        },
        {
            value: "Create an Action",
            description: "Atomic steps to create a flow or a standalone output (Micro App)"
        },
        {
            value: "Create a flow",
            description: "A flow is a combination of actions (Mini App)"
        }
    ]

    const [selectedOption, setSelectedOption] = React.useState<string>(createOptions[0].value)

    const onContinue = () => {
        if(selectedOption===createOptions[0].value){
            props.nextStep()
        } else if(selectedOption===createOptions[1].value){
            history.push({
                pathname: `/application/build-action`
            })
        } else if(selectedOption===createOptions[2].value){
            history.push({
                pathname: `/application/build-workflow`
            })
        }
    }

    return (
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", px:4}}>
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", flexGrow: 1}}>
                <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
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
                        Please select an option to help you
                    </Typography>
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
                        create your first app
                    </Typography>
                </Box>
            </Box>
            <Grid container sx={{flexGrow: 1}}>
                {createOptions.map(opt => 
                    <Grid item xs={12} md={6} sx={{ px: 2 }}>
                        <CreateOption {...opt} selectedValue={selectedOption} onSelect={(newValue: string) => setSelectedOption(newValue)}/>
                    </Grid>
                )}
            </Grid>
            <Box sx={{display: "flex", flexDirection: "row", justifyContent: "flex-end", width: "100%", gap: 3}}>
                <Box>
                    <Button variant="contained" onClick={onContinue}>Continue</Button>
                </Box>
                <Box>
                    <Button variant="contained">Not Sure</Button>
                </Box>
            </Box>
        </Box>
    )
}

interface CreateOptionProps {
    value: string,
    description: string,
    selectedValue: string,
    onSelect: (value: string) => void
}

const CreateOption = (props: CreateOptionProps) => {
    const {value, selectedValue, description, onSelect} = props
    return (
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2}}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2}}>
                <Radio checked={value===selectedValue} onClick={() => onSelect(value)}/>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 2}}>
                <Box>
                    <Typography>
                        {value}
                    </Typography>
                </Box>
                <Box>
                    <Typography>
                        {description}
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}
export default CreateAppActionFlow;