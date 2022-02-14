import React from 'react'
import {Box, Grid} from '@material-ui/core'
import dataManagerInstance, {useRetreiveData} from '../../../../data_manager/data_manager'
import {PageHeader} from "../../../../common/components/header/PageHeader";
import {useRouteMatch} from 'react-router-dom'
import LoadingIndicator from '../../../../common/components/LoadingIndicator';
import NoData from '../../../../common/components/NoData'
import {DataGrid} from "@material-ui/data-grid";
import {v4 as uuidv4} from 'uuid'
import {useMutation} from 'react-query';

const entityProperties = {
    DefinitionId: "18",
    TemplateId: "11"
}

const actionParameterProperties = [
    {
        ActionParameterDefinitionId: "17",
        ActionInstanceId: entityProperties.Id,
        ParameterName: "table_name"
    },
    {
        ActionParameterDefinitionId: "18",
        ActionInstanceId: entityProperties.Id,
        ParameterName: "column_name"
    },
    {
        ActionParameterDefinitionId: "19",
        ActionInstanceId: entityProperties.Id,
        ParameterName: "column_value"
    },
    {
        ActionParameterDefinitionId: "20",
        ParameterName: "index",
        ActionInstanceId: entityProperties.Id
    }
]


const SingleDataSetView = () => {
    const match = useRouteMatch()
    const [tableData, setTableData] = React.useState()
    const [localdbId, setlocalDbId] = React.useState()
    const {isLoading: providersLoading, data: providerData, isError: error} = useRetreiveData(
        "ProviderInstance",
        {
            filter: {}
        }
    )

    const getTableDataInstance = useMutation(
        "CreateActionInstance",
        (config) => dataManagerInstance.getInstance.saveData(config.entityName, config.actionProperties),
        {
            onMutate: () => {
            }
        }
    )

    const handleCellChange = (change) => {
        console.log(change)
        const actionInstance = {...entityProperties, ProviderInstanceId: localdbId, Id: uuidv4()}
        const actionProperties = [
            {
                ...actionParameterProperties[0],
                ParameterValue: match.params.tableName,
                Id: uuidv4(),
                ActionInstanceId: actionInstance?.Id
            },
            {
                ...actionParameterProperties[1],
                ParameterValue: change?.field,
                Id: uuidv4(),
                ActionInstanceId: actionInstance?.Id
            },
            {
                ...actionParameterProperties[2],
                ParameterValue: change?.value,
                Id: uuidv4(),
                ActionInstanceId: actionInstance?.Id
            },
            {
                ...actionParameterProperties[3],
                ParameterValue: change?.id,
                Id: uuidv4(),
                ActionInstanceId: actionInstance?.Id
            }
        ]
        getTableDataInstance.mutate({
                entityName: "ActionInstance",
                actionProperties: {
                    entityProperties: actionInstance,
                    ActionParameterInstanceEntityProperties: actionProperties,
                    "withActionParameterInstance": true,
                    "SynchronousActionExecution": true
                }
            },
            {
                onSuccess: () => {
                }
            })
    }

    React.useEffect(() => {
        if (providerData) {
            console.log(providerData)
            const localDb = providerData?.filter(provider => (provider?.Name == "LocalDB"))
            setlocalDbId(localDb[0]?.Id)
            getTableData(localDb[0]?.Id)
        }
    }, [providerData])

    // getTableDataInstance.mutate(
    //     entityName: "ActionInstance",
    //     actionProperties:
    // )

    const getTableData = (localDbId) => {
        console.log(localDbId)
        getTableDataInstance.mutate({
                entityName: "ActionInstance",
                actionProperties: {
                    entityProperties: {
                        Id: uuidv4(),
                        RenderedTemplate: `select * from "${match.params.tableName}" ORDER BY datafacadeindex`,
                        RenderTemplate: false,
                        ProviderInstanceId: `${localDbId}`,
                        DefinitionId: "18",
                    },
                    SynchronousActionExecution: true
                }
            },
            {
                onSuccess: (data) => {
                    console.log(data)
                    const columnData = data[0]?.schema
                    const rowData = data[0]?.data
                    rowData?.reverse()
                    let column = []
                    for (let i = 0; i < columnData?.length; i++) {
                        if (columnData[i].columnName !== 'datafacadeindex')
                            column.push({
                                field: columnData[i].columnName,
                                headerName: columnData[i].columnName,
                                editable: true,
                                flex: 1
                            })
                    }

                    setTableData({
                        rows: rowData.map(row => {
                            return {...row, id: row?.datafacadeindex}
                        }), columns: column
                    })
                }
            })
    }


    if (tableData !== undefined) {
        return (
            <Grid container spacing={0}>
                <PageHeader pageHeading={`Data set : ${match.params.tableName}`} path={match.path}
                            url={match.url}></PageHeader>
                <Box style={{width: '100%'}}>
                    <DataGrid
                        rows={tableData?.rows}
                        columns={tableData?.columns}
                        autoHeight
                        disableSelectionOnClick
                        autoPageSize
                        onCellEditCommit={handleCellChange}
                    >
                    </DataGrid>
                </Box>
            </Grid>
        )
    } else if (error) {
        return (<NoData></NoData>)
    } else {
        return (<LoadingIndicator></LoadingIndicator>)
    }
}

export default SingleDataSetView