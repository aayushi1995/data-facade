import dataManager from "@/api/dataManager"
import { ActionExecution } from "@/generated/entities/Entities"
import { ActionExecutionIncludeDefinitionInstanceDetailsResponse } from "@/generated/interfaces/Interfaces"
import { labels } from "@/helpers/constant"
import ActionExecutionStatus from "@/helpers/enums/ActionExecutionStatus"
import { ActionExecutionDetailProps } from "@/pages/chat/chatActionOutput/actionOutput"
import React from "react"
import { useMutation, useQuery } from "react-query"

import FetchActionExecutionDetails from "@/hooks/actionOutput/fetchActionExecutionDetails"


const useActionExecutionDetails = (props: ActionExecutionDetailProps) => {
    const {actionExecutionId, displayPostProcessed, onCompletion} = props

    const [actionExecutionTerminalState, setActionExecutionTerminalState] = React.useState(false)
    const [actionExecutionError, setActionExecutionError] = React.useState(false)
    const [intervalId, setIntervalId] = React.useState<any>()
    const [currentTime, setCurrentTime] = React.useState<number>(Date.now())
    const [cardExpanded, setCardExpanded] = React.useState(true)
    const [postProcessedAction, setPostProcessedAction] = React.useState<ActionExecution[] | undefined>()
    const [childActionExecutionId, setChildActionExecutionId] = React.useState<string | undefined>(props.childActionExecutionId)
    const [selectedActionId, setSelectedActionId] = React.useState<string | undefined>()
    const fetchedDataManager = dataManager.getInstance as {retreiveData: Function, saveData: Function}

    const fetchChildActionExecutionQuery = useQuery([labels.entities.ActionExecution, "Child", {Id: actionExecutionId}], () => {
        
        return fetchedDataManager.retreiveData(labels.entities.ActionExecution, {
            filter: {
                RunId: actionExecutionId
            }
        })
    }, {
        enabled: false,
        onSuccess: (data: ActionExecution[]) => {
            console.log('INSIDE HOOK', data)
            setPostProcessedAction(data)
        }
    })

    const handlePollingDataFetched = (data?: ActionExecutionIncludeDefinitionInstanceDetailsResponse[]) => {
        const actionExecutionDetails = data?.[0]
        if(!!actionExecutionDetails){
            const actionStatus = actionExecutionDetails?.ActionExecution?.Status
            if(actionStatus === ActionExecutionStatus.FAILED || actionStatus === ActionExecutionStatus.COMPLETED) {
                clearInterval(intervalId)
                setIntervalId(undefined)
                setActionExecutionTerminalState(true)
                fetchChildActionExecutionQuery.refetch()
                if(actionStatus === ActionExecutionStatus.FAILED) {
                    setActionExecutionError(true)
                } else {
                    setActionExecutionError(false)
                }
                onCompletion?.(actionExecutionDetails, props.messageIndex)
            }
        }
        if(data?.length === 0) {
            setActionExecutionTerminalState(true)
        }
    }

    const increaseTime = () => {
        if(!actionExecutionTerminalState) {
            setCurrentTime(time => time + 1000)
        }
    }

    const handleResultsToggle = () => {
        setCardExpanded(state => !state)
    }

    React.useEffect(() => {
        setCurrentTime(Date.now())
        const intervalId = setInterval(increaseTime, 2000)
        setIntervalId(intervalId)
        setActionExecutionTerminalState(false)
        if(displayPostProcessed) {
            fetchChildActionExecutionQuery.refetch()
        }
    }, [actionExecutionId])

    const getElapsedTime = () => {
        const timeInMilliSeconds = actionExecutionTerminalState ? (actionExecutionDetailQuery?.data?.ActionExecution?.ExecutionCompletedOn || Date.now()) - (actionExecutionDetailQuery?.data?.ActionExecution?.ScheduledTime || Date.now()) : currentTime - (actionExecutionDetailQuery?.data?.ActionExecution?.ScheduledTime || currentTime)
        const timeInSeconds = timeInMilliSeconds/1000
        const m = Math.floor(timeInSeconds / 60).toString().padStart(2,'0')
        const s = Math.floor(timeInSeconds % 60).toString().padStart(2,'0');

        return m + ' MIN ' + s + ' SEC'
    }

    const actionExecutionDetailQuery = FetchActionExecutionDetails({
        actionExecutionId: actionExecutionId,
        queryOptions: {
            refetchInterval: 1000,
            enabled: !actionExecutionTerminalState,
            onSuccess: handlePollingDataFetched
        }
    })
    
    const onChildExecutionCreated = (actionExecutionId: string) => {
        setChildActionExecutionId(actionExecutionId)
    }

    const trainActionDefinition = useMutation("TrainActionDefinition", 
        (actionDefinitionId: string) => fetchedDataManager.saveData(labels.entities.TrainingData, {
            TrainActionDefinition: true,
            withActionDefinitionId: actionDefinitionId
        })
    )

    const getProviderInstanceId = () => {
        return actionExecutionDetailQuery.data?.ActionParameterInstances?.find(pi => !!pi.ProviderInstanceId)?.ProviderInstanceId || actionExecutionDetailQuery?.data?.ActionInstance?.ProviderInstanceId
    }

    const onTrainModel = () => {
        trainActionDefinition.mutate(actionExecutionDetailQuery?.data?.ActionDefinition?.Id!, {
            onSuccess: () => {
                console.log('trained')
                actionExecutionDetailQuery.refetch()
            }
        })
    }

    return {
        actionExecutionDetailQuery,
        actionExecutionTerminalState,
        actionExecutionError,
        getElapsedTime,
        cardExpanded,
        handleResultsToggle,
        onChildExecutionCreated,
        childActionExecutionId,
        postProcessedAction,
        fetchChildActionExecutionQuery,
        selectedActionId,
        setSelectedActionId,
        getProviderInstanceId,
        onTrainModel
    }
}

export default useActionExecutionDetails