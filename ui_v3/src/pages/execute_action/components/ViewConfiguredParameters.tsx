import { Box, Grid, Typography, Card, Button, Dialog, DialogContent } from "@mui/material";
import React from "react";
import ActionParameterDefinitionTag from "../../../enums/ActionParameterDefinitionTag";
import { ActionParameterDefinition, ActionParameterInstance, TableProperties } from "../../../generated/entities/Entities";
import ViewTablePreview from "./ViewTablePreview";
import PreviewIcon from '@mui/icons-material/Preview';
export interface ViewConfiguredParametersProps {
    parameterDefinitions: ActionParameterDefinition[]
    parameterInstances: ActionParameterInstance[]
}

const ViewConfiguredParameters = (props: ViewConfiguredParametersProps) => {
    const params = props.parameterInstances.flatMap(api => {
        const apd = props.parameterDefinitions.find(apd => apd.Id===api.ActionParameterDefinitionId)
        if(!!api && !!apd){
            return [(
                <Grid item xs={12} md={3} lg={2}>
                    <ConfiguredParameter
                        definition={apd!}
                        instance={api!}
                    />
                </Grid>
            )]
        }
    })

    return (
        <Grid container spacing={3}>
            {params}
        </Grid>
    )
}

const ConfiguredParameter = (props: {definition: ActionParameterDefinition, instance: ActionParameterInstance}) => {
    const {definition, instance} = props
    const [tablePreviewExecutionId, setTablePreviewExecutionId] = React.useState<string | undefined>()
    const [tableName, setTableName] = React.useState<string | undefined>()
    const [showPreview, setShowPreview] = React.useState(false)
    console.log(showPreview)

    const handleViewTablePreview = () => {
        const tableId = instance.TableId
        if(!!tableId) {
            setTableName(instance.ParameterValue || "NA")
            
        } else {
            setTablePreviewExecutionId(instance.SourceExecutionId)
        }
        setShowPreview(true)
    }

    const ParamNameTypo = {
                        fontFamily: "SF Pro Text",
                        fontStyle: "normal",
                        fontWeight: 600,
                        fontSize: "1.2rem",
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                        color: "#050505",
    }
    const ParamValueTypo = {
        fontFamily: "SF Pro Display",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "1rem",
        lineHeight: "133.4%",
        color: "#253858",
        overflowWrap: 'break-word',
    }

    const cardDesign = {
        p:1, 
        maxHeight: '183px', 
        overflowY: 'auto', 
        minHeight: '183px'
    }
    const ParamContainer = {
        display: "flex", 
        flexDirection: "column",  
        minHeight: "120px", 
        width: "100%"
    }
    return (
        <Card sx={{...cardDesign}}>
            {!!tableName || !!tablePreviewExecutionId ? <ViewTablePreview showPreview={showPreview} setShowPreview={setShowPreview} tableName={tableName} tablePreviewExecutionId={tablePreviewExecutionId}/> : <></>}
            <Box sx={{...ParamContainer}}>
                <Box sx={{width: "100%",display:'flex'}}>
                    <Typography sx={{
                        ...ParamNameTypo
                    }}>
                        {definition.ParameterName}
                    </Typography>
                    <Box sx={{width: '100%', display: 'flex',ml:'auto',justifyContent:'flex-end'}}>
                    {definition.Tag === ActionParameterDefinitionTag.TABLE_NAME || definition.Tag === ActionParameterDefinitionTag.DATA ?  (
                        <PreviewIcon sx={{cursor:"pointer",color:'gray'}} onClick={handleViewTablePreview}/>
                    ) : (
                        <></>
                    )}
                </Box>
                </Box>
                <Box sx={{width: "100%",mt:1}}>
                    <Typography sx={{
                        ...ParamValueTypo
                    }}>
                        {instance.ParameterValue}
                    </Typography>
                </Box>
                
            </Box>
        </Card>  
    )
}

export default ViewConfiguredParameters;