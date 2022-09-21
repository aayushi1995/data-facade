import { Box, Button, Grid, Radio, Typography } from "@mui/material";
import React from "react";
import { useHistory } from "react-router-dom";
import { APPLICATION_BUILD_ACTION_ROUTE_ROUTE, APPPLICATION_CREATE_AUTO_FLOW } from "../../../../common/components/header/data/ApplicationRoutesConfig";
import { APPLICATION_ROUTE } from "../../../../common/components/header/data/RoutesConfig";
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
    const [aiFlowButtoVisible, setAiFlowButtonVisible] = React.useState(false)

    const onContinue = () => {
        if(selectedOption===createOptions[0].value){
            props.nextStep()
        } else if(selectedOption===createOptions[1].value){
            history.push({
                pathname: APPLICATION_BUILD_ACTION_ROUTE_ROUTE
            })
        } else if(selectedOption===createOptions[2].value){
            history.push({
                pathname: `/application/build-workflow`
            })
        }
    }

    React.useEffect(() => {
        if(selectedOption===createOptions[2].value) {
            setAiFlowButtonVisible(true)
        } else {
            setAiFlowButtonVisible(false)
        }
    })

    const handleCreateAutoFlow = () => {
        history.push(APPPLICATION_CREATE_AUTO_FLOW)
    }

    return (
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", px:4}}>
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", flexGrow: 1}}>
                
                    <Box>
                        <Typography variant="wizardText" sx={{
                            color: 'dialogueTextColor1.main',
                            fontFamily: "'SF Compact Display'",
                            fontWeight: 800,
                            fontSize: '25px'
                        }}>
                            Welcome to Data Facade APP-Creation widget.
                            Experience a new way in how you create apps 
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="wizardText" sx={{
                            color: 'dialogueTextColor1.main',
                            fontFamily: "'SF Compact Display'",
                            fontWeight: 800,
                            fontSize: '22px'
                        }}>
                            Data Facade brings you the power to use
                            either a No-code or a Hybrid-code platform to create your actions
                            The first step in building your AI App
                        </Typography>
                    </Box>
                
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
                        color: "dialogueTextColor1.main"
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
                        color: "dialogueTextColor1.main"
                    }}>
                        create your first app
                    </Typography>
                </Box>
            </Box>
            <Grid container sx={{flexGrow: 1}}>
                {createOptions.map(opt => 
                    <Grid item xs={12} md={12} sx={{ px: 2 , py:1}}>
                        <CreateOption {...opt} selectedValue={selectedOption} onSelect={(newValue: string) => setSelectedOption(newValue)}/>
                    </Grid>
                )}
            </Grid>
            <Box sx={{display: "flex", flexDirection: "row", justifyContent: "flex-end", width: "100%", gap: 3}}>
                <Box>
                    <Button variant="contained" onClick={onContinue}>Continue</Button>
                </Box>
                <Box>
                    {aiFlowButtoVisible && <Button variant="contained" onClick={handleCreateAutoFlow}>Auto Flow</Button>}
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
        <Box sx={{ display: "flex", flexDirection: "row", gap: 3 , boxShadow: '0 0 1px 0 rgba(0,0,0,0.31), 0 3px 4px -2px rgba(0,0,0,0.25)' , backgroundColor: 'ActionCardBgColor.main', padding:'5px'}}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2}}>
                <Radio checked={value===selectedValue} onClick={() => onSelect(value)}/>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 1}}>
                <Box>
                    <Typography sx={{fontSize: '18px' , fontWeight: 500}}>
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