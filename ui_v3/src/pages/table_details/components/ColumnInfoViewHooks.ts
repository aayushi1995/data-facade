import { useQuery, UseQueryOptions } from "react-query";
import dataManager from "../../../data_manager/data_manager";
import { ActionExecution, ColumnProperties } from "../../../generated/entities/Entities";
import labels from "../../../labels/labels";

export const useAllColumns = (params: {TableId?: string, options?: UseQueryOptions<ColumnProperties[], unknown, ColumnProperties[], (string | undefined)[]>}) => {
    const fetchedDataManagerInstance = dataManager.getInstance as {retreiveData: Function}
    
    const query = useQuery([labels.entities.ColumnProperties, params?.TableId], () => {
        return fetchedDataManagerInstance.retreiveData(labels.entities.ColumnProperties, {
            filter: {
                TableId: params?.TableId
            }
        })
    }, {
        ...params?.options,
        enabled: !!params?.TableId
    })
    return query
}


export const useTableAndColumnStats = (params: {TableId?: string, entireAction?: boolean, options?: UseQueryOptions<TableAndColumnStats, unknown, TableAndColumnStats, (string | undefined)[]>}) => {    
    const fetchedDataManagerInstance = dataManager.getInstance as {retreiveData: Function}
    
    const query = useQuery([labels.entities.TableProperties, params?.TableId, "TableAndColumnStats", !!params?.entireAction ? "EntireAction": "OnlyOutput"], () => {
        return fetchedDataManagerInstance.retreiveData(labels.entities.TableProperties, {
            filter: {
                Id: params?.TableId
            },
            "TableAndColumnStats": true
        }).then((actionExecutions: ActionExecution[]) => {
            const actionExecution = actionExecutions?.[0]
            if(!!params?.entireAction) return actionExecution
            const output = JSON.parse(actionExecution?.Output||"")
            const value = output?.["value"]
            return value
        })
    }, {
        ...params?.options,
        enabled: !!params?.TableId
    })
    return query
}

export type TableAndColumnStats = {
    ColumnInfoAndStats?: ColumnInfoAndStat[],
    TableStat?: TableStat
}

export type ColumnInfoAndStat = {
    ColumnName?: string,
    ColumnStat?: ColumnStat
}

export type ColumnStat = IntColumnStat | FloatColumnStat | StringColumnStat | BooleanColumnStat

export type TableStat = {
    RowCount?: number
}

export type IntColumnStat = {
    ColumnDatatype: string,
    Validity: ValidityStat,
    MeanModeStDev: MeanModeStDevStat,
    ContentStat: RowContentStat,
    QuartileStat: QuartileStat
}

export type FloatColumnStat = {
    ColumnDatatype: string,
    Validity: ValidityStat,
    MeanModeStDev: MeanModeStDevStat,
    ContentStat: RowContentStat,
    QuartileStat: QuartileStat
}

export type StringColumnStat = {
    ColumnDatatype: string,
    Validity: ValidityStat,
    ContentStat: RowContentStat
}

export type BooleanColumnStat = {
    ColumnDatatype: string,
    Validity: ValidityStat,
    ContentStat: RowContentStat
}

export type ValidityStat = {
    ValidRows?: number,
    InValidRows?: number,
    EmptyRows?: number
}

export type MeanModeStDevStat = {
    Mean?: number,
    Mode?: number,
    StDev?: number
}

export type RowContentStat = {
    UniqueValues?: number,
    MostCommonValue?: any,
    MostCommonValueCount?: number,
    TotalValues?: number
}

export type QuartileStat = {
    Minimum?: number,
    Q1?: number,
    Median?: number,
    Q3?: number,
    Maximum?: number
}


export const getSafePercentage = (count?: number, total?: number) => {
    if( total === 0 || !!!total ) {
        return 0
    } else {
        if( count === 0 || !!!count) {
            return 0
        } else {
            return limitDecimal(((count*100)/total))
        }
    }
}

export const limitDecimal = (value?: number, significantDigits?: 2) => value?.toFixed(significantDigits || 2)
