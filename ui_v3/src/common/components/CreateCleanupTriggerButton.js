import React from 'react'
import { makeStyles } from '@mui/styles'
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    List,
    ListItem,
    TextField
} from '@mui/material'
import ActionDefinitionActionType from './../../enums/ActionDefinitionActionType.js'
import {useMutation} from 'react-query'
import labels from './../../labels/labels'
import dataManagerInstance, {useRetreiveData} from './../../data_manager/data_manager'
import CodeEditor from './CodeEditor.js'
import LoadingIndicator from './LoadingIndicator.js'
import CloseIcon from '@mui/icons-material/Close';


const useStyles = makeStyles(() => ({
    filedetailgrid: {
        background: "#CBF1F5"
    },
    dialog: {
        background: "#E3FDFD"
    },
    tableschemaselector: {
        background: "#CBF1F5"
    },
    formControl: {
        minWidth: 120,
    },
    selectEmpty: {},
    disabledButton: {
        background: "#classes"
    },
    dialogPaper: {
        minHeight: '35vh',
        maxHeight: '50vh',
        minWidth: 1100
    }
}))
// Gets from props
// TableId
// TableName
// TableProviderInstanceId

const CreateCleanupTriggerButton = (props) => {
    const classes = useStyles();
    // States
    const [createCleanupTriggerDialogState, setCreateCleanupTriggerDialogState] = React.useState({isDialogOpen: false})

    const handleDialogClose = () => {
        setCreateCleanupTriggerDialogState(oldState => {
                return {
                    ...oldState,
                    isDialogOpen: false
                }
            }
        )
    }

    const handleDialogOpen = () => {
        setCreateCleanupTriggerDialogState(oldState => {
                return {
                    ...oldState,
                    isDialogOpen: true
                }
            }
        )
    }

    return (
        <>
            <Button variant="contained" onClick={handleDialogOpen}>
                {labels.TableRowExpanded.clean}
            </Button>
            <Dialog onClose={handleDialogClose} open={createCleanupTriggerDialogState.isDialogOpen} fullWidth
                    classes={{paper: classes.dialogPaper}} scroll="paper">
                <DialogTitle style={{marginLeft: "20px", padding: "0px"}}>
                    <Grid container>
                        <Grid container item xs={6} alignItems="center">
                            Transform Table
                        </Grid>
                        <Grid container item xs={6} justify="flex-end" alignItems="center">
                            <IconButton aria-label="close" onClick={handleDialogClose}>
                                <CloseIcon/>
                            </IconButton>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <DialogContent>
                    <Box>
                        <CreateCleanupTriggerDialogContent closeDialog={handleDialogClose} {...props}/>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}

// configuredSteps: {
//     steps: {
//         stepId: {
//             isSelected: BOOLEAN,
//             isPrimarySelected: BOOLEAN,
//             stepConfig: {}
//         }
//     }
// }

const CreateCleanupTriggerDialogContent = (props) => {
    console.log(props)
    const [cleanedTableName, setCleanedTableName] = React.useState(props.TableName?`${props.TableName}_Cleaned`:"")
    // Mutation to create Cleanu Trigger
    const createCleanupTriggerMutation = useMutation(() => {
        dataManagerInstance.getInstance.saveData(
            labels.entities.ActionInstance,
            {
                "entityProperties": {
                    "TableId": props.TableId
                },
                "CreateCleanupTrigger": true,
                "CleanedTableName": cleanedTableName
            })
    })
    // Mutation that deletes Cleanup Steps
    const deleteTablePropertiesMutation = useMutation((cleanupStepids) => {
        const deleteTable = dataManagerInstance.getInstance.deleteData(labels.entities.ActionInstance,
                {
                    filter: {},
                    DeleteMultipleById: true,
                    Ids: cleanupStepids,
                    Soft: true
                })
    })
    // State that stores all management info for the different Cleanup Steps
    const [configuredSteps, setConfiguredSteps] = React.useState(initializeConfiguredStepsState())
    // Fetches the list of Cleanup Steps confiugured on the Table
    const {data} = useRetreiveData(labels.entities.ActionInstance,
        {
            "filter": {
                TableId: props.TableId,
                ActionType: ActionDefinitionActionType.CLEANUP_STEP
            }
        }
    )
    // Change selected status of a Cleanup Step Row
    const memoizedToggleSelected = React.useCallback((cleanupStepId) => {
        setConfiguredSteps(oldConfig => {
            return {
                ...oldConfig,
                steps: {
                    ...oldConfig.steps,
                    [cleanupStepId]: {
                        ...oldConfig.steps[cleanupStepId],
                        isSelected: oldConfig.steps[cleanupStepId].isSelected === false
                    }
                }
            }
        })
    })
    // Select/Unselect All Cleanup Steps as needed
    const memoizedToggleSelectAll = React.useCallback(() => {
        setConfiguredSteps(oldConfiguredStep => {
            const allSelected = areAllSelected(oldConfiguredStep)
            const newSteps = {}
            Object.values(oldConfiguredStep.steps).forEach(step => {
                newSteps[step.stepConfig.Id] = {
                    isSelected: !allSelected,
                    stepConfig: step.stepConfig
                }
            })

            return {
                ...oldConfiguredStep,
                steps: newSteps
            }
        })
    })
    // Check if given step is primary selected
    const isPrimarySelected = (step) => step.stepConfig.Id === configuredSteps.primarySelected
    // Checks if all Cleanup Steps are selected
    const areAllSelected = (givenConfig) => {
        const oldSelectedStatus = Object.values(givenConfig.steps).map(step => step.isSelected)
        return oldSelectedStatus.every(status => status === true)
    }
    // Create Cleanup Trigger for the Table
    const createCleanupTrigger = () => {
        createCleanupTriggerMutation.mutate({}, {
            onSuccess: (data, variable, context) => {
                console.log("Cleanup Trigger Created")
                props.closeDialog()
            },
            onError: () => {
                console.log("Cleanup Trigger Creation Failed")
            }
        })
    }
    // Delete Selected Cleanup Steps
    const deleteSelected = () => {
        const selectedCleanupStepIds = Object.values(configuredSteps.steps).filter(step => step.isSelected === true).map(step => step.stepConfig.Id)
        if (selectedCleanupStepIds.length > 0) {
            deleteTablePropertiesMutation.mutate(selectedCleanupStepIds, {
                onSuccess: (data, varaible, context) => {
                    setConfiguredSteps(oldConfig => {
                        const newSteps = {...oldConfig.steps}
                        selectedCleanupStepIds.forEach(id => delete newSteps[id])
                        return {
                            ...oldConfig,
                            steps: newSteps
                        }
                    })
                }
            })
        }
    }
    // Select Primary Cleanup Action for Preview
    const triggerPrimarySelect = (cleanupStepId) => {
        setConfiguredSteps(oldConfig => {
            return {
                ...oldConfig,
                primarySelected: cleanupStepId
            }
        })
    }
    // Refreshes the list of Cleanup Steps with new Data when available
    React.useEffect(() => {
        if (data !== undefined) {
            setConfiguredSteps(oldConfig => {
                const newSteps = {}
                data.forEach(step => {
                    if (step.Id in oldConfig.steps) {
                        newSteps[step.Id] = {
                            stepConfig: step,
                            isSelected: oldConfig.steps[step.Id].isSelected,
                        }
                    } else {
                        newSteps[step.Id] = {
                            stepConfig: step,
                            isSelected: false,
                        }
                    }
                })
                return {
                    ...oldConfig,
                    steps: newSteps
                }
            })
        }
    }, [JSON.stringify(data)])
    // Makes sure that Primary Selected Cleanup Step is always valid
    React.useEffect(() => {
        setConfiguredSteps(oldConfig => {
            if (oldConfig.primarySelected !== undefined) {
                if (!(oldConfig.primarySelected in oldConfig.steps)) {
                    console.log()
                    if (Object.values(oldConfig.steps).length > 0) {
                        return {
                            ...oldConfig,
                            primarySelected: Object.keys(oldConfig.steps)[0]
                        }
                    } else {
                        return {
                            ...oldConfig,
                            primarySelected: undefined
                        }
                    }
                }
            } else {
                if (Object.values(oldConfig.steps).length > 0) {
                    return {
                        ...oldConfig,
                        primarySelected: Object.keys(oldConfig.steps)[0]
                    }
                }
            }
            return oldConfig
        })
    }, [Object.keys(configuredSteps.steps).length])

    return (
        <Grid container spacing={2}>
            <Grid item xs={7}>
                <CodeEditor
                    code={configuredSteps?.steps[configuredSteps?.primarySelected]?.stepConfig?.RenderedTemplate || labels.TransformDialog.NO_CLEANUP_AVAILABLE}/>
            </Grid>
            <Grid container item xs={5}>
                <Grid container item xs={12}>
                    <ControlPlane areAllSelected={areAllSelected(configuredSteps)}
                                  toggleSelectAll={memoizedToggleSelectAll} deleteSelected={deleteSelected}
                                  cleanedTableName={cleanedTableName} setCleanedTableName={setCleanedTableName}/>
                </Grid>
                <Grid container item xs={12}>
                    <Box my={1} style={{height: "25vh", overflow: 'auto', width: '100%'}} fullWidth>
                        <List>
                            {Object.values(configuredSteps.steps).map(step => {
                                return (
                                    <ListItem>
                                        <CleanupStepRow data={step} toggleSelected={memoizedToggleSelected}
                                                        triggerPrimarySelect={triggerPrimarySelect}
                                                        isPrimarySelected={isPrimarySelected(step)}/>
                                    </ListItem>
                                )
                            })}
                        </List>
                    </Box>
                </Grid>
                <Grid container item xs={12}>
                    <ActionPlane createCleanupTrigger={createCleanupTrigger}
                                 creatingTrigger={createCleanupTriggerMutation.isLoading}/>
                </Grid>
            </Grid>
        </Grid>
    )
}

const ControlPlane = (props) => {
    return (
        <Grid container justify="center" alignItems="center" spacing={1}>
            <Grid container item xs={12} alignItems="center">
                <Box pt={1} style={{width: "100%"}}>
                    <TextField
                        value={props.cleanedTableName||""}
                        onChange={(event) => props.setCleanedTableName(event.target.value)}
                        variant="outlined"
                        label="Transformed Table Name"
                        fullWidth

                    />
                </Box>
            </Grid>
            <Grid container item xs={12} spacing={1} direction="row-reverse" alignItems="center">
                <Grid container justify="flex-end" item xs={3}>
                    <Button variant="contained" classes={{root: "delete"}} onClick={props.deleteSelected}>
                        {labels.TransformDialog.delete}
                    </Button>
                </Grid>
                <Grid container justify="flex-end" item xs={4}>
                    <Button variant="contained" classes={{root: "select-all"}} onClick={props.toggleSelectAll}>
                        {props.areAllSelected ? labels.TransformDialog.unselectAll : labels.TransformDialog.selectAll}
                    </Button>
                </Grid>
                <Grid item xs={5}>
                    Select to remove
                </Grid>
            </Grid>
        </Grid>
    )
}

const ActionPlane = (props) => {
    return (
        <Grid container direction="row">
            <Grid container justify="flex-start" item xs={5}>
                <Button variant="contained" classes={{root: "select-all"}} onClick={props.createCleanupTrigger}>
                    {labels.TransformDialog.clean}
                </Button>
            </Grid>
            {props.creatingTrigger ?
                <Grid container item xs={7}>
                    <LoadingIndicator/>
                </Grid>
                :
                <></>
            }

        </Grid>
    )
}

const CleanupStepRow = (props) => {
    const selectedRowColor = {
        background: props.isPrimarySelected ? "#dbf6e9" : "#ffffff"
    }

    const triggerPrimarySelect = () => {
        props.triggerPrimarySelect(props.data.stepConfig.Id)
    }

    return (
        <Box border={1} borderRadius="10px" style={{width: "100%", height: "100%", ...selectedRowColor}}>
            <Grid container alignItems="center" style={{borderColor: "red", borderWidth: "thick"}}>
                <Grid item xs={2}>
                    <Checkbox
                        onClick={(e) => e.stopPropagation()}
                        onChange={(event) => {
                            props.toggleSelected(props.data.stepConfig.Id)
                        }}
                        checked={props.data.isSelected} color={"primary"}
                        inputProps={{'aria-label': 'primary checkbox'}}
                    />
                </Grid>
                <Grid item xs={7} onClick={triggerPrimarySelect}>
                    {props.data.stepConfig.DisplayName}
                </Grid>
            </Grid>
        </Box>
    )
}

const initializeConfiguredStepsState = () => {
    return {
        steps: [],
        primarySelected: undefined
    }
}
export default CreateCleanupTriggerButton;