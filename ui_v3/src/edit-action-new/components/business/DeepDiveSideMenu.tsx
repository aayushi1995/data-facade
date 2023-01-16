import { Add } from "@mui/icons-material"
import Close from "@mui/icons-material/Close"
import { Autocomplete, Box, Card, Divider, Grid, IconButton, TextField, Typography } from "@mui/material"
import { ReactQueryWrapper } from "../../../common/components/ReactQueryWrapper"
import useDeepDiveSideMenu from "../../hooks/useDeepDiveSideMenu"
import { ActionAddOptionsCardStyles } from "../../style/ActionAddOptionsCardStyles"
import { ActionDeepDiveMenuCard, ActionSideMenuHeaderTypography } from "../presentation/styled_native/ActionSideMenuBox"
import { SingleDeepDiveOptionCard } from "../presentation/styled_native/SingleDeepDiveOptionCard"


const DeepDiveSideMenu = () => {

    const {getDeepDiveOptions, addActionToDeepOptions, addDeepDiveActions, addNameToDeepDiveOptions, fetchAllActionsNameAndId, getActionValue, removeDeepDiveAction} = useDeepDiveSideMenu()

    return (
        <ActionDeepDiveMenuCard sx={{heigth: '100%', p: 1, bgcolor: '#F6F8FC'}}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
                <ActionSideMenuHeaderTypography>
                    Configure Output Menu
                </ActionSideMenuHeaderTypography>
                <Divider orientation="horizontal" sx={{width: '100%'}} />
                {getDeepDiveOptions().map((deepDiveOptions, index) => (
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                        <SingleDeepDiveOptionCard sx={{display: 'flex', flexDirection: 'column', gap: 2, py: 2, pr: 2, pl: 1}}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sx={{display: 'flex', justifyContent: 'flex-end'}}>
                                    <IconButton onClick={() => removeDeepDiveAction(index)}>
                                        <Close />
                                    </IconButton>
                                </Grid>
                                <Grid item xs={12} md={6} lg={4} >
                                    <Typography variant="executeActionName">
                                        Display Name
                                    </Typography>
                                </Grid>
                                <Grid item md={12} lg={8}>
                                    <TextField InputLabelProps={{ shrink: true }} label="Deep Dive Name" value={deepDiveOptions.DisplayName} fullWidth variant="outlined" onChange={(event) => addNameToDeepDiveOptions(index, event.target.value) }/>
                                </Grid>
                                <Grid item xs={12} md={6} lg={4} >
                                    <Typography variant="executeActionName">
                                        Select Action
                                    </Typography>
                                </Grid>
                                <Grid item md={12} lg={8}>
                                    <ReactQueryWrapper {...fetchAllActionsNameAndId}>
                                        {() =>
                                            <Autocomplete 
                                            value={getActionValue(deepDiveOptions.Id || "NA")}
                                            options={fetchAllActionsNameAndId.data || []}
                                            getOptionLabel={(option) => option.DisplayName || option.UniqueName || "Name NA"}
                                            renderInput={(params) => <TextField {...params} fullWidth label="Select Action"/>}
                                            fullWidth
                                            filterSelectedOptions
                                            onChange={(event, value, reason, details) => addActionToDeepOptions(index, value?.Id!, value?.DisplayName || value?.UniqueName || "Name NA")}
                                        /> 
                                        }
                                    </ReactQueryWrapper>
                                    
                                </Grid>
                            </Grid>
                        </SingleDeepDiveOptionCard>
                        <Divider orientation="horizontal" sx={{width: "100%"}} />
                    </Box>
                ))}
                <Card sx={{...ActionAddOptionsCardStyles, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <IconButton onClick={addDeepDiveActions}>
                        <Add sx={{color: "#00A99D;"}}/>
                    </IconButton>
                </Card>
            </Box>
        </ActionDeepDiveMenuCard>
    )
}

export default DeepDiveSideMenu