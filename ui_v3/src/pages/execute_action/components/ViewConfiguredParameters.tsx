import { Box, Grid, Typography, Card } from "@mui/material";
import ActionParameterDefinitionAttribute from "../../../enums/ActionParameterDefinitionAttribute";
import { ActionParameterDefinition, ActionParameterInstance } from "../../../generated/entities/Entities";

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
    return (
        <Card sx={{px: 3, py: 3, maxHeight: '183px', overflowY: 'auto', minHeight: '183px'}}>
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "120px", width: "100%"}}>
                <Box sx={{width: "100%"}}>
                    <Typography sx={{
                        fontFamily: "SF Pro Text",
                        fontStyle: "normal",
                        fontWeight: 600,
                        fontSize: "12px",
                        lineHeight: "266%",
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                        color: "rgba(66, 82, 110, 0.86)",
                        textAlign: "center",
                        
                    }}>
                        {definition.ParameterName}
                    </Typography>
                </Box>
                <Box sx={{width: "100%"}}>
                    <Typography sx={{
                        fontFamily: "SF Pro Display",
                        fontStyle: "normal",
                        fontWeight: 600,
                        fontSize: "24px",
                        lineHeight: "133.4%",
                        color: "#253858",
                        overflowWrap: 'break-word',
                        textAlign: "center"
                    }}>
                        {instance.ParameterValue}
                    </Typography>
                </Box>
            </Box>
        </Card>  
    )
}

export default ViewConfiguredParameters;