import React from 'react'
import Editor from "react-simple-code-editor";
import { Box, Button, Dialog, Grid, IconButton, TextField, Tooltip } from '@material-ui/core'
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';
import { v4 as uuidv4 } from 'uuid';
import { useMutation } from 'react-query'
import LoadingIndicator from './../../../common/components/LoadingIndicator'
import labels from './../../../labels/labels'
import dataManagerInstance from './../../../data_manager/data_manager'
import useStyles from './../../../css/customizations/ActionInstancesRow'
import CloseIcon from '@material-ui/icons/Close';
import { highlight, languages } from "prismjs/components/prism-core"
import "prismjs/components/prism-clike";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-python"
import "prismjs/themes/prism.css";
import * as PropTypes from "prop-types";
import { useFetchActionInstancesQuery } from "./ActionInstances";
import { useRouteMatch } from "react-router-dom";
import NoData from "../../../common/components/NoData";
import QueryData from "../../../common/components/QueryData"
import PreviewIcon from "@mui/icons-material/Preview";
import CodeEditor from '../../../common/components/CodeEditor';


let languagesMap = {
    "python": {
        "Value": "python",
        "Language": languages.python,
        "Code": `# write your code here`
    },
    "sql": {
        "Value": "sql",
        "Language": languages.sql,
        "Code": `/* write your code here */`
    }
}

export function ActionInstanceDetails() {

    const match = useRouteMatch();
    const Id = match.params.Id;
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [queryData, setQueryData] = React.useState({})
    const { isLoading, error, data: actionInstancesData } = useFetchActionInstancesQuery({
        Id: Id
    });
    console.log(actionInstancesData)
    const data = actionInstancesData?.[0];
    const classes = useStyles();
    const actionExecutionMutation = useMutation((execution) => {

        const config = dataManagerInstance.getInstance.saveData(execution.entityName, {
            "entityProperties": execution.entityProperties
        })

        return config.then(res => res.json())
    })
    const createActionExecutionMutation = useMutation((execution) => {

        const config = dataManagerInstance.getInstance.saveData(execution.entityName, {
            "entityProperties": execution.entityProperties
        })

        return config.then(res => res)
    })

    const formActionExecutionProperties = () => {
        const actionExecutionProperties = {}
        actionExecutionProperties["Id"] = uuidv4()
        actionExecutionProperties["ExecutionStartedOn"] = parseInt(Date.now() / 1000)
        actionExecutionProperties["Status"] = "Created"
        actionExecutionProperties["InstanceId"] = data?.ActionInstance?.Id
        actionExecutionProperties["ActionInstanceName"] = data?.ActionInstance?.Name

        return actionExecutionProperties
    }
    const handleCreateActionExecution = () => {

        const actionExecutionProperties = formActionExecutionProperties()

        createActionExecutionMutation.mutate({
            "entityName": labels.entities.ActionExecution,
            "entityProperties": actionExecutionProperties
        }, {
            onSuccess: (data, variables, context) => {
                console.log('SUCCESS')
            },
            onError: (error, variables, context) => {
                console.log(error)
                console.log('ERROR')
            }
        })
    }

    const handleCreateActionExecutionSynchronous = () => {
        const actionExecutionProperties = formActionExecutionProperties()
        actionExecutionProperties["IsSynchronous"] = true

        createActionExecutionMutation.mutate({
            "entityName": labels.entities.ActionExecution,
            "entityProperties": actionExecutionProperties
        }, {
            onSuccess: (data, variables, context) => {
                console.log(data)
                setQueryData(data)
                setIsDialogOpen(true)
            }
        })
    }
    if (isLoading) {
        return (<LoadingIndicator />)
    } else if (error) {
        return (<NoData />)
    }

    const handleQueryDataDialogClose = () => {
        setIsDialogOpen(false)
    }

    return <Grid container>
        <Dialog onClose={handleQueryDataDialogClose} open={isDialogOpen} fullWidth
            classes={{ paper: classes.dialogPaper }} scroll="paper">
            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton aria-label="close" onClick={handleQueryDataDialogClose}>
                    <CloseIcon />
                </IconButton>
            </Grid>
            <Grid item xs={12}>
                <Box mx={2} my={1}>
                    <QueryData props={queryData} />
                </Box>
            </Grid>
        </Dialog>
        <Grid item xs={12} className={classes.action_instance}>
            Action Instance Details
        </Grid>
        <Grid container spacing={2}>
            <Grid item>
                <TextField multiline defaultValue={data?.ActionInstance?.DisplayName} label="Display Name"
                    variant="outlined" InputProps={{ readOnly: "true" }} />
            </Grid>
            <Grid item>
                <TextField multiline defaultValue={data?.ActionInstance?.Name} label="Name" variant="outlined"
                    InputProps={{ readOnly: "true" }} />
            </Grid>
            {/* <Grid item>
                <TextField multiline defaultValue={data?.ActionInstance?.RenderedTemplate} label="Rendered Template"
                           variant="outlined" InputProps={{readOnly: "true"}}/>
            </Grid> */}


        </Grid>
        <Grid item xs={12} className={classes.action_parameter}>
            Action Parameter Instance Details
        </Grid>
        {
            data?.ActionParameterInstance?.map((parameterInstance, index) => (
                <Grid container spacing={2} key={index}>
                    <Grid item>
                        <TextField defaultValue={parameterInstance.ParameterValue}
                            label="Parameter Value" variant="outlined" />
                    </Grid>
                </Grid>
            ))
        }
        <Box padding={1}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Button variant="outlined" className={classes.execute_button}
                        onClick={handleCreateActionExecution}>
                        {labels.CustomizationActionInstanceRow.execute}
                    </Button>
                    {
                        (createActionExecutionMutation.isLoading || createActionExecutionMutation.isError) ? (
                            <Grid item container alignItems="center" className={classes.mutation_result}>
                                <LoadingIndicator />
                            </Grid>
                        ) : ((createActionExecutionMutation.isSuccess) ? ((
                            <Grid item container className={classes.mutation_result} alignItems="center"
                                justify="center">
                                <CheckCircleOutlinedIcon
                                    style={{ color: "green" }} />&nbsp;{labels.CustomizationActionInstanceRow.execution_created}
                            </Grid>
                        )) : (<></>))
                    }
                </Grid>
                <Grid item xs={6}>
                    <Button variant="outlined" className={classes.execute_button}
                        onClick={handleCreateActionExecutionSynchronous}>
                        Execute Synchronous
                    </Button>
                </Grid>

            </Grid>
        </Box>

    </Grid>;
}


export function ShowActionTemplate(data) {
    let lang = languagesMap.sql.Value
    if (data.ActionDefinition?.QueryLanguage === 'python' || data.ActionDefinition?.QueryLanguage === 'python')
        lang = languagesMap.python.Value
    const [actionTemplateOpen, setActionTemplateOpen] = React.useState(false)
    const [code, setCode] = React.useState(languagesMap.sql.Code)
    const [language, setLanguage] = React.useState(lang)
    const classes = useStyles();

    const handleOpenActionTemplateDialog = (event) => {
        event?.stopPropagation();
        setActionTemplateOpen(true)
    }
    const handleCloseActionTemplateDialog = () => {
        setActionTemplateOpen(false)
    }
    return <>
        <Tooltip title="View Action Template">
            <IconButton
                onClick={handleOpenActionTemplateDialog}
                color="primary"
                aria-label="View Action Template"
            >
                <PreviewIcon />
            </IconButton>
        </Tooltip>
        <Dialog onClose={handleCloseActionTemplateDialog} open={actionTemplateOpen} fullWidth
            classes={{ paper: classes.dialogPaper }} scroll="paper">
            <Grid item xs={12} container justify="flex-end">
                <IconButton aria-label="close" onClick={handleCloseActionTemplateDialog}>
                    <CloseIcon />
                </IconButton>
                <Grid item xs={12} style={{ maxHeight: 400, height: 400, padding: 10 }}>
                    <Box border={1} borderColor="#bdbdbd">
                        {
                            data?.ActionInstance?.RenderedTemplate && <CodeEditor
                                code={data.ActionInstance?.RenderedTemplate}
                                language={language}
                                onCodeChange={(e) => {
                                    setCode(e);
                                }}
                            />
                        }
                    </Box>
                </Grid>
            </Grid>
        </Dialog>
    </>;
}

ShowActionTemplate.propTypes = {
    onClick: PropTypes.func,
    onClose: PropTypes.func,
    open: PropTypes.bool,
    classes: PropTypes.any,
    data: PropTypes.any,
    language: PropTypes.string
};
export default ShowActionTemplate;