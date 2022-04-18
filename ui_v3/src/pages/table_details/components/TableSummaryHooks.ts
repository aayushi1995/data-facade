import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from "react-query"
import dataManager from "../../../data_manager/data_manager"
import { ProviderDefinition, TableProperties } from "../../../generated/entities/Entities"
import labels from "../../../labels/labels"

export const useTable = (params: { TableId?: string, options: UseQueryOptions<TableProperties, unknown, TableProperties, (string|undefined)[]>}) => {
    const fetchedDataManager = dataManager.getInstance as { retreiveData: Function }
    const query = useQuery([labels.entities.TableProperties, params?.TableId], () => fetchedDataManager.retreiveData(labels.entities.TableProperties, {
        filter: {
            Id: params?.TableId
        }
    }).then((data: TableProperties[]) => data[0]), {
        enabled: !!params?.TableId,
        ...params?.options
    })

    return query
}

export const useProviderDefinitionForTable = (params: { TableId?: string, options: UseQueryOptions<ProviderDefinition, unknown, ProviderDefinition, (string|undefined)[]>}) => {
    const fetchedDataManager = dataManager.getInstance as { retreiveData: Function }
    const query = useQuery([labels.entities.ProviderDefinition, "For", labels.entities.TableProperties, params?.TableId], () => fetchedDataManager.retreiveData(labels.entities.TableProperties, {
        filter: {
            Id: params?.TableId
        },
        ProviderForTable: true
    }).then((data: ProviderDefinition[]) => data[0]), {
        enabled: !!params?.TableId,
        ...params?.options
    })

    return query
}


type UseTableDescriptionMutationVariables = { TableId?: string, NewDescription?: string }

export const useTableDescriptionMutation = (params: { TableId?: string, options: UseMutationOptions<TableProperties, unknown, UseTableDescriptionMutationVariables, unknown>}) => {
    const fetchedDataManager = dataManager.getInstance as { patchData: Function }
    const mutation = useMutation((variables: UseTableDescriptionMutationVariables) => fetchedDataManager.patchData(labels.entities.TableProperties, {
        filter: {
            Id: variables?.TableId
        },
        newProperties: {
            Description: variables?.NewDescription,
            ModifiedOn: new Date().getTime()
        }
    }).then((data: TableProperties[]) => data[0]), {
        ...params?.options
    })

    return mutation
}




export const useTableJobStatus = (params: { TableId?: string, options: UseMutationOptions<TableProperties, unknown, UseTableDescriptionMutationVariables, unknown>}) => {
    
}

export const getTimestampDifference = (timestamp: number) => {
    
}



const units: {unit: Intl.RelativeTimeFormatUnit; ms: number}[] = [
    {unit: "year", ms: 31536000000},
    {unit: "month", ms: 2628000000},
    {unit: "day", ms: 86400000},
    {unit: "hour", ms: 3600000},
    {unit: "minute", ms: 60000},
    {unit: "second", ms: 1000},
];
const rtf = new Intl.RelativeTimeFormat("en", {numeric: "auto"});

/**
 * Get language-sensitive relative time message from Dates.
 * @param relative  - the relative dateTime, generally is in the past or future
 * @param pivot     - the dateTime of reference, generally is the current time
 */
export function relativeTimeFromTimestamp(relative?: number, pivot: Date = new Date()): string {
    if (!relative) return "";
    const elapsed = relative - pivot.getTime();
    return relativeTimeFromElapsed(elapsed);
}

/**
 * Get language-sensitive relative time message from elapsed time.
 * @param elapsed   - the elapsed time in milliseconds
 */
export function relativeTimeFromElapsed(elapsed: number): string {
    for (const {unit, ms} of units) {
        if (Math.abs(elapsed) >= ms || unit === "second") {
            return rtf.format(Math.round(elapsed / ms), unit);
        }
    }
    return "";
}