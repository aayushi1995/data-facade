import { Box, Button, Switch, FormControlLabel, FormGroup, Typography, useTheme, Grid } from "@mui/material";
import { useContext, useState } from "react";
import { useQueryClient } from "react-query";
import { useLocation, useHistory } from "react-router-dom";
import labels from "../../../../labels/labels";
import { BuildActionContext, SetBuildActionContext } from "../../context/BuildActionContext";
import useActionDefinitionFormCreate, { ActionDefinitionFormPayload } from "../../hooks/useActionDefinitionFormCreate";

const TestAndDeploy = () => {
    const location = useLocation()
    const history = useHistory()
    const theme = useTheme()
    const queryClient = useQueryClient()
    const buildActionContext = useContext(BuildActionContext)
    const setBuildActionContext = useContext(SetBuildActionContext)
   
    const [selectDefaultFields, setSelectDefaultFields] = useState(false)
    const [makePublic, setMakePublic] = useState(false)
    const [allowUploadOfFiles, setAllowUploadOfFiles] = useState(false)
    const [showProbability, setShowProbability] = useState(false)
    const [createDashboard, setCreateDashboard] = useState(false)
    const [pinToMyInsight, setPinToMyInsight] = useState(false)

    const {mutation: saveMutation} = useActionDefinitionFormCreate({
        options: {
            onMutate: () => {
                setBuildActionContext({type: "Loading"})
            },
            onSuccess: (data, variables, context) => {
                setBuildActionContext({type: "RefreshIds"})
                queryClient.invalidateQueries([labels.entities.ActionDefinition, "All"])
                if(buildActionContext.onSuccessfulBuild !== undefined) {
                    buildActionContext.onSuccessfulBuild?.(buildActionContext.actionDefinitionWithTags.actionDefinition)
                } else {
                    queryClient.invalidateQueries("Application")
                    history.goBack()
                }
            },
            onSettled: () => {
                setBuildActionContext({type: "LoadingOver"})
            }
        },
        mode: buildActionContext.mode
    })

    const createAction = () => {
        saveMutation.mutate(buildActionContext)
    }

    return (
        <Grid container sx={{pr: 5}}>
            <Grid item xs={12} lg={2}>
                <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 5, minHeight: "100%"}}>
                    <Box sx={{mx: 2}}>
                        <Typography sx={{
                                fontFamily: "SF Pro Text",
                                fontStyle: "normal",
                                fontWeight: "normal",
                                fontSize: "14px",
                                lineHeight: "143%",
                                textAlign: "justify",
                                letterSpacing: "0.15px",
                                color: "#A6ABBD"
                        }}>
                            Test your connection first. If testing is successful you can proceed to save your newly created action definition and create an instance of it to run
                        </Typography>
                    </Box>
                    <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 2, width: "100%", px: 3}}>
                        <Box sx={{width: "100%"}}>
                            <Button variant="contained" color="secondary" fullWidth disabled>Test Action</Button>
                        </Box>
                        <Box sx={{width: "100%"}}>
                            <Button variant="contained" onClick={createAction} fullWidth>Save</Button>
                        </Box>
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={12} lg={8}>
                <Box sx={{display: "flex", flexDirection: "column", width: "100%", alignItems: "center", justifyContent: "center", minHeight: "100%"}}>
                    <Box>
                        <Typography sx={{
                            fontFamily: "SF Pro Text",
                            fontStyle: "normal",
                            fontWeight: 600,
                            fontSize: "18px",
                            lineHeight: "143%",
                            display: "flex",
                            alignItems: "center",
                            textAlign: "center",
                            letterSpacing: "0.15px",
                            color: "#66748A"
                        }}>
                            CONGRATULATIONS!!
                        </Typography>
                    </Box>
                    <Box>
                        <Typography sx={{
                            fontFamily: "SF Pro Text",
                            fontStyle: "normal",
                            fontWeight: 600,
                            fontSize: "18px",
                            lineHeight: "143%",
                            display: "flex",
                            alignItems: "center",
                            textAlign: "center",
                            letterSpacing: "0.15px",
                            color: "#66748A"
                        }}>
                            THE TESTING WAS SUCCESSFULL. PLEASE SAVE YOUR ACTION 
                        </Typography>
                    </Box>
                </Box>
                
            </Grid>
            <Grid container item xs={12} lg={2} sx={{justifyContent: "flex-end"}}>
                    <FormGroup>
                        <FormControlLabel control={<Switch checked={selectDefaultFields} onChange={(event) => {setSelectDefaultFields(event.target.checked)}}/>} label="Set Default fields"/>
                        <FormControlLabel control={<Switch checked={makePublic} onChange={(event) => {setMakePublic(event.target.checked)}}/>} label="Make public"/>
                        <FormControlLabel control={<Switch checked={allowUploadOfFiles} onChange={(event) => {setAllowUploadOfFiles(event.target.checked)}}/>} label="Allow upload of files"/>
                        <FormControlLabel control={<Switch checked={showProbability} onChange={(event) => {setShowProbability(event.target.checked)}}/>} label="Show probability"/>
                        <FormControlLabel control={<Switch checked={createDashboard} onChange={(event) => {setCreateDashboard(event.target.checked)}}/>} label="Create Dashboard"/>
                        <FormControlLabel control={<Switch checked={pinToMyInsight} onChange={(event) => {setPinToMyInsight(event.target.checked)}}/>} label="Pin to My Insight"/>
                    </FormGroup>
            </Grid>
        </Grid>
    )
}
export default TestAndDeploy;