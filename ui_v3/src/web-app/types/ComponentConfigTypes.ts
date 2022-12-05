import ComponentTypes from "../../enums/ComponentTypes"


export type InputComponentConfig = {
    type: 'input',
    details: InputComponentDetails
}

export type InputComponentDetails = {
    ParameterReference: string
}

export type ChartComponentConfig = {
    type: 'chart',
    details: ChartComponentDetails
}

export type ChartComponentDetails = {
    ActionReference: string,
    chartIndex: number,
    chartKind?: string
}

export type OutputComponentConfig = {
    type: 'output',
    details: OutputComponentDetails
}

export type OutputComponentDetails = {
    ActionReference: string,
    flowIndex?: number
}

export type ComponentConfig = 
InputComponentConfig |
ChartComponentConfig |
OutputComponentConfig