import React from 'react'

import {v4 as uuidv4} from 'uuid'
import { makeStyles } from '@mui/styles'
import {
    AppBar,
    Box,
    Button,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    Menu,
    MenuItem,
    Select,
    Tabs,
    TextField
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add';

import TabWithClose from '../../../common/components/TabWithClose.js'
import CodeEditor from './../../../common/components/CodeEditor.js'
import SelectTags from './../../../common/components/SelectTags.js'

import ApiRequestType from '../../../enums/ApiRequestType.js'
import ActionDefinitionQueryLanguage from '../../../enums/ActionDefinitionQueryLanguage.js'
import ActionDefinitionActionType from '../../../enums/ActionDefinitionActionType.js'
import ActionDefinitionPresentationFormat from '../../../enums/ActionDefinitionPresentationFormat.js'
import ActionParameterDefinitionInputType from '../../../enums/ActionParameterDefinitionInputType.js'
import TagScope from '../../../enums/TagScope.js'
import TagGroups from '../../../enums/TagGroups.js'
import TemplateSupportedRuntimeGroup from '../../../enums/TemplateSupportedRuntimeGroup'

import getDefaultCode from '../../../custom_enums/DefaultCode.js';
import {getLanguage} from '../../../custom_enums/SupportedRuntimeGroupToLanguage.js'
import ActionTypeToSupportedRuntimes from '../../../custom_enums/ActionTypeToSupportedRuntimes.js'

import './../../../css/customizations/CodeEditor.css'

import {InputMap} from '../../../custom_enums/ActionParameterDefinitionInputMap.js';
import HelpInfo from '../../../custom_enums/HelpInfo.js';
import AppendHelpInfo from '../../../common/components/AppendHelpInfo.js'
import EditTags from '../../../common/components/EditTags.js';


const useStyles = makeStyles(() => ({
    blue2: {
        background: "#CBF1F5"
    },
    blue1: {
        background: "#E3FDFD"
    },
    queryLanguageForm: {
        width: 200,
    },
    otherActionDefinitionForm: {
        minWidth: 175
    },
    parameterSearch: {
        width: 400
    },
    parameterInputTypeSelect: {
        width: 400
    },
    tabPanel: {
        flexGrow: 1,
        width: '100%',
    },
    smallTextBox: {
        height: 5
    },
    parameterForm: {
        width: "100%",
        minWidth: 150
    }
}))

/*
Config Responsibilities
1. Maintain Language Specific History
2. Maintain Action Definition and Action Parameter Definition Config

{
    configs: [
        {
            ActionDefinition: {
                model: {
                    {Attribute}: {
                        isValid: {boolean}
                        value: ""
                    }
                },
                tags: [TAG3, TAG4]
            },
            ActionTemplates: [
                {
                    ActionTemplate: {
                        model: {

                        },
                        tags: [TAG3, TAG4]
                    },
                    ActionParameterDefinitions: {
                        {parameterName}: {
                            model: {

                            },
                            tags: [TAG1, TAG2]
                        }
                    },
                    hasUserEdited: {boolean},
                    code: ""
                }
            ],
            activeTemplateIndex: ""
        }
    ],
    activeConfig: 0
}
*/

const ActionDefinitionForm = (props) => {
    const readOnly = props.readOnly || false
    const classes = useStyles();
    const [configs, setConfigs] = React.useState(getInitialConfigs(props))

    const getNameOfConfig = (config) => {
        return config.ActionDefinition.model.UniqueName.value || "Unnamed"
    }

    // Get Active Template Name
    const getActiveTemplateIndex = (config) => {
        return config.activeTemplateIndex
    }

    // Get Active Template
    const getActiveTemplate = (config) => {
        return config.ActionTemplates[getActiveTemplateIndex(config)]
    }

    // Get Active Config Index
    const getActiveConfigIndex = (configs) => {
        return configs.activeConfig
    }

    // Get Active Config
    const getActiveConfig = (configs) => {
        return configs.configs[getActiveConfigIndex(configs)]
    }

    // New Create Action Definition Tab
    const createTab = () => {
        setConfigs(oldConfigs => {
            return {
                ...oldConfigs,
                configs: [
                    ...oldConfigs.configs,
                    getInitialConfig()
                ]
            }
        })
    }

    // Changed Active Create Action Definition Tab
    const changeTab = (event, newValue) => {
        setConfigs(oldConfigs => {
            return {
                ...oldConfigs,
                activeConfig: newValue
            }
        })
    }

    // Closed Create Action Definition Tab
    const onCloseTab = (value) => {
        setConfigs(oldConfigs => {
            if (oldConfigs.configs.length === 1) {
                return oldConfigs
            } else {
                if (value > oldConfigs.activeConfig) {
                    return {
                        ...oldConfigs,
                        configs: [
                            ...oldConfigs.configs.slice(0, value),
                            ...oldConfigs.configs.slice(value + 1)
                        ]
                    }
                } else {
                    return {
                        ...oldConfigs,
                        activeConfig: Math.max(0, oldConfigs.activeConfig - 1),
                        configs: [
                            ...oldConfigs.configs.slice(0, value),
                            ...oldConfigs.configs.slice(value + 1)
                        ]
                    }
                }
            }
        })
    }

    // Triggered when user enters something
    const onCodeChange = (newCode) => {
        setConfigs(oldConfigs => {
            const activeConfigIndex = getActiveConfigIndex(oldConfigs)
            const activeConfig = getActiveConfig(oldConfigs)
            const activeTemplateIndex = getActiveTemplateIndex(activeConfig)
            const activeTemplate = getActiveTemplate(activeConfig)

            const newActiveTemplate = {
                ...activeTemplate,
                hasUserEdited: true,
                code: newCode
            }
            const newActiveConfig = {
                ...activeConfig,
                ActionTemplates: [
                    ...activeConfig.ActionTemplates.slice(0, activeTemplateIndex),
                    newActiveTemplate,
                    ...activeConfig.ActionTemplates.slice(activeTemplateIndex + 1),

                ]
            }

            return {
                ...oldConfigs,
                configs: [
                    ...oldConfigs.configs.slice(0, activeConfigIndex),
                    newActiveConfig,
                    ...oldConfigs.configs.slice(activeConfigIndex + 1)
                ]
            }
        })
    }

    // Returns Active Code
    const getActiveCode = () => {
        // console.log(configs)
        return getActiveTemplate(getActiveConfig(configs)).code
    }

    // Returns Action Type of Active Config
    const getActiveActionType = (config) => {
        return config.ActionDefinition.model.ActionType.value;
    }

    // Updates active config with new Values
    const updateActiveConfig = (updatedActiveConfig) => {
        setConfigs(oldConfigs => {
            const activeConfigIndex = getActiveConfigIndex(oldConfigs)
            return {
                ...oldConfigs,
                configs: [
                    ...oldConfigs.configs.slice(0, activeConfigIndex),
                    {
                        ...getActiveConfig(oldConfigs),
                        ...updatedActiveConfig
                    }
                    ,
                    ...oldConfigs.configs.slice(activeConfigIndex + 1),
                ]
            }
        })
    }

    // Updates active template with new values
    const updateActiveTemplate = (updatedActiveTemplate) => {
        setConfigs(oldConfigs => {
            const activeConfigIndex = getActiveConfigIndex(oldConfigs)
            const activeConfig = getActiveConfig(oldConfigs)
            const activeTemplateIndex = getActiveTemplateIndex(activeConfig)
            const activeTemplate = getActiveTemplate(activeConfig)

            return {
                ...oldConfigs,
                configs: [
                    ...oldConfigs.configs.slice(0, activeConfigIndex),
                    {
                        ...activeConfig,
                        ActionTemplates: [
                            ...activeConfig.ActionTemplates.slice(0, activeTemplateIndex),
                            {
                                ...activeTemplate,
                                ...updatedActiveTemplate
                            },
                            ...activeConfig.ActionTemplates.slice(activeTemplateIndex + 1)
                        ]
                    }
                    ,
                    ...oldConfigs.configs.slice(activeConfigIndex + 1),
                ]
            }
        })
    }

    const submitDefinitionWithParams = () => {
        const activeConfig = getActiveConfig(configs)
        const actionDefinition = {
            model: {},
            tags: activeConfig.ActionDefinition.tags
        }

        const actionTemplatesWithParameters = []

        for (const [key, value] of Object.entries(activeConfig.ActionDefinition.model)) {
            actionDefinition.model[key] = value.value
        }

        for (const actionTemplate of activeConfig.ActionTemplates) {
            const parsedActionParameterDefinitions = Object.values(actionTemplate.ActionParameterDefinitions).map(actionParameterDefinition => {
                const tags = actionParameterDefinition.tags
                const model = {
                    ...actionParameterDefinition.model,
                    ...InputMap[actionTemplate.ActionTemplate.model.Language.value][actionParameterDefinition.model.InputType]
                }

                return {
                    model: model,
                    tags: tags
                }
            })
            const actionTemplatesWithParameter = {
                model: {},
                tags: actionTemplate.ActionTemplate.tags,
                actionParameterDefinitions: parsedActionParameterDefinitions
            }
            for (const [key, value] of Object.entries(actionTemplate.ActionTemplate.model)) {
                actionTemplatesWithParameter.model[key] = value.value
            }
            actionTemplatesWithParameter.model["Text"] = actionTemplate.code

            actionTemplatesWithParameters.push(actionTemplatesWithParameter)

        }

        props.onSubmit(actionDefinition, actionTemplatesWithParameters)
    }

    // This hook is responsible for making sure only valid fields are marked for rendering
    React.useEffect(() => {
        setConfigs(oldConfigs => {
            const activeConfigIndex = getActiveConfigIndex(oldConfigs)
            const activeConfig = getActiveConfig(oldConfigs)

            const newActionDefinition = {
                PresentationFormat: {
                    value: activeConfig.ActionDefinition.model.PresentationFormat.value,
                    isValid: activeConfig.ActionDefinition.model.ActionType.value === ActionDefinitionActionType.PROFILING
                }
            }

            return {
                ...oldConfigs,
                configs: [
                    ...oldConfigs.configs.slice(0, activeConfigIndex),
                    {
                        ...activeConfig,
                        ActionDefinition: {
                            ...activeConfig.ActionDefinition,
                            model: {
                                ...activeConfig.ActionDefinition.model,
                                ...newActionDefinition
                            }
                        }
                    },
                    ...oldConfigs.configs.slice(activeConfigIndex + 1)
                ]
            }
        })
    }, [JSON.stringify(getActiveConfig(configs).ActionDefinition.model)])

    // This hook is responsible for filling in the default code
    React.useEffect(() => {
        setConfigs(oldConfigs => {
            const activeConfigIndex = getActiveConfigIndex(oldConfigs)
            const activeConfig = getActiveConfig(oldConfigs)
            const activeTemplateIndex = getActiveTemplateIndex(activeConfig)
            const activeTemplate = getActiveTemplate(activeConfig)

            if (!activeTemplate.hasUserEdited) {
                return {
                    ...oldConfigs,
                    configs: [
                        ...oldConfigs.configs.slice(0, activeConfigIndex),
                        {
                            ...activeConfig,
                            ActionTemplates: [
                                ...activeConfig.ActionTemplates.slice(0, activeTemplateIndex),
                                {
                                    ...activeTemplate,
                                    code: getDefaultCode(activeConfig.ActionDefinition.model.ActionType.value, activeTemplate.ActionTemplate.model.SupportedRuntimeGroup.value)
                                },
                                ...activeConfig.ActionTemplates.slice(activeTemplateIndex + 1),
                            ]
                        },
                        ...oldConfigs.configs.slice(activeConfigIndex + 1)
                    ]
                }
            } else {
                return oldConfigs
            }
        })
    }, [getActiveActionType(getActiveConfig(configs)), getActiveTemplateIndex(getActiveConfig(configs)), configs.configs.length, getActiveConfigIndex(configs)])

    // This hook is responsible for parsing the code to find new parameters
    React.useEffect(() => {
        setConfigs(oldConfigs => {
            const activeConfigIndex = getActiveConfigIndex(oldConfigs)
            const activeConfig = getActiveConfig(oldConfigs)
            const activeTemplateIndex = getActiveTemplateIndex(activeConfig)
            const activeTemplate = getActiveTemplate(activeConfig)

            const parameterNames = extractParametersFromCode(getActiveCode(), activeTemplate.ActionTemplate.model.Language.value)
            const newParameterDefinitions = {}

            const getParameter = (parameterName) => {
                return activeTemplate.ActionParameterDefinitions[parameterName]
            }

            parameterNames.forEach(parameterName => {
                newParameterDefinitions[parameterName] = getParameter(parameterName) || getDefaultParameterDefinition(parameterName)
            })

            return {
                ...oldConfigs,
                configs: [
                    ...oldConfigs.configs.slice(0, activeConfigIndex),
                    {
                        ...activeConfig,
                        ActionTemplates: [
                            ...activeConfig.ActionTemplates.slice(0, activeTemplateIndex),
                            {
                                ...activeTemplate,
                                ActionParameterDefinitions: newParameterDefinitions
                            },
                            ...activeConfig.ActionTemplates.slice(activeTemplateIndex + 1),
                        ]
                    },
                    ...oldConfigs.configs.slice(activeConfigIndex + 1)
                ]
            }
        })
    }, [getActiveCode(), configs.activeConfig, configs.configs.length])

    // This hook is responsible for making sure that only valid ActionTemplates ActionType combo is present
    React.useEffect(() => {
        setConfigs(oldConfigs => {
            const activeConfigIndex = getActiveConfigIndex(oldConfigs)
            const activeConfig = getActiveConfig(oldConfigs)
            const activeTemplateIndex = getActiveTemplateIndex(activeConfig)
            const activeTemplate = getActiveTemplate(activeConfig)

            const newTemplates = activeConfig.ActionTemplates.filter(actionTemplate =>
                ActionTypeToSupportedRuntimes[activeConfig.ActionDefinition.model.ActionType.value].includes(actionTemplate.ActionTemplate.model.SupportedRuntimeGroup.value))
            console.log(newTemplates)
            return {
                ...oldConfigs,
                configs: [
                    ...oldConfigs.configs.slice(0, activeConfigIndex),
                    {
                        ...activeConfig,
                        ActionTemplates: newTemplates
                    },
                    ...oldConfigs.configs.slice(activeConfigIndex + 1)
                ]
            }
        })
    }, [getActiveConfig(configs).ActionDefinition.model.ActionType.value])
    return (
        <React.Fragment>
            <Grid container spacing={2}>
                {props.mode === ApiRequestType.CREATE &&
                <Grid container item xs={12}>
                    <Grid item xs={11}>
                        <div className={classes.tabPanel}>
                            <AppBar position="static" color="default">
                                <Tabs
                                    value={configs.activeConfig}
                                    onChange={changeTab}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    aria-label="scrollable auto tabs example"
                                >
                                    {configs.configs.map((config, index) => {
                                        return <TabWithClose label={getNameOfConfig(config)}  {...a11yProps(index)}
                                                             onCloseTab={onCloseTab}/>
                                    })}
                                </Tabs>
                            </AppBar>
                        </div>
                    </Grid>
                    <Grid container item xs={1} justify="center">
                        <AppendHelpInfo Info={HelpInfo.ADD_ACTION_DEFINITION} proportion={6}>
                            <IconButton onClick={createTab}>
                                <AddIcon/>
                            </IconButton>
                        </AppendHelpInfo>
                    </Grid>
                </Grid>
                }
                <Grid container item xs={12} spacing={1}>
                    <Grid container item xs={12}>
                        <ActionDefinitionModelConfigPlane config={getActiveConfig(configs)}
                                                          updateConfig={updateActiveConfig} readOnly={readOnly}/>
                    </Grid>
                    <Grid container item xs={12}>
                        <Grid container item xs={12}>
                            <RuntimeControlPlane config={getActiveConfig(configs)} updateConfig={updateActiveConfig}
                                                 readOnly={readOnly}/>
                        </Grid>
                        <Grid container item xs={12}>
                            <CodeEditor
                                code={getActiveCode()}
                                onCodeChange={onCodeChange}
                                language={getLanguage(getActiveTemplateIndex(getActiveConfig(configs)))}
                                readOnly={readOnly}
                            />
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} spacing={2}>
                        <Grid item xs={12}>
                            <ActionDefinitionTagsConfigPlane config={getActiveConfig(configs)}
                                                             updateConfig={updateActiveConfig} readOnly={readOnly}
                                                             mode={props.mode}/>
                        </Grid>
                        <Grid item xs={12}>
                            <AllActionParameterDefinitionConfigPlane
                                template={getActiveTemplate(getActiveConfig(configs))}
                                updateTemplate={updateActiveTemplate} readOnly={readOnly} mode={props.mode}/>
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} direction="row">
                        <Grid container item xs={3}>
                            {!readOnly &&
                            <Grid container item xs={4} direction="row" justify="flex-start">
                                <Button variant="contained" component="label" classes={{root: "select-all"}}
                                        onClick={submitDefinitionWithParams}>
                                    {props.mode}
                                </Button>
                            </Grid>
                            }
                            {!readOnly && <Grid item xs={2}/>}
                            <Grid container item xs={4} direction="row" justify="flex-start">
                                <Button variant="contained" component="label" classes={{root: "delete"}}
                                        onClick={props.onClose}>
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

const ActionDefinitionModelConfigPlane = (props) => {
    const config = props.config
    const classes = useStyles();

    const handleUniqueName = (event) => {
        if (event.target.value !== "Select") {
            const selectedUniqueName = event.target.value
            const newConfig = {
                ActionDefinition: {
                    ...config.ActionDefinition,
                    model: {
                        ...config.ActionDefinition.model,
                        UniqueName: {
                            value: selectedUniqueName,
                            isValid: true
                        },
                        DisplayName: {
                            value: selectedUniqueName,
                            isValid: true
                        }
                    }
                }
            }
            props.updateConfig(newConfig)
        }
    }

    const handleActionType = (event) => {
        if (event.target.value !== "Select") {
            const selectedActionType = event.target.value
            const newConfig = {
                ActionDefinition: {
                    ...config.ActionDefinition,
                    model: {
                        ...config.ActionDefinition.model,
                        ActionType: {
                            value: selectedActionType,
                            isValid: true
                        }
                    }
                }
            }
            props.updateConfig(newConfig)
        }
    }

    const handlePresentationFormat = (event) => {
        if (event.target.value !== "Select") {
            const selectedPresentationFormat = event.target.value
            const newConfig = {
                ActionDefinition: {
                    ...config.ActionDefinition,
                    model: {
                        ...config.ActionDefinition.model,
                        PresentationFormat: {
                            value: selectedPresentationFormat,
                            isValid: true
                        }
                    }
                }
            }
            props.updateConfig(newConfig)
        }
    }

    return (
        <Grid container spacing={2} alignItems="flex-end">
            {(config.ActionDefinition.model?.UniqueName?.isValid) ?
                <Grid container item xs={3}>
                    <Grid item xs={12}>
                        <TextField
                            value={config.ActionDefinition.model?.UniqueName?.value}
                            onChange={handleUniqueName}
                            variant="outlined"
                            label="Action Name"
                            fullWidth
                            InputProps={{readOnly: props.readOnly}}
                        />
                    </Grid>
                </Grid>
                :
                <></>}
            {(config.ActionDefinition.model?.ActionType?.isValid) ?
                <Grid container item xs={3}>
                    <Grid item xs={12}>
                        <AppendHelpInfo Info={HelpInfo.ACTION_DEFINITION_FORM_SELECT_ACTION_TYPE} proportion={4}>
                            <FormControl variant="outlined" className={classes.otherActionDefinitionForm}>
                                <InputLabel>Action Type</InputLabel>
                                <Select
                                    value={config?.ActionDefinition?.model?.ActionType?.value || "Select"}
                                    onChange={handleActionType}
                                    variant="outlined"
                                    label="Action Type"
                                    fullWidth
                                    inputProps={{disabled: props.readOnly}}
                                >
                                    {Object.keys(ActionTypeToSupportedRuntimes).map((actionType) => {
                                        return <MenuItem value={actionType}>{actionType}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </AppendHelpInfo>
                    </Grid>
                </Grid>
                :
                <></>
            }
            {(config.ActionDefinition.model?.PresentationFormat?.isValid) ?
                <Grid container item xs={3}>
                    <Grid item xs={12}>
                        <AppendHelpInfo Info={HelpInfo.ACTION_DEFINITION_FORM_SELECT_PRESENTATION_FORMAT}
                                        proportion={4}>
                            <FormControl variant="outlined" className={classes.otherActionDefinitionForm}>
                                <InputLabel>Return Type</InputLabel>
                                <Select
                                    value={config?.ActionDefinition?.model?.PresentationFormat?.value || "Select"}
                                    onChange={handlePresentationFormat}
                                    variant="outlined"
                                    label="Return Type"
                                    disabled={!config.ActionDefinition.model.PresentationFormat.isValid}
                                    fullWidth
                                >
                                    <MenuItem value={ActionDefinitionPresentationFormat.SINGLE_VALUE}>Single
                                        Value</MenuItem>
                                    <MenuItem value={ActionDefinitionPresentationFormat.TIME_SERIES}>Time
                                        Series</MenuItem>
                                    <MenuItem value={ActionDefinitionPresentationFormat.FREQUENCY}>Frequency</MenuItem>
                                    <MenuItem value={ActionDefinitionPresentationFormat.TABLE_VALUE}>Table</MenuItem>
                                    <MenuItem value={ActionDefinitionPresentationFormat.OBJECT}>Object</MenuItem>
                                </Select>
                            </FormControl>
                        </AppendHelpInfo>
                    </Grid>
                </Grid>
                :
                <></>
            }
        </Grid>
    )
}

const ActionDefinitionTagsConfigPlane = (props) => {
    const config = props.config
    const classes = useStyles();

    const handleTags = (newTags) => {
        const newConfig = {
            ActionDefinition: {
                ...config.ActionDefinition,
                tags: newTags
            }
        }
        props.updateConfig(newConfig)
    }

    return (
        <Box py={1}>
            <Grid container spacing={1} alignItems="center">
                <Grid item xs={3} justifyContent="flex-start">Action Definition Tags</Grid>
                <Grid item xs={9}>
                    {props.mode === ApiRequestType.UPDATE ?
                        <EditTags scope={TagScope.TABLE} setTags={handleTags} RelatedEntityType="ActionDefinition"
                                  RelatedEntityId={config?.ActionDefinition?.model?.Id?.value}/>
                        :
                        <SelectTags tagOptionFilter={{Scope: TagScope.TABLE, TagGroup: TagGroups.GENERIC}}
                                    setTags={handleTags} selectedTags={config.ActionDefinition.tags}
                                    readOnly={props.readOnly}/>
                    }
                </Grid>
            </Grid>
        </Box>
    )
}

const RuntimeControlPlane = (props) => {
    const classes = useStyles()
    const config = props.config
    const readOnly = props.readOnly

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [menuState, setMenuState] = React.useState({IsOpen: false})

    const openMenu = (event) => {
        setAnchorEl(event.currentTarget)
        setMenuState(oldState => {
            return {...oldState, IsOpen: true}
        })
    }
    const closeMenu = () => {
        setAnchorEl(null)
        setMenuState(oldState => {
            return {...oldState, IsOpen: false}
        })
    }

    const addRuntime = (runtime) => {
        closeMenu()
        const newActionTemplates = [
            ...config.ActionTemplates,
            getInitialTemlpate(runtime)
        ]
        props.updateConfig({ActionTemplates: newActionTemplates})
    }

    const removeRuntime = (value) => {
        const newActionTemplates = [
            ...config.ActionTemplates.slice(0, value),
            ...config.ActionTemplates.slice(value + 1),
        ]

        if (newActionTemplates.length > 0) {
            if (value > config.activeTemplateIndex) {
                props.updateConfig({
                    ActionTemplates: newActionTemplates
                })
            } else {
                props.updateConfig({
                    ActionTemplates: newActionTemplates,
                    activeTemplateIndex: Math.max(0, config.activeTemplateIndex - 1)
                })
            }
            props.updateConfig({ActionTemplates: newActionTemplates})
        }
    }

    const setActiveRuntime = (event, newRuntimeIndex) => {
        props.updateConfig({activeTemplateIndex: newRuntimeIndex})
    }

    const getConfiguredRuntimes = () => {
        return config.ActionTemplates.map(template => template.ActionTemplate.model.SupportedRuntimeGroup.value)
    }

    const getAvaialbleRuntimes = () => {
        return readOnly ? [] :
            ActionTypeToSupportedRuntimes[config.ActionDefinition.model.ActionType.value].filter(runtime => !getConfiguredRuntimes().includes(runtime))
    }

    return (
        <Grid container item xs={12}>
            <Grid item xs={11}>
                <div className={classes.tabPanel}>
                    <AppBar position="static" color="default">
                        <Tabs
                            value={config.activeTemplateIndex}
                            onChange={setActiveRuntime}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="scrollable"
                            scrollButtons="auto"
                            aria-label="scrollable auto tabs example"
                        >
                            {getConfiguredRuntimes().map((runtime, index) => {
                                return <TabWithClose label={runtime} value={index} {...a11yProps(index)}
                                                     onCloseTab={removeRuntime} disableClose={readOnly}/>
                            })}
                        </Tabs>
                    </AppBar>
                </div>
            </Grid>
            {getAvaialbleRuntimes().length > 0 ?
                <Grid container item xs={1} justify="center">
                    <AppendHelpInfo Info={HelpInfo.ADD_RUNTIME_GROUP} proportion={6}>
                        <IconButton onClick={openMenu}>
                            <AddIcon/>
                        </IconButton>
                    </AppendHelpInfo>
                    <Menu
                        open={menuState.IsOpen}
                        onClose={closeMenu}
                        anchorEl={anchorEl}
                        keepMounted
                    >
                        {getAvaialbleRuntimes().map((runtime, index) => {
                            return <MenuItem onClick={() => addRuntime(runtime)}>{runtime}</MenuItem>
                        })}
                    </Menu>
                </Grid>
                :
                <></>
            }
        </Grid>
    )
}

const AllActionParameterDefinitionConfigPlane = (props) => {
    const classes = useStyles();
    const [paramSearchQuery, setParamSearchQuery] = React.useState("")
    const [paramSearchResult, setParamSearchResult] = React.useState([])

    const setInputType = React.useCallback((parameterName, inputType) => {
        const template = props.template
        props.updateTemplate(
            {
                ActionParameterDefinitions: {
                    ...template.ActionParameterDefinitions,
                    [parameterName]: {
                        ...template.ActionParameterDefinitions[parameterName],
                        model: {
                            ...template.ActionParameterDefinitions[parameterName].model,
                            InputType: inputType
                        }
                    }
                }
            }
        )
    })
    const setTags = React.useCallback((parameterName, newTags) => {
        const template = props.template
        props.updateTemplate(
            {
                ActionParameterDefinitions: {
                    ...template.ActionParameterDefinitions,
                    [parameterName]: {
                        ...template.ActionParameterDefinitions[parameterName],
                        tags: newTags
                    }
                }
            }
        )
    })

    React.useEffect(() => {
        setParamSearchResult(
            Object.values(props.template.ActionParameterDefinitions).filter(paramDef => paramDef.model.ParameterName.search(paramSearchQuery) >= 0)
        )
    }, [paramSearchQuery, JSON.stringify(props.template.ActionParameterDefinitions)])

    if (Object.keys(props.template.ActionParameterDefinitions).length > 0) {
        return (
            <Grid container spacing={2}>
                <Grid container item xs={12} alignItems="center" justify="left">
                    <Grid item xs={3}>
                        <AppendHelpInfo Info={HelpInfo.ACTION_DEFINITION_FORM_SELECT_PARAMETER} proportion={4}>
                            Parameter Name
                        </AppendHelpInfo>
                    </Grid>
                    <Grid container item xs={1} justify="center">:</Grid>
                    <Grid item xs={8}>
                        <TextField
                            value={paramSearchQuery}
                            onChange={(event) => {
                                setParamSearchQuery(event.target.value)
                            }}
                            variant="outlined"
                            fullWidth
                            placeholder="Search"
                            margin="dense"
                        />
                    </Grid>
                </Grid>
                <Grid container item xs={12}>
                    <Box p={1} style={{border: "1px solid #ced4da", borderRadius: 3, width: '100%'}}>
                        <Box style={{height: 200, overflow: 'auto', width: '100%'}} fullWidth>
                            <Grid container spacing={1} style={{width: "100%"}}>
                                {paramSearchResult.map(paramDef => {
                                    return (
                                        <Grid item xs={6}>
                                            <Box style={{border: "1px solid #ced4da", borderRadius: 3}}>
                                                <ActionParameterDefinitionConfigPlane
                                                    {...paramDef}
                                                    InputTypes={Object.keys(InputMap[props.template.ActionTemplate.model.Language.value])}
                                                    setInputType={setInputType}
                                                    setTags={setTags}
                                                    readOnly={props.readOnly}
                                                    mode={props.mode}
                                                />
                                            </Box>
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        )
    } else {
        return <></>
    }
}

const ActionParameterDefinitionConfigPlane = (props) => {
    const classes = useStyles();
    const handleInputType = (event) => {
        props.setInputType(props.model.ParameterName, event.target.value)
    }
    const setTags = (newTags) => {
        props.setTags(props.model.ParameterName, newTags)
    }

    const getTagSelectComponent = () => {
        if (props.model.InputType === ActionParameterDefinitionInputType.TABLE_NAME) {
            if (props.mode === ApiRequestType.UPDATE) {
                return <EditTags scope={TagScope.TABLE} setTags={setTags} RelatedEntityType="ActionParameterDefinition"
                                 RelatedEntityId={props.model.Id}/>
            } else {
                return <SelectTags tagOptionFilter={{Scope: TagScope.TABLE, TagGroup: TagGroups.GENERIC}}
                                   setTags={setTags} selectedTags={props.tags} readOnly={props.readOnly}/>
            }
        } else {
            if (props.mode === ApiRequestType.UPDATE) {
                return <EditTags scope={TagScope.COLUMN} setTags={setTags} RelatedEntityType="ActionParameterDefinition"
                                 RelatedEntityId={props.model.Id}/>
            } else {
                return <SelectTags tagOptionFilter={{Scope: TagScope.COLUMN, TagGroup: TagGroups.GENERIC}}
                                   setTags={setTags} selectedTags={props.tags} readOnly={props.readOnly}/>
            }
        }
    }
    return (
        <Box p={1} /*style={{background: "#f9f5f5"}}*/>
            <Grid container spacing={1}>
                <Grid container item xs={12} spacing={1}>
                    <Grid container item xs={12} className={classes.parameterForm}>
                        <TextField
                            value={props.model.ParameterName}
                            variant="outlined"
                            fullWidth
                            InputProps={{readOnly: true}}
                            margin="dense"
                        />
                    </Grid>
                    <Grid container item xs={12} className={classes.parameterForm}>
                        <Select
                            value={props.model.InputType}
                            onChange={handleInputType}
                            variant="outlined"
                            fullWidth
                            inputProps={{disabled: props.readOnly}}
                            margin="dense"
                        >
                            {props.InputTypes.map((inputType) => {
                                return <MenuItem value={inputType}>{inputType}</MenuItem>
                            })}
                        </Select>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    {getTagSelectComponent()}
                </Grid>
            </Grid>
        </Box>
    )
}

// Functions to perform state independent operations

const getInitialConfigs = (props) => {
    if ("configs" in props) {
        return props["configs"]
    } else {
        return {
            activeConfig: 0,
            configs: [
                getInitialConfig()
            ]
        }
    }
}

const getInitialConfig = () => {
    return {
        ActionDefinition: {
            model: {
                UniqueName: {
                    isValid: true,
                    value: "My Demo Action"
                },
                DisplayName: {
                    isValid: true,
                    value: "My Demo Action"
                },
                ActionType: {
                    isValid: true,
                    value: ActionDefinitionActionType.PROFILING
                },
                PresentationFormat: {
                    isValid: true,
                    value: ActionDefinitionPresentationFormat.SINGLE_VALUE
                }
            },
            tags: []
        },
        ActionTemplates: [
            getInitialTemlpate(TemplateSupportedRuntimeGroup.PYTHON),
            getInitialTemlpate(TemplateSupportedRuntimeGroup.DATABRICKS_SQL)
        ],
        activeTemplateIndex: 0
    }
}

const getInitialTemlpate = (supportedRuntimeGroup) => {
    return {
        ActionTemplate: {
            model: {
                SupportedRuntimeGroup: {
                    isValid: true,
                    value: supportedRuntimeGroup
                },
                Language: {
                    isValid: true,
                    value: getLanguage(supportedRuntimeGroup)
                }
            },
            tags: []
        },
        ActionParameterDefinitions: {},
        hasUserEdited: false,
        code: ""
    }
}

const extractParametersFromCode = (query, language) => {
    const parametersArray = []
    if (language === ActionDefinitionQueryLanguage.PYTHON) {
        for (let i = 0; i < query.length; i++) {
            if (query.substring(i, i + 3) === "def") {
                let j = i + 4
                if (query.substring(j, j + 7) === "execute") {
                    while (j < query.length && query.charAt(j) !== ',') {
                        j++
                    }
                    let parameter = ""
                    while (j < query.length && query.charAt(j) !== ')') {
                        if (query.charAt(j) !== ',' && query.charAt(j) !== ' ') {
                            parameter = parameter + query.charAt(j)
                        }
                        if (query.charAt(j) === ',' || query.charAt(j + 1) === ')') {
                            if (parameter.length !== 0) {
                                parametersArray.push(parameter)
                                parameter = ""
                            }
                        }
                        j++
                    }
                }
            }
        }
    } else if (language === ActionDefinitionQueryLanguage.SQL) {
        for (let i = 0; i < query.length; i++) {
            if (query.charAt(i) === '}') {
                let j = i - 1
                let parameter = ""
                while (j >= 0 && query.charAt(j) != '{' && query.charAt(j) != '}') {
                    parameter = query.charAt(j) + parameter
                    j--
                }
                parametersArray.push(parameter)
            }
        }
    }
    return parametersArray;
}

const getDefaultParameterDefinition = (parameterName) => {
    if (parameterName.search('table') >= 0) {
        return {
            model: {
                "Id": uuidv4(),
                "ParameterName": parameterName,
                "InputType": ActionParameterDefinitionInputType.TABLE_NAME
            },
            tags: []
        }
    } else if (parameterName.search('column') >= 0) {
        return {
            model: {
                "Id": uuidv4(),
                "ParameterName": parameterName,
                "InputType": ActionParameterDefinitionInputType.COLUMN_NAME
            },
            tags: []
        }
    } else {
        return {
            model: {
                "Id": uuidv4(),
                "ParameterName": parameterName,
                "InputType": ActionParameterDefinitionInputType.STRING
            },
            tags: []
        }
    }
}

function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

export default ActionDefinitionForm;