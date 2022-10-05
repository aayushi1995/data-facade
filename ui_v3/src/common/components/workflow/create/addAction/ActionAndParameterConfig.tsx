import { Avatar, Box, Divider, Grid, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import React from "react"
import { getInputTypeFromAttributesNew } from "../../../../../custom_enums/ActionParameterDefinitionInputMap"
import ActionParameterDefinitionDatatype from "../../../../../enums/ActionParameterDefinitionDatatype"
import ActionParameterDefinitionInputType from "../../../../../enums/ActionParameterDefinitionInputType"
import { ConfigureParametersContext } from "../../context/ConfigureParametersContext"

interface ActionAndParameterConfigProps {

}

const columns = [
    {
        headerName: 'Parameter',
        field: 'ParameterName',
        flex: 1
    },
    {
        headerName: 'Type',
        field: 'InputType',
        flex: 1
    }
]

export const TypeToDescription = {
    [ActionParameterDefinitionInputType.TABLE_NAME]: <div><span>In DF platform ‘type’ is defined as input type for the parameter. For this parameter the input type is a <b>’Table’. User cannot change the input type of a parameter in flow building</b>. Depending on the ‘User input’ a user can either choose to select a table while running a flow or can choose the result of any previous (upstream) action which returns a table. DF automatically gives a dropdown of suitable upstream actions to choose from.</span></div>,
    [ActionParameterDefinitionInputType.COLUMN_NAME]: <div><span>In DF platform ‘type’ is defined as input type for the parameter. For this parameter the input type is a <b>'Column'. User cannot change the input type of a parameter in flow building</b>. Depending on the 'User Input' a user can either type the name of the column which will always be fixed while running the flow or you can associate a Global Parameter to it and select a column before each run</span></div>,
    [ActionParameterDefinitionDatatype.COLUMN_NAMES_LIST]: <div><span>In DF platform ‘type’ is defined as input type for the parameter. For this parameter the input type is a <b>'Column List(You can select multiple Column names)'. User cannot change the input type of a parameter in flow building</b>. User <b>cannot</b> give default column names. You can associate a Global Parameter to it and select columns before each run</span></div>
}

const getTypeDescription = (key: string) => {
    const div = TypeToDescription[key]
    if(!div) {
        return <div><span>In DF platform ‘type’ is defined as input type for the parameter. For this parameter's Input Type you can type in a default value which will be used for each flow execution. If User Input Required is <b>Yes</b> you can associate a <b>Global Parameter</b> to it and specify a value before each flow run</span></div>
    }

    return div
}

const ActionAndParameterConfig = (props: ActionAndParameterConfigProps) => {
    const configureParametersContext = React.useContext(ConfigureParametersContext)
    const parameter = configureParametersContext?.parameters?.[configureParametersContext.currentParameterIndex || 0]

    const formRows = () => {
        const rows = configureParametersContext?.parameters?.map(parameter => ({
            ParameterName: parameter.model.DisplayName || parameter.model.ParameterName!,
            id: parameter.model.Id!,
            InputType: getInputTypeFromAttributesNew(configureParametersContext.selectedActionTemplate?.Language || "python", parameter?.model?.Tag, parameter?.model?.Type, parameter?.model?.Datatype)
        }))
        return rows
    } 
    
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1, minHeight: '400px'}}>
            <Box sx={{display: 'flex', alignItems: 'center', width: '100%', pt: 2, pl: 2}}>
                <Typography sx={{  fontFamily: "'SF Pro Display'",
                            fontStyle: "normal",
                            fontWeight: 600,
                            fontSize: "18px",
                            lineHeight: "160%",
                            letterSpacing: "0.15px",
                            color: "ActionDefinationHeroTextColor1.main"}}
                >
                    Details
                </Typography>
            </Box>
            <Box sx={{width: '100%'}}>
                <Divider orientation="horizontal" flexItem/>
            </Box>
            <Box sx={{height: '100%', width: '100%', ml: 1}}>
                <Grid container direction="row">
                    <Grid item md={12} lg={5.5} sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
                        <Box sx={{display: 'flex', gap: 1, alignItems: 'center'}}>
                            <Box sx={{display: 'flex', height: '100%'}}>
                                <Avatar sx={{ cursor: "pointer", height: 40, width: 40, mt: 1 }} alt={configureParametersContext?.actionData?.ActionDefinition?.model?.CreatedBy}/>
                            </Box>
                            <Box sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                                <Typography sx={{  fontFamily: "'SF Pro Text'",
                                    fontStyle: "normal",
                                    fontWeight: 400,
                                    fontSize: "16px",
                                    lineHeight: "175%",
                                    letterSpacing: "0.15px",
                                    color: "ActionDefinationHeroTextColor1.main"}}>
                                        Action Description
                                </Typography>
                                <Typography sx={{
                                    fontFamily: "'SF Pro Text'",
                                    fontStyle: "normal",
                                    fontWeight: 400,
                                    fontSize: "14px",
                                    lineHeight: "143%",
                                    letterSpacing: "0.15px",
                                    color: "rgba(66, 82, 110, 0.86)"
                                }}>
                                    <span>By <b>{configureParametersContext?.actionData?.ActionDefinition?.model?.CreatedBy}</b> | Updated on {new Date(configureParametersContext?.actionData?.ActionDefinition?.model?.UpdatedOn || Date.now()).toString()}</span>
                                </Typography>
                            </Box>
                        </Box>
                        <Typography sx={{  fontFamily: "'SF Pro Text'",
                            fontStyle: "normal",
                            fontWeight: 400,
                            fontSize: "14px",
                            lineHeight: "143%",
                            letterSpacing: "0.15px",
                            color: "rgba(66, 82, 110, 0.86)"}}
                        >
                            {configureParametersContext?.actionData?.ActionDefinition?.model?.Description || configureParametersContext?.actionData?.ActionDefinition?.model?.DisplayName || "Description NA"}    
                        </Typography>
                        <Box mt={3} sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
                            <Typography sx={{  fontFamily: "'SF Pro Text'",
                                fontStyle: "normal",
                                fontWeight: 400,
                                fontSize: "12.3079px",
                                lineHeight: "166%",
                                letterSpacing: "0.410263px",
                                color: "rgba(66, 82, 110, 0.86)"}}
                            >
                                <span>Parameters : </span>
                                <span><b>{configureParametersContext?.parameters?.length || 0}</b></span>
                            </Typography>
                            <Typography sx={{  fontFamily: "'SF Pro Text'",
                                fontStyle: "normal",
                                fontWeight: 400,
                                fontSize: "12.3079px",
                                lineHeight: "166%",
                                letterSpacing: "0.410263px",
                                color: "rgba(66, 82, 110, 0.86)"}}
                            >
                                <span>Action Group : </span>
                                <span><b>{configureParametersContext.actionData?.ActionDefinition?.model?.ActionGroup || "NA"}</b></span>
                            </Typography>
                        </Box>
                        <Box m={1}>
                            <DataGrid columns={columns} rows={formRows()} sx={{height: '270px'}} autoPageSize/>
                        </Box>
                    </Grid>
                    <Grid item lg={0.25} md={0} sx={{display: 'flex', alignItems: 'flex-start', width: '100%', minHeight: '100%', justifyContent: 'flex-start'}}>
                        <Box sx={{minHeight: '100%', width: '100%', mb: '2px', display: 'flex'}}>
                            <Divider orientation="vertical" sx={{minHeight: '100%'}} flexItem/>
                        </Box>
                    </Grid>
                    <Grid item md={12} lg={5}>
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 3, height: '100%', width: '100%', ml: 2}}>
                            <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
                                <Typography sx={{  fontFamily: "'SF Pro Text'",
                                    fontStyle: "normal",
                                    fontWeight: 700,
                                    fontSize: "16px",
                                    lineHeight: "175%",
                                    letterSpacing: "0.15px",
                                    color: "ActionDefinationHeroTextColor1.main"}}
                                >
                                    Parameter Description
                                </Typography>
                                <Typography sx={{
                                    fontFamily: "'SF Pro Text'",
                                    fontStyle: "normal",
                                    fontWeight: 400,
                                    fontSize: "14px",
                                    lineHeight: "143%",
                                    letterSpacing: "0.15px",
                                    color: "rgba(66, 82, 110, 0.86)"
                                }}
                                >
                                    {configureParametersContext?.parameters?.[configureParametersContext.currentParameterIndex || 0]?.model?.Description || "Description NA"}
                                </Typography>
                            </Box>
                            <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
                                <Typography sx={{
                                    fontStyle: "normal",
                                    fontWeight: 700,
                                    fontSize: "16px",
                                    lineHeight: "175%",
                                    letterSpacing: "0.15px",
                                    color: "ActionDefinationHeroTextColor1.main"
                                }}>
                                    Parameter Type
                                </Typography>
                                <Typography sx={{
                                    fontFamily: "'SF Pro Text'",
                                    fontStyle: "normal",
                                    fontWeight: 400,
                                    fontSize: "14px",
                                    lineHeight: "143%",
                                    letterSpacing: "0.15px",
                                    color: "rgba(66, 82, 110, 0.86)"
                                }}>
                                    {getTypeDescription(getInputTypeFromAttributesNew(configureParametersContext.selectedActionTemplate?.Language || "python", parameter?.model?.Tag, parameter?.model?.Type, parameter?.model?.Datatype))}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default ActionAndParameterConfig