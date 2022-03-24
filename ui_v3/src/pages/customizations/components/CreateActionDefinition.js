import React from 'react'
import {useMutation} from 'react-query';
import {v4 as uuidv4} from 'uuid'
import {Backdrop, Snackbar} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress';
import { useHistory } from "react-router-dom";

import ActionDefinitionForm from './ActionDefinitionForm'
import EntityCreationRequestState from '../../../custom_enums/RequestState.js'

import TemplateLanguage from '../../../enums/TemplateLanguage.js'
import ApiRequestType from '../../../enums/ApiRequestType.js'

import dataManagerInstance from './../../../data_manager/data_manager'
import { Alert } from '../../../common/components/Alert';

const CreateActionDefinition = (props) => {
    const [notificationState, setNotificationState] = React.useState({open: false})
    const [requestState, setRequestState] = React.useState(EntityCreationRequestState.NO_OP)
    const [showBackdrop, setShowBackdrop] = React.useState(false)

    let history = useHistory();

    const handleNotificationClose = (event, reason) => {
        history.goBack()
    };
    const handleBackdropClose = () => {
        setShowBackdrop(false)
    }

    const createActionMutation = useMutation((createInstance) => {
        const response = dataManagerInstance.getInstance.saveData(createInstance.entityName, {
                "entityProperties": createInstance.entityProperties,
                "ActionDefinition": createInstance.ActionDefinition,
                "ActionTemplatesWithParameters": createInstance.ActionTemplatesWithParameters,
                "CreateActionDefinitionForm": true
            },
            {
                onMutate: variables => {
                    setRequestState(EntityCreationRequestState.LOADING)
                }
            })
        return response
    })

    const onCreate = (actionDefinitionFromForm, actionTemplatesWithParametersFromForm) => {
        const [actionDefinition, actionTemplatesWithParameters] = assignIdsIfNotPresent(actionDefinitionFromForm, actionTemplatesWithParametersFromForm)
        const [isConfigValid, whyNotValid] = checkValid(actionDefinition, actionTemplatesWithParameters)
        if (isConfigValid) {
            console.log({
                "entityName": "ActionDefinition",
                "entityProperties": {},
                "ActionDefinition": actionDefinition,
                "ActionTemplatesWithParameters": actionTemplatesWithParameters
            })
            createActionMutation.mutate({
                    "entityName": "ActionDefinition",
                    "entityProperties": {},
                    "ActionDefinition": actionDefinition,
                    "ActionTemplatesWithParameters": actionTemplatesWithParameters
                },
                {
                    onSuccess: (data, variable, context) => {
                        setRequestState(EntityCreationRequestState.SUCCESS)
                    },
                    onError: (data, variable, context) => {
                        console.log("ERROR")
                        setRequestState(EntityCreationRequestState.ERROR)
                    }
                })
        } else {
            setNotificationState({open: true, severity: "error", message: whyNotValid})
        }
    }

    React.useEffect(() => {
        setShowBackdrop(requestState === EntityCreationRequestState.LOADING)
        if (requestState === EntityCreationRequestState.SUCCESS) {
            setNotificationState({open: true, severity: "success", message: "Action Created"})
        } else if (requestState === EntityCreationRequestState.ERROR) {
            setNotificationState({open: true, severity: "error", message: "Action Creation Failed"})
        }
    }, [requestState])

    React.useEffect(() => {
        if (!notificationState.open) {
            setRequestState(EntityCreationRequestState.NO_OP)
        }
    }, [notificationState])
    

    return (
        <React.Fragment>
            <Snackbar open={notificationState.open} autoHideDuration={1000} onClose={handleNotificationClose}>
                <Alert 
                 onClose={handleNotificationClose}
                  severity={notificationState.severity}>
                      {notificationState.message}
                  </Alert>
            </Snackbar>
            <ActionDefinitionForm
                onSubmit={onCreate} mode={ApiRequestType.CREATE} onClose={props.onClose}
            />
            <Backdrop open={showBackdrop}>
                <CircularProgress/>
            </Backdrop>
        </React.Fragment>
    )
}

const checkValid = (actionDefinitionFromForm, actionTemplatesWithParametersFromForm) => {
    for (const actionTemplateWithParameter of actionTemplatesWithParametersFromForm) {
        const templateLanguage = actionTemplateWithParameter.model.Language
        const templateRuntime = actionTemplateWithParameter.model.SupportedRuntimeGroup
        const actionParameterDefinitions = actionTemplateWithParameter.actionParameterDefinitions
        if (templateLanguage === TemplateLanguage.SQL) {
            // if(actionParameterDefinitions.filter(paramDef => paramDef.model.Tag===ActionParameterDefinitionTag.TABLE_NAME).length===0){
            //     return [false, "No Table Name Parameter"]
            // } else if(actionParameterDefinitions.filter(paramDef => paramDef.model.Tag===ActionParameterDefinitionTag.TABLE_NAME).length>1){
            //     return [false, "More than 1 Table Name Parameter"]
            // }
        } else if (templateLanguage === TemplateLanguage.PYTHON) {
            // if(actionParameterDefinitions.filter(paramDef => paramDef.model.Datatype===ActionParameterDefinitionDatatype.PANDAS_DATAFRAME).length<1){
            //     return [false, "No Pandas Dataframe Parameter"]
            // } else if(actionParameterDefinitions.filter(paramDef => paramDef.model.Datatype===ActionParameterDefinitionDatatype.PANDAS_DATAFRAME).length<1){
            //     return [false, "More than one Pandas Dataframe Parameter"]
            // } 
        } else {
            return [false, `Unknown Language: ${templateLanguage}, SupportedRuntimeGroup: ${templateRuntime}`]
        }
        return [true, "Valid"]
    }
    // if(actionDefinition.model.QueryLanguage==ActionDefinitionQueryLanguage.PYTHON){
    // Ensure 1 DF Parameter
    // if(actionParameterDefinitions.filter(paramDef => paramDef.model.Datatype===ActionParameterDefinitionDatatype.PANDAS_DATAFRAME).length!==1){
    //     return [false, "No Pandas Dataframe Parameter"]
    // }
    // // ENSURE 0 or 1 Table Parameter
    // if(actionParameterDefinitions.filter(paramDef => paramDef.model.Tag===ActionParameterDefinitionTag.TABLE_NAME).length>1){
    //     return [false, "More than 1 Table Name Parameter"]
    // }
    // return [true, "All Validations Successful"]
    // } else {
    //     // Ensure exactly 1 Table Name parameter
    // if(actionParameterDefinitions.filter(paramDef => paramDef.model.Tag===ActionParameterDefinitionTag.TABLE_NAME).length===0){
    //     return [false, "No Table Name Parameter"]
    // } else if(actionParameterDefinitions.filter(paramDef => paramDef.model.Tag===ActionParameterDefinitionTag.TABLE_NAME).length>1){
    //     return [false, "More than 1 Table Name Parameter"]
    // }
    //     return [true, "All Validations Successful"]
    // }
    return [false, "bb"]
}

const assignIdsIfNotPresent = (actionDefinitionFromForm, actionTemplatesWithParametersFromForm) => {
    actionDefinitionFromForm.model.Id = uuidv4()

    for (const actionTemplateWithParameter of actionTemplatesWithParametersFromForm) {
        actionTemplateWithParameter.model.DefinitionId = actionDefinitionFromForm.model.Id
        actionTemplateWithParameter.model.Id = uuidv4()
        if(actionDefinitionFromForm.model.DefaultActionTemplateId === undefined) {
            actionDefinitionFromForm.model.DefaultActionTemplateId = actionTemplateWithParameter.model.Id
        }

        for (const actionParameterDefinition of actionTemplateWithParameter.actionParameterDefinitions) {
            actionParameterDefinition.model.Id = uuidv4()
            actionParameterDefinition.model.TemplateId = actionTemplateWithParameter.model.Id
            actionParameterDefinition.model.ActionDefinitionId = actionDefinitionFromForm.model.Id
        }
    }
    return [actionDefinitionFromForm, actionTemplatesWithParametersFromForm]
}


export default CreateActionDefinition;
