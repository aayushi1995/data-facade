import React from "react"
import { useMutation, useQuery } from "react-query"
import dataManager from "../../../../data_manager/data_manager"
import { TrainingData } from "../../../../generated/entities/Entities"
import labels from "../../../../labels/labels"
import { AnswerTypes, TrainingDataRow } from "../TrainingDataSetHomePage"



const useTrainingDataSetHomePage = () => {
    const [trainingData, setTrainginData] = React.useState<TrainingDataRow[]>([])
    const [addTrainingDialogState, setAddTrainingDataState] = React.useState(false)
    const [successSnackbarState, setSuccessSnackbarState] = React.useState(false)
    const [failureSnackbarState, setFailureSnackbarState] = React.useState(false)

    const fetchedDataManager = dataManager.getInstance as {retreiveData: Function, deleteData: Function}

    const fetchTrainingData = useQuery([labels.entities.TrainingData, "All"], 
        () => fetchedDataManager.retreiveData(labels.entities.TrainingData, {
            filter: {}
        }), {
            onSuccess: (data: TrainingData[]) => {
                const rows: TrainingDataRow[] = data.map(traingingRow => ({
                    id: traingingRow.Id,
                    reference: traingingRow.Reference,
                    parameterValues: traingingRow.ParameterValues ? JSON.parse(traingingRow.ParameterValues ) as Record<string, string>: undefined,
                    targetUser: traingingRow?.TargetUser?.split(','),
                    answerType: traingingRow?.AnswerType as AnswerTypes,
                    question: traingingRow.Question
                }))
                setTrainginData(rows)
            }
        }
    )

    const deleteTrainingDataMutation = useMutation("DeleteTrainingData", 
        (params: {filter: TrainingData}) => fetchedDataManager.deleteData(labels.entities.TrainingData, {
            filter: {
                ...params.filter
            },
            Hard: true
        })
    )

    const handleRetrainMutation = useMutation("HandleRetrin", 
        (params: {filter: TrainingData}) => fetchedDataManager.retreiveData(labels.entities.TrainingData , {
            filter: {
                ...params.filter
            },
            UploadTrainingDataToS3AndRetrain: true
        })
    )


    const onDeleteTrainingRow = (trainingDataId: string) => {
        deleteTrainingDataMutation.mutate({
            filter: {Id: trainingDataId}
        }, {
            onSuccess: () => {
                setTrainginData(oldState => oldState.filter(row => row.id !== trainingDataId))
            }
        })
    }

    const onRecordAdded = () => {
        fetchTrainingData.refetch()
        handleDialogStateChange()
    }

    const handleDialogStateChange = () => {
        setAddTrainingDataState(state => !state)
    }

    const handleRetrain = () => {
        handleRetrainMutation.mutate({
            filter: {}
        }, {
            onSuccess(data, variables, context) {
                if((data as any)?.[0]?.retrained === true) {
                    setSuccessSnackbarState(true)
                } else {
                    setFailureSnackbarState(true)
                }
            },
            onError: () => {
                setFailureSnackbarState(true)
            }
        })
    }

    const handleSnackbarClose = () => {
        setSuccessSnackbarState(false)
        setFailureSnackbarState(false)
    }

    return {
        trainingData,
        addTrainingDialogState,
        handleDialogStateChange,
        fetchTrainingData,
        onRecordAdded,
        onDeleteTrainingRow,
        successSnackbarState,
        failureSnackbarState,
        handleSnackbarClose,
        handleRetrain,
        handleRetrainMutation
    }
}

export default useTrainingDataSetHomePage