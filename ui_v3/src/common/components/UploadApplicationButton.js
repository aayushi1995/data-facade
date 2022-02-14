import React from 'react'
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    List,
    Tabs,
    Tab,
    ListItem,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    Typography,
    Fab,
    Autocomplete,
    TextField,
    TableRow
} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {useMutation} from 'react-query'

import AddIcon from "@material-ui/icons/Add";
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';

import ExternalStorageUploadRequestContentType from './../../enums/ExternalStorageUploadRequestContentType'
import S3UploadState from './../../custom_enums/S3UploadState'
import ApplicationInstallState from './../../custom_enums/ApplicationInstallState'

import DisplaySelectedFilesDetail from './DisplaySelectedFilesDetail'

import dataManagerInstance from './../../data_manager/data_manager'
import labels from '../../labels/labels'


const useStyles = makeStyles(() => ({
    requiredTags: {
        width: "100%",
        height: 200,
        overflow: 'auto',
    },
    displayFileDetail: {
        height: 200,
        overflow: 'auto',
        width: "100%"
    },
    dialog: {
        display: 'flex',
        justifyContent: 'space-between',
        borderBottom: '1px solid'
    },
    dialogPaper: {
        minWidth: 700,
        height: "auto",
        overflowY: "hidden"
    },
    columnSchemaDefault: {
        // background: "#DBFCFE"
    },
    columnPropertiesList: {
        height: 600,
        overflow: 'auto',
        width: "100%",
    },
    selectEmpty: {},
    disabledButton: {
        background: "#classes"
    },
    TablePreview: {
        width: "100%",
    },
    TablePreviewBox: {
        height: 600,
        overflow: 'auto',
        width: '100%'
    },
    TableNameTextField: {
        height: 75,
    },
    ColumnSearchTextField: {
        height: 75
    },
    TagDropDown: {
        maxHeight: 75
    }
}))


const UploadApplicationButton = (props) => {
    const classes = useStyles();
    // States
    const [dialogState, setDialogState] = React.useState({isDialogOpen: false})
    const [activeTab, setActiveTab] = React.useState(0);


    const handleDialogClose = () => {
        setDialogState(oldState => {
                return {
                    ...oldState,
                    isDialogOpen: false
                }
            }
        )
    }
    const memoizedHandleDialogClose = React.useCallback(handleDialogClose)

    const handleDialogOpen = () => {
        setDialogState(oldState => {
                return {
                    ...oldState,
                    isDialogOpen: true
                }
            }
        )
    }

    
    const handleTabChange = (event, newValue) => {
        console.log(newValue)
      setActiveTab(newValue);
    };

    return (
        <>
            <Button color="primary" onClick={handleDialogOpen} variant="contained">
                <AddIcon fontSize="small"/> Import Application
            </Button>
            <Dialog onClose={handleDialogClose} open={dialogState.isDialogOpen}
                    classes={{paper: classes.dialogPaper}} scroll="paper">
                <Grid item xs={12} className={classes.dialog}>
                    <DialogTitle id="simple-dialog-title">
                        <Box mx={1} py={0}>
                            Application
                        </Box>
                    </DialogTitle>
                    <IconButton aria-label="close" onClick={handleDialogClose}>
                        <CloseIcon/>
                    </IconButton>
                </Grid>
                <DialogContent className={classes.dialog}>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs
                                value={activeTab}
                                onChange={handleTabChange}
                                textColor="secondary"
                                indicatorColor="secondary"
                                aria-label="secondary tabs example"
                            >
                                <Tab label="Build" {...a11yProps(0)}/>
                                <Tab label="Load" {...a11yProps(1)}/>
                            </Tabs>
                            <TabPanel value={activeTab} index={0}>
                                <BuildApplicationDialogContent closeDialogFunction={memoizedHandleDialogClose}/>
                            </TabPanel>
                            <TabPanel value={activeTab} index={1}>
                                <LoadApplicationDialogContent closeDialogFunction={memoizedHandleDialogClose}/>
                            </TabPanel>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}

const BuildApplicationDialogContent = (props) => {
    const classes = useStyles()
    const [selectedFile, setSelectedFile] = React.useState();
    const [applicationConfig, setApplicationConfig] = React.useState({Name: ""})
    const [uploadState, setUploadState] = React.useState(S3UploadState.NO_FILE_SELECTED)
    const [uploadButtonState, setUploadButtonState] = React.useState({
        currentEnabled: 4,
        requiredEnabled: 7
    })
    const [applicationInstallationKey, setApplicationInstallationKey] = React.useState()
    // Upload Button is enabled if all bits are set
    // 2^0: File type/size valid
    // 2^1: File name valid
    // 2^2: No Upload already in progress

    const fetchPresignedUrlMutation = useMutation(
        "GetS3PreSignedUrl",
        (config) => dataManagerInstance.getInstance.s3PresignedUploadUrlRequest(config.file, config.expirationDurationInMinutes, ExternalStorageUploadRequestContentType.RAW_APPLICATION),
        {
            onMutate: variables => {
                setUploadState(S3UploadState.PRESIGNED_URL_FETCH_LOADING)
                disableUploadButton(4)
            }
        }
    )

    const uploadToS3Mutation = useMutation(
        "UploadToS3",
        (config) => dataManagerInstance.getInstance.s3UploadRequest(config.requestUrl, config.headers, config.file),
        {
            onMutate: variables => {
                setUploadState(S3UploadState.S3_UPLOAD_LOADING)
                disableUploadButton(4)
            }
        }
    )

    const parseApplicationMutation = useMutation(
        "ParseUploadedApplication",
        (config) => dataManagerInstance.getInstance.parseApplicationRequest(config),
        {
            onMutate: variables => {
                setUploadState(S3UploadState.PARSING_APPLICATION)
                disableUploadButton(4)
            }
        }
    )
    const enableUploadButton = (value) => {
        setUploadButtonState(old => {
            return {
                ...old,
                currentEnabled: old.currentEnabled | value
            }
        })
    }

    const disableUploadButton = (value) => {
        setUploadButtonState(old => {
            return {
                ...old,
                currentEnabled: (old.requiredEnabled ^ value) & old.currentEnabled
            }
        })
    }

    const fileChangeHandler = (event) => {
        const file = event.target.files[0]
        if (file !== undefined) {
            if (file.size < 40000000) {
                setUploadState(S3UploadState.SELECTED_FILE_OK)
                setSelectedFile(file);
                enableUploadButton(1)
                setApplicationInstallationKey(undefined)
            } else {
                setUploadState(S3UploadState.SELECTED_FILE_TOO_LARGE)
                setSelectedFile(undefined);
                disableUploadButton(1)
            }
        }
    };

    const installApplication = () => {
        const uploadedFileName = formFinalApplicationName(applicationConfig.Name, selectedFile)
        const newFile = new File([selectedFile], uploadedFileName, {type: selectedFile.type});
        fetchPresignedUrlMutation.mutate(
            {file: newFile, expirationDurationInMinutes: 5},
            {
                onSuccess: (data, variables, context) => {
                    setUploadState(S3UploadState.PRESIGNED_URL_FETCH_SUCCESS)
                    enableUploadButton(4)
                    uploadToS3Mutation.mutate(
                        {requestUrl: data.requestUrl, headers: data.headers, file: variables.file},
                        {
                            onSuccess: () => {
                                setUploadState(S3UploadState.APPLICATION_UPLOADED)
                                enableUploadButton(4)
                                parseApplicationMutation.mutate(
                                    {
                                        action: "Build",
                                        source: "S3",
                                        applicationFileName: uploadedFileName,
                                        completePath: false
                                    },
                                    {
                                        onSuccess: (parsedApplicationData, parsedApplicationVariables, parsedApplicationContext) => {
                                            setApplicationInstallationKey(parsedApplicationData["parsedApplicationStoragePath"])
                                            setUploadState(S3UploadState.APPLICATION_PARSED)
                                            enableUploadButton(4)
                                        },
                                        onError: (errorData, errorContext, errorVariables) => {
                                            setUploadState(S3UploadState.APPLICATION_PARSING_FAILED(errorData))
                                            enableUploadButton(4)
                                        }
                                    }
                                )
                            },
                            onError: (data, variables, context) => {
                                setUploadState(S3UploadState.S3_UPLOAD_ERROR)
                                enableUploadButton(4)
                            }
                        }
                    )
                },
                onError: (data, variables, context) => {
                    setUploadState(S3UploadState.PRESIGNED_URL_FETCH_ERROR)
                    enableUploadButton(4)
                } 
            }
        )
    }

    const setApplicationName = (newName) => {
        setApplicationConfig(oldConfig => {
            return {
                ...oldConfig,
                Name: newName
            }
        })
    }

    // Responsible for setting the Application name when a File is selectd
    React.useEffect(() => {
        if(!!selectedFile) {
            setApplicationName(selectedFile.name.split('.').slice(0, -1).join('.'))
        }
    }, [selectedFile])

    // Responsible for checking if the Application name is valid
    React.useEffect(() => {
        if(isValidObjectName(applicationConfig.Name)) {
            enableUploadButton(2)
        } else {
            disableUploadButton(2)
        }
    }, [applicationConfig.Name])

    return (
        <Grid container spacing={1}>
            {selectedFile && <Grid item xs={12}> 
                <Grid contianer item xs={12}>
                    <ApplicationConfigControlPlane enableUploadButton={enableUploadButton} disableUploadButton={disableUploadButton} applicationConfig={applicationConfig} setApplicationName={setApplicationName}/>
                </Grid>
                <Grid container item xs={12}>
                    <DisplaySelectedFilesDetail selectedFile={selectedFile} />
                </Grid>
                {applicationInstallationKey!==undefined &&
                    <Grid xs={12}>
                        <Box pt={2} pb={1}>
                            <TextField
                                disabled
                                fullWidth
                                id="outlined-disabled"
                                label="Application Installation Key"
                                rowsMax="4"
                                value={applicationInstallationKey}
                            />
                        </Box>
                    </Grid>
                }
            </Grid>}
            <Grid container item xs={12} alignItems="center" spacing={2}>
                <Grid item xs={12}>
                    <Box style={{height: "auto"}}>
                        <TextField
                            disabled
                            multiline
                            rows={4}
                            fullWidth
                            id="outlined-disabled"
                            label="Status"
                            rowsMax={8}
                            value={uploadState.message}
                        />
                    </Box>
                </Grid>
                <Grid item xs={3}>
                    <Button color="primary" component="label" variant="contained">
                        Select File
                        <input type="file" accept={".zip"} hidden onChange={fileChangeHandler}/>
                    </Button>
                </Grid>
                <Grid item xs={2}>
                    {selectedFile && <Button variant="contained" component="label" onClick={installApplication}
                                             classes={{root: "select-all", disabled: classes.disabledButton}}
                                             disabled={uploadButtonState.currentEnabled !== uploadButtonState.requiredEnabled}>
                        Upload
                    </Button>}
                </Grid>
                <Grid container item xs={7} justifyContent="flex-end">
                    {selectedFile && <Grid item xs={6} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>{uploadState.icon}</Grid>}
                </Grid>
            </Grid>
        </Grid>
    )
}

const ApplicationConfigControlPlane = (props) => {
    const {enableUploadButton, disableUploadButton, applicationConfig, setApplicationName} = props

    return (
        <Grid container>
            <Grid item xs={12}>
                <TextField
                    label="Application Name"
                    value={applicationConfig.Name}
                    onChange={(event) => {
                        setApplicationName(event.target.value)
                    }}
                />
            </Grid>
        </Grid>
    )
}

const LoadApplicationDialogContent = (props) => {
    const [s3Path, setS3Path] = React.useState("")
    const [loadingApplication, setLoadingApplication] = React.useState(ApplicationInstallState.NO_INSTALL_IN_PROGRESS) 

    const loadApplicationRequest = useMutation("InstallApplication", 
        (artifactLocation) => {
            const installApplication = dataManagerInstance.getInstance.saveData(labels.entities.APPLICATION,
                {
                    entityProperties: {
                        ArtifactLocation: artifactLocation
                    },
                    LoadFromExternalSource: true
                }
            )
            return installApplication
        },
        {
            onMutate: variables => {
                setLoadingApplication(true)
                setLoadingApplication(ApplicationInstallState.INSTALL_IN_PROGRESS)
            }
        }
    )

    const installApplication = () => {
        loadApplicationRequest.mutate(s3Path,
            {
                onSuccess: (data, variables, context) => {
                    console.log(data)
                    if(!!data & data.length>0){
                        setLoadingApplication(ApplicationInstallState.INSTALL_SUCCESSFUL)
                    } else {
                        setLoadingApplication(ApplicationInstallState.INSTALL_FAILED)
                    }
                },
                onError: () => {
                    setLoadingApplication(ApplicationInstallState.INSTALL_FAILED)
                }
            }
        )
    }

    return(
        <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12}>
                <TextField
                    label="Installation Key / Name"
                    value={s3Path}
                    onChange={(event) => {
                        setS3Path(event.target.value)
                    }}
                    fullWidth
                />
            </Grid>
            <Grid container item xs={12} alignItems="center">
                <Grid item xs={2}>
                    <Button color="primary" onClick={installApplication} variant="contained">
                        Install
                    </Button>
                </Grid>
                <Grid item xs={4}>
                    <Box style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                        }}
                    >
                        {loadingApplication.icon}
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        disabled
                        multiline
                        rows={1}
                        fullWidth
                        id="outlined-disabled"
                        label="Status"
                        rowsMax="4"
                        value={loadingApplication.messageP}
                    />
                </Grid>
            </Grid>
        </Grid>
    )
}

const isValidObjectName = (name) => {
    if (name !== undefined) {
        return !(name.includes(`"`) || name.length === 0)
    } else {
        return false;
    }
}

const formFinalApplicationName = (applicationName, selectedFile) => {
    return applicationName + "." +selectedFile.name.split(".").at(-1)
}


function TabPanel(props) {
const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
        {value === index && (
            <Box sx={{ pt: 2, pb: 1 }}>
                <Typography>{children}</Typography>
            </Box>
        )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

export default UploadApplicationButton;