import { Box, Grid, Typography, Card, Button, Dialog, DialogContent } from "@mui/material";
import React from "react";
import ActionParameterDefinitionTag from "../../../enums/ActionParameterDefinitionTag";
import { ActionParameterDefinition, ActionParameterInstance, TableProperties } from "../../../generated/entities/Entities";
import { TablePropertiesInfo } from "../../../generated/interfaces/Interfaces";
import { UseGetTableModel } from "../../table_browser/components/AllTableViewHooks";
import ActionDefinitionId from "../../../enums/ActionDefinitionId";
import LoadingIndicator from "../../../common/components/LoadingIndicator";
import ViewActionExecution from "../../view_action_execution/VIewActionExecution";
import ViewActionExecutionOutput from "../../view_action_execution/ViewActionExecutionOutput";
import ActionDefinitionPresentationFormat from "../../../enums/ActionDefinitionPresentationFormat";

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
    const [previewDialog, setPreviewDialog] = React.useState({isOpen: false})

    const handleTableFetched = (data: TableProperties) => {
        const tableInfo = JSON.parse(data?.Info || "{}") as TablePropertiesInfo
        const executionId = tableInfo?.SyncOOBActionStatus?.find(oobAction => oobAction.ActionDefinitionId === ActionDefinitionId.TABLE_1000_ROWS)?.ActionExecutionId
        setTablePreviewExecutionId(executionId)
        setPreviewDialog({isOpen: true})
    }

    const tableModelQuery = UseGetTableModel({ options: {enabled: false, onSuccess: handleTableFetched}, tableName: tableName })
    const handleViewTablePreview = () => {
        const tableId = instance.TableId
        if(!!tableId) {
            setTableName(instance.ParameterValue || "NA")
            
        } else {
            setTablePreviewExecutionId(instance.SourceExecutionId)
            setPreviewDialog({isOpen: true})
        }

    }

    React.useEffect(() => {
        if(!!tableName) {
            tableModelQuery.refetch()
        }
    }, [tableName])

    const handlePreviewDialogClose = () => {
        setPreviewDialog({isOpen: false})
        setTableName(undefined)
    }


    return (
        <Card sx={{px: 3, py: 3, maxHeight: '183px', overflowY: 'auto', minHeight: '183px'}}>
            <Dialog open={previewDialog.isOpen} onClose={handlePreviewDialogClose} maxWidth="lg" fullWidth>
                <DialogContent>
                    {tableModelQuery.isLoading ? (
                        <LoadingIndicator/>
                    ) : (<>
                        {tablePreviewExecutionId ? 
                            <ViewActionExecutionOutput 
                                ActionExecution={{Id: tablePreviewExecutionId}}
                                ActionInstance={{Name: "Table Preview"}}
                                ActionDefinition={{PresentationFormat: ActionDefinitionPresentationFormat.TABLE_VALUE}}
                            /> : <>Can't load table preview</>}
                    </>)}
                </DialogContent>
            </Dialog>
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
                <Box sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    {definition.Tag === ActionParameterDefinitionTag.TABLE_NAME || definition.Tag === ActionParameterDefinitionTag.DATA ?  (
                        <Button onClick={handleViewTablePreview}>Preview Table</Button>
                    ) : (
                        <></>
                    )}
                </Box>
            </Box>
        </Card>  
    )
}

export default ViewConfiguredParameters;