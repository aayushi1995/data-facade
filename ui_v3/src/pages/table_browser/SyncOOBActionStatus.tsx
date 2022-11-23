import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import { Box, Button, Divider, Grid, LinearProgress, MenuItem, MenuList, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useHistory, useRouteMatch } from "react-router"
import { DATA_ALL_TABLES_ROUTE } from '../../common/components/header/data/DataRoutesConfig'
import { ReactQueryWrapper } from "../../common/components/ReactQueryWrapper"
import ActionExecutionStatus from "../../enums/ActionExecutionStatus"
import { OOBActionStatus, TablePropertiesInfo } from "../../generated/interfaces/Interfaces"
import ViewActionExecution from "../view_action_execution/VIewActionExecution"
import SyncingLogo from "./../../common/components/logos/SyncingLogo"
import { UseActionDefinitionModel, useDeleteTables, UseGetTableModel, useReSyncTables } from "./components/AllTableViewHooks"

const SyncOOBActionExecutionStatus = () => { 
    const match = useRouteMatch<{ TableName: string }>()
    const history = useHistory()
    const tableName = match.params.TableName
    const tableModelQuery = UseGetTableModel({ options: {}, tableName: tableName })
    const deleteTableMutation = useDeleteTables({ options: {}, tableId: tableModelQuery?.data?.Id })
    const reSyncTablesMutation = useReSyncTables({ options: {}, tableId: tableModelQuery?.data?.Id })
   
    const [selectedADId, setSelectedADId] = useState<string | undefined>()
    const tableInfo = JSON.parse(tableModelQuery?.data?.Info || "{}") as TablePropertiesInfo
    const aEIdForSelectedADId = tableInfo?.SyncOOBActionStatus?.find?.(oobAction => oobAction?.ActionDefinitionId === selectedADId)?.ActionExecutionId
    
    const deleteTable = () => {
        if(!!tableModelQuery?.data?.Id)
        deleteTableMutation.mutate([tableModelQuery?.data?.Id])
    }

    const reSyncTable = () => {
        if(!!tableModelQuery?.data?.Id)
        reSyncTablesMutation.mutate([tableModelQuery?.data?.Id])
    }

    useEffect(() => {
        const firstADId = tableInfo?.SyncOOBActionStatus?.[0]?.ActionDefinitionId
        !!firstADId && setSelectedADId(firstADId)
    }, [tableModelQuery?.data])

    return (
        <ReactQueryWrapper
            isLoading={tableModelQuery.isLoading}
            error={tableModelQuery.error}
            data={tableModelQuery.data}
            children={() => 
                <ReactQueryWrapper
                    isLoading={tableModelQuery.isLoading}
                    error={tableModelQuery.error}
                    data={tableModelQuery.data}
                    children={() => 
                        <Box sx={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", gap: 1 }}>
                            <Grid container sx={{ flex: 1, maxHeight: "100%", overflowY: "auto" }}>
                                <Grid item xs={12} sm={12} md={4} lg={3} sx={{ maxHeight: "100%", overflowY: "auto"}}>
                                    <Box sx={{ display: "flex", flexDirection: "column", flex: 1}}>
                                        <Box>
                                            <Typography>
                                                OOB Actions
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Divider orientation="horizontal"/>
                                        </Box>
                                        <Box>
                                            <MenuList>
                                                {tableInfo.SyncOOBActionStatus?.map?.(oobAction => 
                                                    <MenuItem selected={selectedADId === oobAction?.ActionDefinitionId} onClick={() => setSelectedADId(oobAction?.ActionDefinitionId)} sx={{ px: 0 }}>
                                                        <ActionMenuItem {...oobAction}/>
                                                    </MenuItem>,
                                                )}
                                            </MenuList>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={12} md={8} lg={9} sx={{ display: "flex", flexDirection: "row", maxHeight: "100%", overflowY: "auto" }}>
                                    <Box sx={{ display: { xs: "none", md: "block"}, px: 1 }}>
                                        <Divider orientation="vertical"/>
                                    </Box>
                                    { !!aEIdForSelectedADId ?
                                        <ViewActionExecution actionExecutionId={aEIdForSelectedADId}/>
                                        :
                                        <Box>
                                            <Typography>
                                                Action Execution Not Created
                                            </Typography>
                                        </Box>
                                    }
                                </Grid>
                            </Grid>
                            <Box>
                                <Divider orientation="horizontal"/>
                            </Box>  
                            <Box>
                                <Box sx={{ display: "flex", flexDirection: "row-reverse", width: "100%", height: "100%", gap: 3 }}>
                                    <Box>
                                        <Button variant="contained" onClick={() => reSyncTable()}>
                                            Sync Table
                                        </Button>
                                        {reSyncTablesMutation.isLoading && <LinearProgress variant="indeterminate"/>}
                                    </Box>
                                    <Box>
                                        <Button variant="contained" sx={{ backgroundColor: '#F44336' }} onClick={() => deleteTable()}>
                                            Delete Table
                                        </Button>
                                        {deleteTableMutation.isLoading && <LinearProgress variant="indeterminate"/>}
                                    </Box>
                                    <Box>
                                        <Button variant="outlined" onClick={() => history.replace(DATA_ALL_TABLES_ROUTE)}>
                                            Cancel
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    }
                />
            }
        />
    )
}

const ActionMenuItem = (props: OOBActionStatus) => {
    const actionDefinitionQuery = UseActionDefinitionModel({ options: {}, actionDefinitionId: props?.ActionDefinitionId })
    const getIcon = () => {
        if(props?.ActionExecutionStatus === ActionExecutionStatus.COMPLETED) return <CheckCircleIcon height="24px" width="24px" sx={{ color: "#00AA11" }}/>
        else if(props?.ActionExecutionStatus === ActionExecutionStatus.FAILED) return <CancelIcon height="24px" width="24px" sx={{ color: "#FF0000" }}/>
        else if(props?.ActionExecutionStatus === ActionExecutionStatus.CREATED || props?.ActionExecutionStatus === ActionExecutionStatus.STARTED) return <SyncingLogo height="24px" width="24px" color="#FA9705"/>
        else return <QuestionMarkIcon height="24px" width="24px" sx={{ color: "#FFFF00" }}/>
    }

    return (
        <ReactQueryWrapper
            isLoading={actionDefinitionQuery.isLoading}
            error={actionDefinitionQuery.error}
            data={actionDefinitionQuery.data}
            children={() => 
                <Box sx={{ display: "flex", flexDirection: "row", width: "100%", gap: 1}}>
                    <Box sx={{ display: "flex", justifyContent: "flex-start"}}>
                        {getIcon()}
                    </Box>
                    <Box sx={{ flex: 1, maxWidth: "180px", overflowX: "auto", display: "flex", justifyContent: "flex-start" }}>
                        <Typography>
                            {actionDefinitionQuery?.data?.UniqueName}
                        </Typography>
                    </Box>
                </Box>
            }
        />
        
    )
}

export default SyncOOBActionExecutionStatus;