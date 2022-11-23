import { useMutation, UseMutationOptions, useQueryClient } from "react-query"
import { v4 as uuidv4 } from "uuid"
import { ProviderInformation } from "../../../generated/interfaces/Interfaces"
import labels from "../../../labels/labels"
import { ConnectionState, ConnectionStateMode } from "../context/ConnectionsContext"
import dataManagerInstance from './../../../data_manager/data_manager'

export interface UseSaveDataSourceProps {
    mode: ConnectionStateMode,
    options?: UseMutationOptions<ProviderInformation, unknown, ConnectionState, unknown>
}

export const useSaveDataSource = (props: UseSaveDataSourceProps) => {
    const { options, mode } = props
    const queryClient = useQueryClient()
    const fetchedDataManagerInstance = dataManagerInstance.getInstance as {retreiveData: Function, deleteData: Function, saveData: Function, patchData: Function}

    const createMutation = useMutation((state: ConnectionState) => {
            return fetchedDataManagerInstance.saveData(labels.entities.ProviderInstance, 
                formCreateRequestBodyFromContextState(state)
            )
        },
        {
            ...options,
            onSuccess: (data, variables, context) => {
                queryClient.invalidateQueries([labels.entities.ProviderInstance, "Card"])
                options?.onSuccess?.(data, variables, context)
            }
            
        }
    )

    const updateMutation = useMutation((state: ConnectionState) => {
            return fetchedDataManagerInstance.patchData(labels.entities.ProviderInstance, 
                formUpdateRequestBodyFromContextState(state)
            )
        },
        {
            ...options
        }
    )

    const getMutation = (mode: ConnectionStateMode) => {
        switch(mode){
            case "CREATE":
                return createMutation
            case "UPDATE":
                return updateMutation
            default:
                return updateMutation
        }   
    }
    return getMutation(mode)
}

const formCreateRequestBodyFromContextState = (state: ConnectionState) => {
    const providerInstanceId = uuidv4()
    const entityToCreate: ProviderInformation = {
        ProviderInstance: {
            model: {
                Id: providerInstanceId,
                ...state?.ProviderInformation?.ProviderInstance?.model
            },
            tags: state?.ProviderInformation?.ProviderInstance?.tags || []
        },
        ProviderParameterInstance: state?.ProviderInformation?.ProviderParameterInstance?.map(pp => ({
            ...pp,
            ProviderInstanceId: providerInstanceId
        }))
    }

    return {
        entityProperties: {},
        CreateProviderInstanceForm: true,
        RecurrenceInterval: state.RecurrenceInterval ? state.RecurrenceInterval*60 : undefined,
        ...entityToCreate
    }
}

const formUpdateRequestBodyFromContextState = (state: ConnectionState) => {
    const updatedProvider: ProviderInformation = {
        ProviderInstance: {
            model: {
                ...state?.ProviderInformation?.ProviderInstance?.model
            },
            tags: state?.ProviderInformation?.ProviderInstance?.tags || []
        },
        ProviderParameterInstance: state?.ProviderInformation?.ProviderParameterInstance?.map(pp => ({
            ...pp,
            ProviderInstanceId: state?.ProviderInformation?.ProviderInstance?.model?.Id 
        }))
    }

    return {
        UpdateProviderInstanceForm: true,
        ...updatedProvider,
        interval: state.RecurrenceInterval ? state.RecurrenceInterval * 60 : undefined
    }
}