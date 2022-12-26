import { Box, Button, Grid, Radio, Typography } from "@mui/material";
import React from "react";
import { useHistory } from "react-router-dom";
import { APPLICATION_ADD_ACTION_ROUTE, APPLICATION_BUILD_ACTION_ROUTE_ROUTE, APPLICATION_WEB_APP_BUILD_ROUTE, APPPLICATION_CREATE_AUTO_FLOW } from "../../../../common/components/header/data/ApplicationRoutesConfig";
import { BuildApplicationWizardStepProps } from "../ApplicationCreationWizard";


const CreateAppActionFlow = (props: BuildApplicationWizardStepProps) => {
    const history = useHistory()
    const createOptions = [
        {
            value: "Create an Action",
            description: "Atomic steps to create a flow or a standalone output (Micro App)"
        },
        {
            value: "Create a flow",
            description: "A flow is a combination of actions (Mini App)"
        },
        {
            value: "Create a web app",
            description: "An interractive web app"
        },
        {
            value: "Create a Package",
            description: "A package can contain multiple flows and actions with Multiple Dashboards and visualization schema "
        }
    ]

    const [selectedOption, setSelectedOption] = React.useState<string>(createOptions[0].value)
    const [aiFlowButtoVisible, setAiFlowButtonVisible] = React.useState(false)

    const onContinue = () => {
        if(selectedOption===createOptions[3].value){
            props.nextStep()
        } else if(selectedOption===createOptions[0].value){
            history.push({
                pathname: APPLICATION_ADD_ACTION_ROUTE
            })
        } else if(selectedOption===createOptions[1].value){
            history.push({
                pathname: `/application/build-workflow`
            })
        } else if(selectedOption===createOptions[2].value) {
            history.push(APPLICATION_WEB_APP_BUILD_ROUTE)
        }
    }

    React.useEffect(() => {
        if(selectedOption===createOptions[1].value) {
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
                <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Typography sx={{
                        fontFamily: "'SF Compact Display'",
                        fontStyle: "normal",
                        fontWeight: 600,
                        fontSize: "30px",
                        lineHeight: "35px",
                        display: "flex",
                        alignItems: "center",
                        textAlign: "center",
                        color: "dialogueTextColor1.main"
                    }}>
                        Please select an option
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
            <Box sx={{display: "flex", flexDirection: "row",py:1, justifyContent: "center", width: "100%", gap: 3}}>
                <Box>
                    <Button variant="contained" sx={{width:'10vw'}} onClick={onContinue}>Continue</Button>
                </Box>
                <Box>
                    {aiFlowButtoVisible && <Button sx={{width:'10vw'}} variant="contained" onClick={handleCreateAutoFlow}>Auto Flow</Button>}
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
        <Box onClick={()=> onSelect(value)} sx={{ display: "flex", flexDirection: "row",py:1, gap: 3 , borderRadius:'10px',boxShadow: '0 0 2px 0 rgba(0,0,0,0.31), 5px 8px 10px -5px rgba(0,0,0,0.25)' , backgroundColor: 'ActionCardBgColor.main',cursor:'pointer'}}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2}}>
                <Radio id="myRadio" checked={value===selectedValue} onClick={() => onSelect(value)}/>
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