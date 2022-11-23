import React from 'react'
import { useMutation } from 'react-query';
import { Backdrop, Snackbar } from '@mui/material'
import MuiAlert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

import ActionDefinitionForm from './ActionDefinitionForm'
import EntityCreationRequestState from '../../../custom_enums/RequestState.js'
import { getInputTypeFromAttributes } from '../../../custom_enums/ActionParameterDefinitionInputMap.js'
import ApiRequestType from '../../../enums/ApiRequestType.js'

import dataManagerInstance from './../../../data_manager/data_manager'
import { Alert } from '../../../common/components/Alert';

export const updateActionMutationCb = (onMutate) => (updateInstance) => {

    dataManagerInstance.getInstance.patchData(updateInstance.entityName, {
        "filter": updateInstance.filter,
        "newProperties": updateInstance.new.ActionDefinition.model,
        "old": updateInstance.old,
        "new": updateInstance.new,
        withActionTemplate: updateInstance.withActionTemplate,
        onMutate
    })
};

const UpdateActionDefinition = (props) => {
    const [notificationState, setNotificationState] = React.useState({ open: false })
    const [requestState, setRequestState] = React.useState(EntityCreationRequestState.NO_OP)
    const [showBackdrop, setShowBackdrop] = React.useState(false)

    const handleNotificationClose = (event, reason) => {
        setNotificationState({ open: false });
    };

    const onMutate = variables => {
        setRequestState(EntityCreationRequestState.LOADING)
    }

    const updateActionMutation = useMutation(
        updateActionMutationCb(onMutate)
    );
    const onUpdate = (actionDefinitionFromForm, actionTemplatesWithParametersFromForm) => {
        var isValid = true
        for (let eachActionTemplate of actionTemplatesWithParametersFromForm) {
            const oldActionTemplateWithParameter = props.data.ActionTemplatesWithParameters.filter(actionTemplateWithParameter => actionTemplateWithParameter.model.Id === eachActionTemplate.model.Id)
            console.log(eachActionTemplate, props.data.ActionTemplatesWithParameters)
            if (oldActionTemplateWithParameter.length > 0) {
                const validOrNot = checkUpdateValid(actionDefinitionFromForm.model, eachActionTemplate.actionParameterDefinitions, props.data.ActionDefinition.model, oldActionTemplateWithParameter[0].actionParameterDefinitions)
                if (validOrNot[0] == false) {
                    setNotificationState({ open: true, severity: "error", message: validOrNot[1] })
                    isValid = false
                    break
                }
            }
            else {
                setNotificationState({ open: true, severity: "error", message: "Cannot add new template" })
                isValid = false
                break
            }
        }
        console.log({
            "entityName": "ActionDefinition",
            "entityProperties": {},
            "old": {
                ...props.data
            },
            "new": {
                "ActionDefinition": actionDefinitionFromForm,
                "ActionTemplatesWithParameters": actionTemplatesWithParametersFromForm
            }

        })
        console.log(isValid)
        if (isValid) {
            updateActionMutation.mutate({
                "entityName": "ActionDefinition",
                "entityProperties": {},
                "old": {
                    ...props.data
                },
                "new": {
                    "ActionDefinition": actionDefinitionFromForm,
                    "ActionTemplatesWithParameters": actionTemplatesWithParametersFromForm
                },
                "filter": {
                    Id: props.data.ActionDefinition.model.Id
                },
                "withActionTemplate": true
            },
                {
                    onSuccess: (data, variable, context) => {
                        setRequestState(EntityCreationRequestState.SUCCESS)
                        props.onClose()
                    },
                    onError: (data, variable, context) => {
                        console.log("ERROR")
                        setRequestState(EntityCreationRequestState.ERROR)
                    }
                })
        }
    }

    React.useEffect(() => {
        setShowBackdrop(requestState === EntityCreationRequestState.LOADING)
        if (requestState === EntityCreationRequestState.SUCCESS) {
            setNotificationState({ open: true, severity: "success", message: "Action Created" })
        } else if (requestState === EntityCreationRequestState.ERROR) {
            setNotificationState({ open: true, severity: "error", message: "Action Creation Failed" })
        }
    }, [requestState])

    React.useEffect(() => {
        if (!notificationState.open) {
            setRequestState(EntityCreationRequestState.NO_OP)
        }
    }, [notificationState])

    return (
        <React.Fragment>
            <Snackbar open={notificationState.open} autoHideDuration={5000} onClose={handleNotificationClose}>
                <Alert onClose={handleNotificationClose} severity={notificationState.severity}>
                    {notificationState.message}
                </Alert>
            </Snackbar>
            <ActionDefinitionForm
                onSubmit={onUpdate} configs={formConfigsFromPropsData(props.data)} mode={ApiRequestType.UPDATE}
                onClose={props.onClose}
            />
            <Backdrop open={showBackdrop}>
                <CircularProgress />
            </Backdrop>
        </React.Fragment>
    )
}

const createUpdateRequestParameter = (oldActionDefinition, oldActionParameterDefinitions, newActionDefinition, newActionParameterDefinitions) => {
    const paramNames = oldActionParameterDefinitions.map(paramDef => paramDef.ParameterName)

    let paramUpdateField = []

    for (let paramName of paramNames) {
        const oldParam = oldActionParameterDefinitions.filter(paramDef => paramDef.ParameterName === paramName)[0]
        const newParam = newActionParameterDefinitions.filter(paramDef => paramDef.ParameterName === paramName)[0]
        delete newParam.Id
        paramUpdateField.push([{ Id: oldParam.Id }, newParam])
    }

    delete newActionDefinition.Id
    return [{ Id: oldActionDefinition.Id }, newActionDefinition, paramUpdateField]
}

const checkUpdateValid = (newActionDefinition, newActionParameterDefinitions, oldActionDefinition, oldActionParameterDefinitions) => {
    const oldParamNames = oldActionParameterDefinitions.map(paramDef => paramDef.model.ParameterName)
    const newParamNames = newActionParameterDefinitions.map(paramDef => paramDef.model.ParameterName)

    console.log(oldParamNames, newParamNames)
    if (oldActionDefinition.ActionType !== newActionDefinition.ActionType) {
        return [false, "Action Type cannot be changed"]
    }

    if (oldActionDefinition.PresentationFormat !== newActionDefinition.PresentationFormat) {
        return [false, "Return Type cannot be changed"]
    }

    for (let paramName of newParamNames) {
        if (!(oldParamNames.includes(paramName))) {
            return [false, `Updated Action contains new Parameter ${paramName}`]
        }
    }

    for (let paramName of oldParamNames) {
        if (!(newParamNames.includes(paramName))) {
            return [false, `Updated Action missing Parameter ${paramName}`]
        }
    }



    for (let paramName of oldParamNames) {
        const oldParam = oldActionParameterDefinitions.filter(paramDef => paramDef.model.ParameterName === paramName)[0]
        const newParam = newActionParameterDefinitions.filter(paramDef => paramDef.model.ParameterName === paramName)[0]
        if (oldParam.ParameterName !== newParam.ParameterName) {
            return [false, `Different Parameter Names: ${oldParam.ParameterName} ${newParam.ParameterName}`]
        } else if (!(oldParam.Tag === newParam.Tag && oldParam.Type === newParam.Type && oldParam.Datatype === newParam.Datatype)) {
            return [false, `Input Types don't match for Parameter: ${oldParam.ParameterName}`]
        }
    }

    return [true, "Valid Update"]
}

const formConfigsFromPropsData = (data) => {
    if (data !== undefined) {
        return {
            activeConfig: 0,
            configs: [
                {
                    ActionDefinition: {
                        model: {
                            Id: {
                                isValid: true,
                                value: data.ActionDefinition.model.Id
                            },
                            UniqueName: {
                                isValid: true,
                                value: data.ActionDefinition.model.UniqueName
                            },
                            DisplayName: {
                                isValid: true,
                                value: data.ActionDefinition.model.DisplayName
                            },
                            ActionType: {
                                isValid: true,
                                value: data.ActionDefinition.model.ActionType
                            },
                            PresentationFormat: {
                                isValid: true,
                                value: data.ActionDefinition.model.PresentationFormat
                            }
                        },
                        tags: data.ActionDefinition.tags
                    },
                    ActionTemplates: [
                        ...data.ActionTemplatesWithParameters.map(actionTemplateWithParameters => {
                            const actionParameterDefinitions = {}
                            actionTemplateWithParameters.actionParameterDefinitions.forEach(actionParameterDefinition => {
                                const inputType = getInputTypeFromAttributes(actionTemplateWithParameters.model.Language, actionParameterDefinition.model.Tag, actionParameterDefinition.model.Type, actionParameterDefinition.model.Datatype)
                                actionParameterDefinitions[actionParameterDefinition.model.ParameterName] = {
                                    ...actionParameterDefinition,
                                    model: {
                                        ...actionParameterDefinition.model,
                                        InputType: inputType
                                    }
                                }
                            })
                            return {
                                ActionTemplate: {
                                    model: {
                                        Id: {
                                            value: actionTemplateWithParameters.model.Id,
                                            isValid: true
                                        },
                                        Language: {
                                            value: actionTemplateWithParameters.model.Language,
                                            isValid: true
                                        },
                                        SupportedRuntimeGroup: {
                                            value: actionTemplateWithParameters.model.SupportedRuntimeGroup,
                                            isValid: true
                                        }
                                    },
                                    tags: actionTemplateWithParameters.tags,
                                },
                                ActionParameterDefinitions: actionParameterDefinitions,
                                hasUserEdited: true,
                                code: actionTemplateWithParameters.model.Text
                            }
                        })
                    ],
                    activeTemplateIndex: 0
                }
            ]
        }
    } else {
        return undefined
    }
}

export default UpdateActionDefinition;


