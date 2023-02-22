import { SelectChangeEvent } from "@mui/material"
import React from "react"
import { useMutation } from "react-query"
import { v4 as uuidv4 } from "uuid"
import dataManager from "../../../../data_manager/data_manager"
import { userSettingsSingleton } from "../../../../data_manager/userSettingsSingleton"
import { TrainingData } from "../../../../generated/entities/Entities"
import labels from "../../../../labels/labels"
import { AddTrainingDataSetFormProps } from "../components/AddTrainingDataSetForm"
import { AnswerTypes, TrainingDataRow } from "../TrainingDataSetHomePage"


const useAddTrainingDataSetForm = (props: AddTrainingDataSetFormProps) => {

    const [trainingDataSetState, setTraingDataSetState] = React.useState<TrainingDataRow | undefined>()
    const [selectedActionDefinitionId, setSelectedActionDefinitionId] = React.useState<string | undefined>()

    const fetchedDataManager = dataManager.getInstance as {saveData: Function}

    const addTrainingData = useMutation("trainginData", 
        (params: {trainingData: TrainingData}) => fetchedDataManager.saveData(labels.entities.TrainingData, {
            entityProperties: params.trainingData
        })
    )

    const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTraingDataSetState(oldState => ({
            ...oldState,
            question: event.target.value
        }))
    }

    const handleAnswerTypeChange = (event: SelectChangeEvent<AnswerTypes>) => {
        setTraingDataSetState(oldState => ({
            ...oldState,
            answerType: event.target.value as AnswerTypes,
            reference: undefined,
            parameterValues: undefined
        }))
    }

    const handleReferenceValueChange = (value: string) => {
        setTraingDataSetState(oldState => ({
            ...oldState,
            reference: value,
            parameterValues: undefined
        }))
    }

    const setSelectedActionId = (actionId: string | undefined) => {
        setSelectedActionDefinitionId(actionId)
    }

    const onParameterValueChange = (parameterValue: Record<string, string>) => {
        setTraingDataSetState(oldState => ({
            ...oldState,
            parameterValues: parameterValue
        }))
    }

    const onTargetUserChange = (targetUsers: string[]) => {
        setTraingDataSetState(oldState => ({
            ...oldState,
            targetUser: targetUsers
        }))
    }

    const handleAddRecord = () => {
        if(!!trainingDataSetState?.question) {
            const trainingData: TrainingData = {
                Id: uuidv4(),
                Question: trainingDataSetState.question,
                ParameterValues: JSON.stringify(trainingDataSetState.parameterValues),
                Reference: trainingDataSetState.reference,
                AnswerType: trainingDataSetState.answerType,
                TargetUser: trainingDataSetState.targetUser?.join(','),
                CreatedBy: userSettingsSingleton.userEmail,
                CreatedOn: Date.now()
            }

            addTrainingData.mutate({
                trainingData: trainingData
            }, {
                onSuccess: props.onRecordAdded()
            })
        }

        
    }

    return {
        trainingDataSetState,
        handleQuestionChange,
        handleAnswerTypeChange,
        handleReferenceValueChange,
        setSelectedActionId,
        selectedActionDefinitionId,
        onParameterValueChange,
        onTargetUserChange,
        handleAddRecord
    }
}

export default useAddTrainingDataSetForm