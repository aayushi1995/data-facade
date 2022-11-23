import React from "react";
import { useMutation, UseMutationResult, useQuery, UseQueryResult } from "react-query";
import dataManager from "../../../data_manager/data_manager";
import { Fetcher } from "../../../generated/apis/api";
import { Chart } from "../../../generated/entities/Entities";
import { ActionExecutionIncludeDefinitionInstanceDetailsResponse, ChartWithData } from "../../../generated/interfaces/Interfaces";
import labels from "../../../labels/labels";
import formChartOptions from "../../util/formChartOptionsFromContext";
import swapChartAxes from "../../util/swapChartAxes";
import { BaseChartsConfig } from "./BaseChartsConfig";
import { EChartUISpecificConfig } from "./types/EChartUISpecificConfig";


type Filters = {

}

type ChartsQueriesType = {
    fetchExecution?: UseQueryResult<ActionExecutionIncludeDefinitionInstanceDetailsResponse[], unknown>,
    fetchCharts?: UseQueryResult<ChartWithData[], unknown>,
    updateChart?: UseMutationResult<Chart[], unknown, {filter: Chart, newProperties: Chart}, unknown>,
    uploadFileToS3Mutation?: UseMutationResult<unknown, unknown, {requestUrl: string, headers: any, chart: ChartWithData}, unknown>,
    fetchPresignedUrlMutation?: UseMutationResult<unknown, unknown, {expirationDurationInMinutes: number, uploadPath: string, chart: ChartWithData}, unknown>
}

export type ChartModelConfig = {
    uiConfig?: {
        showLables?: false
    }
}

export type ChartWithDataAndOptions = {
    data: ChartWithData,
    options: {config: BaseChartsConfig, uiConfig: EChartUISpecificConfig},
    columns?: {
        name: string,
        values: (string | number | boolean)[]
    }[]
}

type SaveAndBuildChartsContextType = {
    ExecutionId: string | "NA",
    Charts: ChartWithDataAndOptions[]
    Filters: Filters[],
    Result: Object[],
    ExecutionDetails?: ActionExecutionIncludeDefinitionInstanceDetailsResponse
}

type SetSaveAndBuildChartContextType = (action: SaveAndBuildChartContextAction) => void

const defaultContextValue: SaveAndBuildChartsContextType = {
    ExecutionId: "NA",
    Charts: [],
    Filters: [],
    Result: []
}

const defaultSetContextValue = (action: SaveAndBuildChartContextAction) => {}

export const SaveAndBuildChartContext = React.createContext<SaveAndBuildChartsContextType>(defaultContextValue)
export const SetSaveAndBuildChartContext = React.createContext<SetSaveAndBuildChartContextType>(defaultSetContextValue)
export const ChartQueriesContext = React.createContext<ChartsQueriesType>({})

type SetExecutionId = {
    type: 'SetExecutionId',
    payload: {
        executionId: string | "NA"
    }
}

type SetExecutionDetails = {
    type: 'SetExecutionDetails',
    payload: {
        details: ActionExecutionIncludeDefinitionInstanceDetailsResponse
    }
}

export type SetChartsWithDataAndOptions = {
    type: 'SetChartsWithDataAndOptions',
    payload: {
        chartData: ChartWithDataAndOptions[]
    }
}

export type ChangeChartModel = {
    type: 'ChangeChartModel',
    payload: {
        chartId: string,
        chartModel: Chart
    }
}

export type SwitchAxes = {
    type: 'SwitchAxes',
    payload: {
        chartId: string
    }
}

export type ChangeLabel = {
    type: 'ChangeLabel',
    payload: {
        chartId: string,
        showLables: boolean
    }
}

export type AssignXAxisToChart = {
    type: 'AssignXAxisToChart',
    payload: {
        chartId: string,
        column_name: string
    }
}

export type AssignYAxisToChart = {
    type: 'AssignYAxisToChart',
    payload: {
        chartId: string,
        column_name: string
    }
}

type SaveAndBuildChartContextAction = SetExecutionId |
                                      SetExecutionDetails |
                                      SetChartsWithDataAndOptions |
                                      ChangeChartModel |
                                      SwitchAxes |
                                      ChangeLabel |
                                      AssignXAxisToChart |
                                      AssignYAxisToChart

const reducer = (state: SaveAndBuildChartsContextType, action: SaveAndBuildChartContextAction): SaveAndBuildChartsContextType => {

    switch(action.type) {
        case 'SetExecutionId': {
            return {
                ...state,
                ExecutionId: action.payload.executionId
            }
        }
        case 'SetExecutionDetails': {
            return {
                ...state,
                ExecutionDetails: action.payload.details
            }
        }
        case 'SetChartsWithDataAndOptions': {
            return {
                ...state,
                Charts: action.payload.chartData
            }
        }
        case 'ChangeChartModel': {
            return {
                ...state,
                Charts: state.Charts.map(chartDataAndOptions => ((chartDataAndOptions.data.model?.Id === action.payload.chartId) ? (
                    {
                        ...chartDataAndOptions,
                        data: {
                            ...chartDataAndOptions.data,
                            model: {
                                ...chartDataAndOptions.data?.model,
                                ...action.payload.chartModel
                            }
                        },
                        options: formChartOptions({...chartDataAndOptions.data, model: {...chartDataAndOptions.data?.model, ...action.payload.chartModel}})
                        
                    }
                ) : (chartDataAndOptions)))
            }
        }
        case 'SwitchAxes': {
            // return {
            //     ...state,
            //     Charts: state.Charts.map(chartDataAndOptions => {
            //         if(chartDataAndOptions.data.model?.Id === action.payload.chartId) {
            //             const x = chartDataAndOptions.options.config.xAxis
            //             const y = chartDataAndOptions.options.config.yAxis

            //             return {
            //                 ...chartDataAndOptions,
            //                 options: {
            //                     ...chartDataAndOptions.options,
            //                     config: {
            //                         ...chartDataAndOptions.options.config,
            //                         xAxis: y,
            //                         yAxis: x
            //                     }
            //                 }
            //             }
            //         } else {
            //             return chartDataAndOptions
            //         }
            //     })
            // }

            return {
                ...state,
                Charts: state.Charts.map(chartDataAndOptions => {
                    if(chartDataAndOptions.data.model?.Id === action.payload.chartId) {
                        const newData = swapChartAxes(chartDataAndOptions.data)
                        return {
                            ...chartDataAndOptions,
                            data: newData,
                            options: formChartOptions(newData)
                            
                        }
                    } else {
                        return chartDataAndOptions
                    }
                })
            }
        }

        case 'ChangeLabel': {
            return {
                ...state,
                Charts: state.Charts.map(chartDataOptions => {
                    if(chartDataOptions?.data?.model?.Id === action.payload?.chartId) {
                        const oldConfig = (JSON.parse(chartDataOptions?.data?.model?.Config || "{}") as ChartModelConfig)
                        const config = JSON.stringify(
                            {
                                ...oldConfig,
                                uiConfig: {
                                    ...oldConfig.uiConfig,
                                    showLables: action.payload.showLables
                                }
                            }
                        )

                        return {
                            ...chartDataOptions,
                            data: {
                                ...chartDataOptions.data,
                                model: {
                                    ...chartDataOptions.data.model,
                                    Config: config
                                }
                            },
                            options: formChartOptions({
                                ...chartDataOptions.data,
                                model: {
                                    ...chartDataOptions.data.model,
                                    Config: config
                                }
                            })
                        }
                    } else {
                        return chartDataOptions
                    }
                })
            }
        }

        case 'AssignXAxisToChart': {
            return {
                ...state,
                Charts: state.Charts.map(chartWithDataAndOptions => {
                    const newColumn = chartWithDataAndOptions?.columns?.find(column => column.name === action.payload.column_name)
                    if(chartWithDataAndOptions.data?.model?.Id === action.payload.chartId) {
                        const newData = {
                            ...chartWithDataAndOptions,
                            data: {
                                ...chartWithDataAndOptions.data,
                                chartData: {
                                    ...chartWithDataAndOptions.data.chartData,
                                    data: {
                                        ...(chartWithDataAndOptions.data?.chartData as {data: object})?.data,
                                        x: newColumn?.values,
                                        x_name: newColumn?.name
                                    }
                                }
                            }
                        }
                        return {
                            ...newData,
                            options: formChartOptions(newData?.data)
                        }
                    } else {
                        return chartWithDataAndOptions
                    }
                })
            }
        }

        case 'AssignYAxisToChart': {
            return {
                ...state,
                Charts: state.Charts.map(chartWithDataAndOptions => {
                    const newColumn = chartWithDataAndOptions?.columns?.find(column => column.name === action.payload.column_name)
                    if(chartWithDataAndOptions.data?.model?.Id === action.payload.chartId) {
                        const newData = {
                            ...chartWithDataAndOptions,
                            data: {
                                ...chartWithDataAndOptions.data,
                                chartData: {
                                    ...chartWithDataAndOptions.data.chartData,
                                    data: {
                                        ...(chartWithDataAndOptions.data?.chartData as {data: object})?.data,
                                        y: newColumn?.values,
                                        y_name: newColumn?.name
                                    }
                                }
                            }
                        }
                        return {
                            ...newData,
                            options: formChartOptions(newData?.data)
                        }
                    } else {
                        return chartWithDataAndOptions
                    }
                })
            }
        }
        default: {
            return state
        }
    }
}

const getRawColumnData = (chartData: ChartWithData) => {
    const rawData = chartData?.rawData
    if(!!rawData) {
        return Object.entries(rawData).map(([column_name, column_values]) => {
            return {
                name: column_name,
                values: column_values
            }
        })
    }
}

const SaveAndBuildChartContextProvider = ({children}: {children: React.ReactElement}) => {
    const [contextState, dispatch] = React.useReducer(reducer, defaultContextValue)
    const setContext: SetSaveAndBuildChartContextType = (args) => dispatch(args)

    const FetchActionExecutionDetails = useQuery([labels.entities.ActionExecution, contextState.ExecutionId],
        () => Fetcher.fetchData("GET", "/actionExecutionDetail", {Id: contextState.ExecutionId}),
        {
            enabled: false,
            onSuccess: (data) => {setContext({type: 'SetExecutionDetails', payload: {details: data?.[0]}})}
        }
    )

    const fetchedDataManager = dataManager.getInstance as {s3PresignedUploadUrlRequest: Function, s3UploadRequest: Function}
    const fetchPresignedUrlMutation = useMutation(
        "GetS3PreSignedUrl",
        (config: {expirationDurationInMinutes: number, uploadPath: string, chart: ChartWithData}) => {
            const file = new File([JSON.stringify(config.chart.chartData || {})], 'data.txt')
            return fetchedDataManager.s3PresignedUploadUrlRequest(file, config.expirationDurationInMinutes, "ChartData", config.uploadPath)
        },{
            onSuccess: (data, variables, context) => {
                const expectedData = data as {requestUrl: string, headers: any}
                uploadFileToS3Mutation.mutate({
                    requestUrl: expectedData.requestUrl,
                    headers: expectedData.headers,
                    chart: variables.chart
                })
            }
        }
    );

    const uploadFileToS3Mutation = useMutation(
        "UploadToS3",
        (config: {requestUrl: string, headers: any, chart: ChartWithData}) => {
            const finalData = {...config.chart.chartData, chartGroup: config.chart.model?.ChartGroup}
            const file = new File([JSON.stringify(finalData || {})], 'data.txt')
            return fetchedDataManager.s3UploadRequest(config.requestUrl, config.headers, file)
        },
    )

    const updateChart = useMutation(
        "UpdateChart",
        (config: {filter: Chart, newProperties: Chart}) => Fetcher.fetchData("PATCH", "/updateChart", {filter: config.filter, newProperties: config.newProperties})
    )


    const FetchCharts = useQuery(["Chart", contextState.ExecutionId],
        () => Fetcher.fetchData('GET', '/getChartData', {ExecutionId: contextState.ExecutionId}), {
            enabled: false,
            onSuccess: (data) => {
                const payload: ChartWithDataAndOptions[] = data.map(chartData => {
                    const options = formChartOptions(chartData)
                    const rawColumnData = getRawColumnData(chartData)
                    return {
                        data: chartData,
                        options: options,
                        columns: rawColumnData
                    }
                })
                // const chartOptions = formChartOptions(data)
                setContext({type: 'SetChartsWithDataAndOptions', payload: {chartData: payload}})
            }
        }        
    )
    React.useEffect(() => {
        if(contextState.ExecutionId !== 'NA') {
            FetchActionExecutionDetails.refetch()
        }
    }, [contextState.ExecutionId])

    React.useEffect(() => {
        if(contextState.ExecutionId !== 'NA') {
            FetchCharts.refetch()
        }
    }, [contextState.ExecutionId])

    const chartQueries: ChartsQueriesType = {
        fetchExecution: FetchActionExecutionDetails,
        fetchCharts: FetchCharts,
        fetchPresignedUrlMutation: fetchPresignedUrlMutation,
        uploadFileToS3Mutation: uploadFileToS3Mutation,
        updateChart: updateChart
    }
    return (
        <ChartQueriesContext.Provider value={chartQueries}>
            <SaveAndBuildChartContext.Provider value={contextState}>
                <SetSaveAndBuildChartContext.Provider value={setContext}>
                    {children}
                </SetSaveAndBuildChartContext.Provider>
            </SaveAndBuildChartContext.Provider>
        </ChartQueriesContext.Provider>
    )
}

export default SaveAndBuildChartContextProvider
