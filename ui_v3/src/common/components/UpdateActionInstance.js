import React, {useContext} from 'react'
import {Button, Grid, MenuItem, Select, TextField} from '@mui/material'
import {useMutation, useQuery} from 'react-query'
import { makeStyles } from '@mui/styles'
import {v4 as uuidv4} from 'uuid'
import LoadingIndicator from './LoadingIndicator'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import AppContext from "../../utils/AppContext";


const endPoint = require("./../config/config").FDSEndpoint

const useStyles = makeStyles(() => ({

    container_root: {
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 20,
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center'
    },
    label: {
        display: 'flex',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10
    },
    input_field: {
        paddingTop: 10,
        paddingBottom: 10
    },
    help_icon: {
        paddingLeft: 10

    }

}));


const IdToElementsMap = {
    1: {
        name: "Is Recurring",
        id: "is-recurring",
        type: "SelectOption"
    },
    2: {
        name: "true",
        id: "is-recurring-true",
        value: "true",
        type: "MenuItem"
    },
    3: {
        name: "false",
        id: "is-recurring-false",
        value: "false",
        type: "MenuItem"
    },
    4: {
        name: "Recurring pattern",
        id: "recurrence-interval",
        type: "TextField"
    },
    5: {
        name: "Upstream Action Instance Id ",
        id: "upstream-action-instance-id",
        type: "SelectOption"
    },
    6: {
        name: "Select",
        id: "default-value-1",
        type: "MenuItem"
    },
    7: {
        name: "Select",
        id: "default-value-2",
        type: "MenuItem"
    }
}

const tree = {
    1: [2, 3, 6],
    2: [4, 5],
    5: [7]
}

const reverseMapForMenuOptions = {
    2: [1],
    3: [1],
    6: [1],
    7: [5],
}

const SelectOption = (props) => {


    const [optionState, setOptionState] = React.useState(props.default)

    const handleSetOptionState = (event) => {
        setOptionState(event.target.value)
        props.selectOptionChangeHandler(event.target.value)
    }

    return (
        <Select
            value={optionState}
            onChange={handleSetOptionState}
            fullWidth
            id={`${props.id}`}
        >
            {tree[props.selectOptionId].map((options) => (
                <MenuItem value={options} id={`${IdToElementsMap[options].id}`}>
                    {IdToElementsMap[options].name}
                </MenuItem>
            ))}
        </Select>
    )
}

const RenderElements = (props) => {

    const classes = useStyles()
    if (props.node === 1) {
        return (
            <>
                <Grid item xs={4} className={classes.label}>
                    Is recurring
                </Grid>
                <Grid item xs={8} className={classes.input_field}>
                    <SelectOption default={6} selectOptionId={props.node}
                                  selectOptionChangeHandler={props.selectOptionChangeHandler}
                                  id={`${IdToElementsMap[props.node].id}`}/>
                </Grid>
            </>
        )
    } else if (props.node === 4) {
        return (
            <>
                <Grid item xs={4} className={classes.label}>
                    {IdToElementsMap[props.node].name}
                </Grid>
                <Grid item xs={8} className={classes.input_field}>
                    <TextField variant="outlined" fullWidth required id={`${IdToElementsMap[props.node].id}`}
                               defaultValue="Daily" InputProps={{readOnly: true}}/>
                </Grid>
            </>
        )

    } else if (props.node === 5) {
        return (
            <>
                <Grid item xs={4} className={classes.label}>
                    {IdToElementsMap[props.node].name}
                </Grid>
                <Grid item xs={8} className={classes.input_field}>
                    <SelectOption default={7} selectOptionId={props.node}
                                  selectOptionChangeHandler={props.selectOptionChangeHandler}
                                  id={`${IdToElementsMap[props.node].id}`}/>
                </Grid>
            </>
        )
    } else {
        return (<></>)
    }
}

const UpdateActionInstance = (props) => {


    const classes = useStyles()
    const [createActionInstanceDialog, setCreateActionInstanceDialog] = React.useState((props.fromTableBrowser !== undefined) ? true : false)
    const [actionDefinitionIdState, setActionDefinitionIdState] = React.useState(0)
    const [upstreamDefinitionNameState, setUpstreamDefinitionNameState] = React.useState('upstream_1')
    const [providerInstanceId, setProviderInstanceIdState] = React.useState()
    const [actionDefinitionDataState, setActionDefinitionDataState] = React.useState()
    const [actionTypeValue, setActionTypeValue] = React.useState("Profiling")
    const [nodesToDisplay, setNodesToDisplay] = React.useState(
        {
            "toRender": [1]
        }
    )
    const [tableParameterName, setTableParameterName] = React.useState((props.fromTableBrowser !== undefined && props.fromTableBrowser.tableName !== undefined) ? props.fromTableBrowser.tableName : 'select')
    const [columnParameterName, setColumnParameterName] = React.useState((props.fromTableBrowser !== undefined && props.fromTableBrowser.columnName !== undefined) ? props.fromTableBrowser.columnName : 'select')
    const [enableForReporting, setEnableForReporting] = React.useState(false)
    const [tablesToShow, setTablesToShow] = React.useState(undefined)
    const appcontext = useContext(AppContext);
    const email = appcontext.userEmail
    const token = appcontext.token


    const fetchActionInstancesConfig = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            "entityName": "ActionInstance",
            "actionProperties": {
                "filter": {
                    "isRecurring": true
                },
                "withDetail": true
            }
        })
    }

    const fetchActionDefinitionConfig = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            "entityName": "ActionDefinition",
            "actionProperties": {
                "filter": {},
                "withActionParameterDefinition": true,
            }
        })
    }

    const fetchProviderInstanceConfig = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            "entityName": "ProviderInstance",
            "actionProperties": {
                "filter": {}
            }
        })
    }
    const tableConfig = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            "entityName": "TableProperties",
            "actionProperties": {
                "filter": {},
                "withTableDetail": true
            }
        })
    }


    const {data} = useQuery('ActionInstancesDataCheck', () =>
        fetch(endPoint + '/entity/getproxy?email=' + email, fetchActionInstancesConfig).then(res => res.json()))

    const {data: actionDefinitionData} = useQuery('ActionDefinitionDataCheck', () =>
        fetch(endPoint + '/entity/getproxy?email=' + email, fetchActionDefinitionConfig).then(res => res.json()))

    const {data: providerInstanceData} = useQuery('FetchProviderInstance', () =>
        fetch(endPoint + '/entity/getproxy?email=' + email, fetchProviderInstanceConfig).then(res => res.json()))

    const {
        isLoading: tableDataLoading,
        error: tableDataError,
        data: tableData
    } = useQuery('GetTableInCreateActionInstanceForm', () =>
        fetch(endPoint + '/entity/getproxy?email=' + email, tableConfig).then(res => res.json()))


    React.useEffect(() => {
        if ((data !== undefined) && (data.length > 0)) {
            setActionDefinitionIdState(0)
            setUpstreamDefinitionNameState(data[0].Id)
            data.forEach((elem, index) => {
                IdToElementsMap[index + 8] = {
                    "name": elem.ActionInstance.Name,
                    "id": "upstream_" + elem.ActionInstance.Id,
                    "value": elem.ActionInstance.Id,
                    "type": "MenuItem"
                }
                tree[5].push(index + 8)
                reverseMapForMenuOptions[index + 8] = [5]
            })
        }
    }, [data])

    React.useEffect(() => {
        if ((providerInstanceData !== undefined) && (providerInstanceData.length > 0) && (tableData !== undefined) && (tableData.length > 0)) {


            setProviderInstanceIdState(props.actionInstance.ProviderInstanceId)
            const tableForProvider = tableData.filter((table) => table.ProviderInstance.Id === props.actionInstance.ProviderInstanceId)
            setTablesToShow({tables: tableForProvider})

        }
    }, [providerInstanceData, tableData])

    React.useEffect(() => {

        if ((actionDefinitionData !== undefined) && (actionDefinitionData.length > 0)) {
            setActionDefinitionDataState(actionDefinitionData.filter((elem) => elem.ActionDefinition.ActionType === props.actionInstance.ActionType))
        }

    }, [actionDefinitionData])

    React.useEffect(() => {
        console.log(props.actionInstance)
        setActionTypeValue(props.actionInstance.ActionType)
        setEnableForReporting(props.actionInstance.EnableForReporting)
    }, [])


    const handleActionDefinitionIdState = (event) => {
        setActionDefinitionIdState(event.target.value)
    }
    const handleProviderInstanceIdState = (event) => {
        setProviderInstanceIdState(event.target.value)
        const tableForProvider = tableData.filter((table) => table.ProviderInstance.Id === event.target.value)
        setTablesToShow({tables: tableForProvider})

    }
    const handleActionTypeValue = (event) => {
        setActionTypeValue(event.target.value)
        let temparr = actionDefinitionData
        temparr = temparr.filter((elem) => elem.ActionDefinition.ActionType === event.target.value)
        setActionDefinitionDataState(temparr)
    }
    const handleTableParameterName = (event) => {
        setTableParameterName(event.target.value)
    }
    const handleColumnParameterName = (event) => {
        setColumnParameterName(event.target.value)
    }
    const handleEnableForReporting = (event) => {
        setEnableForReporting(event.target.value)
    }

    const handleFormOptionChange = (event) => {

        const currNode = event
        let currArray = nodesToDisplay.toRender

        currArray = popElements(currArray, currNode)
        if (IdToElementsMap[currNode].type === 'MenuItem') {
            currArray.push(currNode)
        }
        currArray = bfs(currArray, currArray[currArray.length - 1])
        setNodesToDisplay({"toRender": currArray})

    }
    const bfs = (currArray, node) => {

        if (tree[node] !== undefined) {
            tree[node].map((elem) => currArray.push(elem))
        }
        return currArray

    }
    const popElements = (currArray, node) => {
        //node is a menuItem. Pop all elements from the end till the selectOption for node is reached
        const selectOptionToFind = reverseMapForMenuOptions[node][0]
        while ((currArray.length > 0) && (currArray[currArray.length - 1] !== selectOptionToFind)) {
            currArray.pop()
        }
        return currArray

    }


    let createActionInstanceMutation = useMutation((createInstance) => {

        let body = {
            "entityName": createInstance.entityName,
            "actionProperties": {
                "entityProperties": createInstance.entityProperties,
                "ActionParameterInstanceEntityProperties": createInstance.ActionParameterInstanceEntityProperties,
                "withActionParameterInstance": true
            }
        }
        if (createInstance.slack !== undefined) {
            body.actionProperties["slack"] = createInstance.slack
        }
        if (createInstance.email !== undefined) {
            body.actionProperties["email"] = createInstance.email
        }
        // if(createInstance.entityProperties.ActionType == "CleanupStep"){
        //     body.actionProperties["NoDefaultActionExecution"] = true
        // }

        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }
        console.log(config.body)
        let response = fetch(endPoint + "/entity", config).then(res => res.json())
        return response

    })

    const handleCreateDataCheckInstance = () => {

        const actionInstanceEntityProperties = {}
        actionInstanceEntityProperties["Id"] = uuidv4()
        actionInstanceEntityProperties["DefinitionId"] = actionDefinitionDataState[actionDefinitionIdState].ActionDefinition.Id
        actionInstanceEntityProperties["ActionType"] = actionDefinitionDataState[actionDefinitionIdState].ActionDefinition.ActionType
        actionInstanceEntityProperties["DisplayName"] = document.getElementById("action-instance-name").value
        actionInstanceEntityProperties["Name"] = actionInstanceEntityProperties["DisplayName"] + "-" + actionInstanceEntityProperties["Id"]
        actionInstanceEntityProperties["RenderTemplate"] = true
        actionInstanceEntityProperties["ProviderInstanceId"] = providerInstanceId
        actionInstanceEntityProperties["EnableForReporting"] = enableForReporting

        if (tableParameterName !== "select") {
            const tableModel = tableData.filter((elem) => elem.TableProperties.UniqueName === tableParameterName)
            if (tableModel.length === 1) {
                actionInstanceEntityProperties["TableId"] = tableModel[0].TableProperties.Id
            }
        }
        if (nodesToDisplay.toRender.indexOf(2) >= 0) {
            actionInstanceEntityProperties["IsRecurring"] = true
            actionInstanceEntityProperties["RecurrenceIntervalInSecs"] = 86400
            if (IdToElementsMap[nodesToDisplay.toRender[nodesToDisplay.toRender.length - 1]].value !== undefined)
                actionInstanceEntityProperties["UpstreamActionInstanceId"] = IdToElementsMap[nodesToDisplay.toRender[nodesToDisplay.toRender.length - 1]].value
        } else {
            actionInstanceEntityProperties["IsRecurring"] = false
        }

        const ActionParameterInstanceEntityProperties = []
        actionDefinitionDataState[actionDefinitionIdState].ActionParameterDefinition.filter((parameter) => parameter.Type !== 'run_time' || (parameter.Type === 'run_time' && parameter.Tag === 'data')).forEach((parameter, index) => {
            const newParameter = parameter
            if (parameter.Tag === 'table_name') {
                newParameter["ParameterValue"] = tableParameterName
                const TableId = tableData.filter((elem) => elem.TableProperties.UniqueName === tableParameterName)
                newParameter["TableId"] = TableId[0].TableProperties.Id

            } else if (parameter.Tag === 'column_name') {
                newParameter["ParameterValue"] = columnParameterName
                const table = tableData.filter((elem) => elem.TableProperties.UniqueName === tableParameterName)
                const column = table[0].ColumnProperties.filter((column) => column.UniqueName === columnParameterName)
                newParameter["TableId"] = table[0].TableProperties.Id
                newParameter["ColumnId"] = column[0].Id
            } else {
                const currid = "parameter-value-" + index
                if (parameter.ParameterName === 'StartDate') {
                    const currDate = new Date(document.getElementById(currid).value)
                    let formattedDate = ""

                    if (currDate.getDate() < 10) formattedDate = formattedDate + "0" + currDate.getDate() + "/"
                    else formattedDate += (currDate.getDate() + "/")
                    if ((currDate.getMonth() + 1) < 10) formattedDate += ("0" + (currDate.getMonth() + 1) + "/")
                    else formattedDate += ((currDate.getMonth() + 1) + "/")
                    formattedDate += (currDate.getFullYear())

                    newParameter["ParameterValue"] = formattedDate
                    console.log(newParameter["ParameterValue"])
                } else
                    newParameter["ParameterValue"] = document.getElementById(currid).value
            }
            newParameter["ActionParameterDefinitionId"] = parameter.Id
            newParameter["ActionInstanceId"] = actionInstanceEntityProperties.Id
            newParameter['Id'] = uuidv4()
            ActionParameterInstanceEntityProperties.push(newParameter)
        })


        if ((document.getElementById("slack").value.length > 0) && (document.getElementById("email").value.length > 0)) {
            createActionInstanceMutation.mutate({
                "entityName": "ActionInstance",
                "entityProperties": actionInstanceEntityProperties,
                "ActionParameterInstanceEntityProperties": ActionParameterInstanceEntityProperties,
                "slack": document.getElementById("slack").value,
                "email": document.getElementById("email").value
            })
        } else if (document.getElementById("email").value.length > 0) {
            createActionInstanceMutation.mutate({
                "entityName": "ActionInstance",
                "entityProperties": actionInstanceEntityProperties,
                "ActionParameterInstanceEntityProperties": ActionParameterInstanceEntityProperties,
                "email": document.getElementById("email").value
            })
        } else if (document.getElementById("slack").value.length > 0) {
            createActionInstanceMutation.mutate({
                "entityName": "ActionInstance",
                "entityProperties": actionInstanceEntityProperties,
                "ActionParameterInstanceEntityProperties": ActionParameterInstanceEntityProperties,
                "slack": document.getElementById("slack").value
            })
        } else {
            createActionInstanceMutation.mutate({
                "entityName": "ActionInstance",
                "entityProperties": actionInstanceEntityProperties,
                "ActionParameterInstanceEntityProperties": ActionParameterInstanceEntityProperties
            })
        }

        console.log("entityProperties ", actionInstanceEntityProperties)
        console.log("ActionParameterInstanceEntityProperties ", ActionParameterInstanceEntityProperties)
        props.onCloseDialog()


    }


    return (
        <>
            {((actionDefinitionData !== undefined) && (providerInstanceData !== undefined) && (tableData !== undefined) && (tablesToShow !== undefined)) ? (
                <Grid container spacing={0} style={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingTop: 20,
                    paddingBottom: 20
                }}>
                    <Grid item xs={12} style={{
                        paddingLeft: 10,
                        paddingBottom: 10,
                        fontSize: 18,
                        color: 'green',
                        letterSpacing: 0.3
                    }}>
                        <Grid container spacing={0}>
                            <Grid item xs={6}>
                                UPDATE ACTION INSTANCE
                            </Grid>
                            <Grid item xs={6}
                                  style={{display: 'flex', justifyContent: 'flex-end', color: 'dodgerblue'}}>
                                {/*Add a definition*/}
                            </Grid>
                        </Grid>


                    </Grid>
                    <Grid item xs={4} className={classes.label}>
                        Action Type
                    </Grid>
                    <Grid item xs={7} className={classes.input_field}>
                        <Select
                            variant="outlined"
                            value={actionTypeValue}
                            fullWidth
                            onChange={handleActionTypeValue}
                        >
                            <MenuItem value="Profiling"> Quick Stat </MenuItem>
                            <MenuItem value="Check"> Check </MenuItem>
                            <MenuItem value="Mitigation"> Mitigation </MenuItem>
                            <MenuItem value="CleanupStep"> Cleanup Step </MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={1} className={classes.help_icon}>
                        {/*<HelpIcon tooltipText="Select the type of action definition" />*/}
                    </Grid>
                    <Grid item xs={4} className={classes.label}>
                        Action Definition Name
                    </Grid>
                    <Grid item xs={7} className={classes.input_field}>
                        <Select
                            value={actionDefinitionIdState}
                            fullWidth
                            onChange={handleActionDefinitionIdState}
                            variant="outlined"
                        >
                            {(actionDefinitionDataState !== undefined) ? (actionDefinitionDataState.map((definition, index) => (
                                <MenuItem value={index}> {definition.ActionDefinition.UniqueName} </MenuItem>
                            ))) : (<></>)}

                        </Select>
                    </Grid>
                    <Grid item xs={1} className={classes.help_icon}>
                        {/*<HelpIcon tooltipText="Select the action definition you want your instance to attach" />*/}
                    </Grid>
                    <Grid item xs={4} className={classes.label}>
                        Action Template
                    </Grid>
                    <Grid item xs={8} className={classes.input_field}>
                        {(actionDefinitionDataState !== undefined && actionDefinitionDataState[actionDefinitionIdState] !== undefined) ? (actionDefinitionDataState[actionDefinitionIdState].ActionDefinition.ActionTemplate) : ""}
                    </Grid>

                    <Grid item xs={4} className={classes.label}>
                        Action Instance Name
                    </Grid>
                    <Grid item xs={8} className={classes.input_field}>
                        <TextField variant="outlined" placeholder="Action Instance Name" fullWidth required
                                   id="action-instance-name" defaultValue={props.actionInstance.DisplayName}/>
                    </Grid>
                    <Grid item xs={4} className={classes.label}>
                        Enable for reporting
                    </Grid>
                    {(actionTypeValue === 'Profiling') ? (
                        <Grid item xs={8} className={classes.label}>
                            <Select
                                defaultValue={enableForReporting}
                                fullWidth
                                onChange={handleEnableForReporting}
                            >
                                <MenuItem value={true}>True</MenuItem>
                                <MenuItem value={false}>False</MenuItem>
                            </Select>
                        </Grid>
                    ) : (
                        <Grid item xs={8} className={classes.label}>
                            <Select
                                defaultValue={false}
                                fullWidth
                            >
                                <MenuItem value={false}>False</MenuItem>
                            </Select>
                        </Grid>
                    )}

                    <Grid item xs={4} className={classes.label}>
                        Provider Instance
                    </Grid>
                    <Grid item xs={8} className={classes.input_field}>
                        <Select
                            value={providerInstanceId}
                            fullWidth
                            onChange={handleProviderInstanceIdState}
                        >
                            {providerInstanceData.map((instance, index) => (
                                <MenuItem value={instance.Id}> {instance.Name} </MenuItem>
                            ))}
                        </Select>
                    </Grid>


                    <Grid item xs={4} className={classes.label}>
                        Notify in email
                    </Grid>
                    <Grid item xs={8} className={classes.input_field}>
                        <TextField variant="outlined" placeholder="Email Id" fullWidth required id="email"
                                   type="email"/>
                    </Grid>

                    <Grid item xs={4} className={classes.label}>
                        Notify in slack
                    </Grid>
                    <Grid item xs={8} className={classes.input_field}>
                        <TextField variant="outlined" placeholder="Slack channel" fullWidth required id="slack"
                                   defaultValue="C01NSTT6AA3"/>
                    </Grid>

                    {nodesToDisplay.toRender.map((elem) => (
                        <RenderElements node={elem} selectOptionChangeHandler={handleFormOptionChange}/>
                    ))}

                    <Grid item xs={12} style={{
                        paddingLeft: 10,
                        paddingBottom: 20,
                        paddingTop: 20,
                        fontSize: 18,
                        color: 'green',
                        letterSpacing: 0.3
                    }}>
                        PARAMETER DEFINITION VALUES
                    </Grid>
                    {(actionDefinitionDataState !== undefined && actionDefinitionDataState[actionDefinitionIdState] !== undefined) ? (actionDefinitionDataState[actionDefinitionIdState].ActionParameterDefinition.filter((parameter) => parameter.Type !== 'run_time' || (parameter.Type === 'run_time' && parameter.Tag === 'data')).map((parameter, index) => (
                        <>
                            <Grid item xs={4} className={classes.label}>
                                {parameter.ParameterName}
                            </Grid>
                            <Grid item xs={8} className={classes.input_field}>
                                {(props.fromTableBrowser !== undefined && props.fromTableBrowser.tableName !== undefined && parameter.Tag === 'table_name') ? (
                                    <Select
                                        value={tableParameterName}
                                        onChange={handleTableParameterName}
                                        fullWidth
                                    >
                                        <MenuItem value="select" disabled> Select </MenuItem>
                                        {tablesToShow.tables.map((elem, index) => <MenuItem
                                            value={elem.TableProperties.UniqueName}>{elem.TableProperties.UniqueName}</MenuItem>)}
                                    </Select>
                                ) : (props.fromTableBrowser !== undefined && props.fromTableBrowser.tableName !== undefined && parameter.Tag === 'column_name') ? (
                                    <>
                                        <Select
                                            value={columnParameterName}
                                            onChange={handleColumnParameterName}
                                            fullWidth
                                        >
                                            <MenuItem value="select" disabled> Select </MenuItem>
                                            {(tablesToShow.tables.filter((elem) => elem.TableProperties.UniqueName === tableParameterName).length > 0) ? ((tablesToShow.tables.filter((elem) => elem.TableProperties.UniqueName === tableParameterName)[0].ColumnProperties.map((elem, index) =>
                                                <MenuItem value={elem.UniqueName}>{elem.UniqueName}</MenuItem>
                                            ))) : (<></>)}

                                        </Select>
                                        <div>
                                            {((tablesToShow.tables.filter((elem) => elem.TableProperties.UniqueName === tableParameterName).length > 0) && ((tablesToShow.tables.filter((elem) => elem.TableProperties.UniqueName === tableParameterName)[0].ColumnProperties.length) === 0)) ? (
                                                <div style={{marginTop: 10, marginBottom: 10, color: 'red'}}>No column
                                                    found. Please try syncing the table</div>
                                            ) : (<></>)}
                                        </div>
                                    </>

                                ) : (parameter.Tag === 'table_name') ?
                                    (<Select
                                        value={tableParameterName}
                                        onChange={handleTableParameterName}
                                        fullWidth
                                    >
                                        <MenuItem value="select" disabled> Select </MenuItem>
                                        {tablesToShow.tables.map((elem, index) => <MenuItem
                                            value={elem.TableProperties.UniqueName}>{elem.TableProperties.UniqueName}</MenuItem>)}
                                    </Select>) : (
                                        (parameter.Tag === 'column_name') ? (
                                            <>
                                                <Select
                                                    value={columnParameterName}
                                                    onChange={handleColumnParameterName}
                                                    fullWidth
                                                >
                                                    <MenuItem value="select" disabled> Select </MenuItem>
                                                    {(tablesToShow.tables.filter((elem) => elem.TableProperties.UniqueName === tableParameterName).length > 0) ? ((tablesToShow.tables.filter((elem) => elem.TableProperties.UniqueName === tableParameterName)[0].ColumnProperties.map((elem, index) =>
                                                        <MenuItem value={elem.UniqueName}>{elem.UniqueName}</MenuItem>
                                                    ))) : (<></>)}


                                                </Select>
                                                <div>
                                                    {((tablesToShow.tables.filter((elem) => elem.TableProperties.UniqueName === tableParameterName).length > 0) && ((tablesToShow.tables.filter((elem) => elem.TableProperties.UniqueName === tableParameterName)[0].ColumnProperties.length) === 0)) ? (
                                                        <div style={{marginTop: 10, marginBottom: 10, color: 'red'}}>No
                                                            column found. Please try syncing the table</div>
                                                    ) : (<></>)}
                                                </div>
                                            </>

                                        ) : (
                                            (parameter.ParameterName === 'DateFormat') ? (
                                                    <TextField variant="outlined" value="dd/MM/yyyy" fullWidth
                                                               InputProps={{readOnly: true}}
                                                               id={`parameter-value-${index}`}/>) :
                                                ((parameter.ParameterName === 'StartDate') ?
                                                    (<TextField type="date" fullWidth variant="outlined"
                                                                id={`parameter-value-${index}`}/>) :
                                                    (<TextField fullWidth variant="outlined"
                                                                id={`parameter-value-${index}`}/>)))
                                    )}
                            </Grid>
                        </>
                    ))) : (<></>)}

                    <Grid item xs={12} style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Button variant="outlined" disableElevation onClick={handleCreateDataCheckInstance} style={{
                            height: 55,
                            backgroundColor: 'green',
                            color: 'white',
                            alignItems: 'center',
                            display: 'flex'
                        }}>
                            Create
                        </Button>
                        {
                            (createActionInstanceMutation.isLoading || createActionInstanceMutation.isError) ? (
                                <Grid item
                                      style={{marginLeft: 10, marginTop: 20, display: 'flex', alignItems: 'center'}}>
                                    <LoadingIndicator/>
                                </Grid>
                            ) : ((createActionInstanceMutation.isSuccess) ? ((
                                <Grid item style={{
                                    marginLeft: 10,
                                    marginTop: 20,
                                    display: 'flex',
                                    justifyItems: 'center',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: 'green',
                                    letterSpacing: 0.6
                                }}>
                                    <CheckCircleOutlinedIcon style={{color: 'green'}}/>&nbsp;Instance Created
                                </Grid>
                            )) : (<></>))
                        }
                    </Grid>
                </Grid>

            ) : (<LoadingIndicator/>)}
        </>
    )

}
export default UpdateActionInstance