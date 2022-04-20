import { Box, Typography } from "@mui/material"
import DatafacadeDatatype from "../../../enums/DatafacadeDatatype"
import { ColumnProperties } from "../../../generated/entities/Entities"
import { BooleanColumnStat, ColumnStat, FloatColumnStat, getSafePercentage, IntColumnStat, limitDecimal, MeanModeStDevStat, QuartileStat, RowContentStat, StringColumnStat, ValidityStat } from "./ColumnInfoViewHooks"

export type ColumnStatViewProps = {
    column?: ColumnProperties,
    columnStat?: ColumnStat
}

export const ColumnStatView = (props: ColumnStatViewProps) => {
    const columnStatComponent = () => {
        switch(props?.column?.Datatype) {
            case DatafacadeDatatype.INT: {
                const castedStat = props?.columnStat as (IntColumnStat | undefined)
                return <IntColumnStatView stat={castedStat}/>
            }

            case DatafacadeDatatype.FLOAT: {
                const castedStat = props?.columnStat as (FloatColumnStat | undefined)
                return <FloatColumnStatView stat={castedStat}/>
            }
            
            case DatafacadeDatatype.STRING: {
                const castedStat = props?.columnStat as (StringColumnStat | undefined)
                return <StringColumnStatView stat={castedStat}/>
            }
            
            case DatafacadeDatatype.BOOLEAN: {
                const castedStat = props?.columnStat as (BooleanColumnStat | undefined)
                return <BooleanColumnStatView stat={castedStat}/>
            }
            
            default: {
                return <>Column has unknown Datatype {props?.column?.Datatype}</>
            }
        }
    }

    return (
        <Box sx={{ px: 2, overflowX: "auto" }}>
            {columnStatComponent()}
        </Box>
    )   
}

type IntColumnStatViewProps = {
    stat?: IntColumnStat
}
const IntColumnStatView = (props: IntColumnStatViewProps) => {
    return (
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box>
                    <ValidityStatView {...props.stat?.Validity}/>
                </Box>
                <Box>
                    <RowContentStatView {...props.stat?.ContentStat}/>
                </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column-reverse" }}>
                <MeanModeStDevStatView {...props.stat?.MeanModeStDev}/>
            </Box>
            <Box>
                <QuartileStatView {...props.stat?.QuartileStat}/>
            </Box>
        </Box>
    )
}

type FloatColumnStatViewProps = {
    stat?: FloatColumnStat
}
const FloatColumnStatView = (props: FloatColumnStatViewProps) => {
    return (
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box>
                    <ValidityStatView {...props.stat?.Validity}/>
                </Box>
                <Box>
                    <RowContentStatView {...props.stat?.ContentStat}/>
                </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column-reverse" }}>
                <MeanModeStDevStatView {...props.stat?.MeanModeStDev}/>
            </Box>
            <Box>
                <QuartileStatView {...props.stat?.QuartileStat}/>
            </Box>
        </Box>
    )
}

type StringColumnStatViewProps = {
    stat?: StringColumnStat
}
const StringColumnStatView = (props: StringColumnStatViewProps) => {
    return (
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box>
                    <ValidityStatView {...props.stat?.Validity}/>
                </Box>
                <Box>
                    <RowContentStatView {...props.stat?.ContentStat}/>
                </Box>
            </Box>
        </Box>
    )
}

type BooleanColumnStatViewProps = {
    stat?: BooleanColumnStat
}
const BooleanColumnStatView = (props: BooleanColumnStatViewProps) => {
    return (
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box>
                    <ValidityStatView {...props.stat?.Validity}/>
                </Box>
                <Box>
                    <RowContentStatView {...props.stat?.ContentStat}/>
                </Box>
            </Box>
        </Box>
    )
}


const ValidityStatView = (props?: ValidityStat) => {
    const totalRows = (props?.EmptyRows||0) + (props?.InValidRows||0) + (props?.ValidRows||0)

    const rowTypes = [
        {
            Label: "Valid",
            Value: props?.ValidRows,
            PercentageValue: getSafePercentage(props?.ValidRows, totalRows),
            Colour: "rgba(0, 170, 17, 1)"
        },
        {
            Label: "InValid",
            Value: props?.InValidRows,
            PercentageValue: getSafePercentage(props?.InValidRows, totalRows),
            Colour: "rgba(255, 152, 0, 1)"
        },
        {
            Label: "Empty",
            Value: props?.EmptyRows,
            PercentageValue: getSafePercentage(props?.EmptyRows, totalRows),
            Colour: "rgba(254, 38, 38, 1)"
        }
    ]

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {rowTypes.map( row => 
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
                    <Box sx={{ width: "20px"}}>
                        <Box sx={{ height: "2px", width: "10px", background: row.Colour}}/>
                    </Box>
                    <Box sx={{ width: "80px"}}>
                        <Typography variant="statText">{row.Label}</Typography>
                    </Box>
                    <Box sx={{ width: "100px"}}>
                        <Typography variant="statText">{row.Value}</Typography>
                    </Box>
                    <Box sx={{ width: "60px"}}>
                        <Typography variant="statText" sx={{ color: "#B1B1B1"}}>{row.PercentageValue} %</Typography>
                    </Box> 
                </Box>
            )}
        </Box>
    )
}

const RowContentStatView = (props?: RowContentStat) => {
    const rowTypes = [
        {
            Label: "Unique",
            Value: props?.UniqueValues,
            PercentageValue: getSafePercentage(props?.UniqueValues, props?.TotalValues)
        },
        {
            Label: "Most Common",
            Value: props?.MostCommonValue,
            PercentageValue: getSafePercentage(props?.MostCommonValueCount, props?.TotalValues)
        }
    ]

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {rowTypes.map( row => 
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
                    <Box sx={{ width: "100px", mr: 2}}>
                        <Typography variant="statText">{row.Label}</Typography>
                    </Box>
                    <Box sx={{ width: "100px", overflowX: "auto" }}>
                        <Typography variant="statText">{row.Value}</Typography>
                    </Box>
                    <Box sx={{ width: "60px"}}>
                        <Typography variant="statText" sx={{ color: "#B1B1B1"}}>{row.PercentageValue} %</Typography>
                    </Box>
                </Box>
            )}
        </Box>
    )
}

const MeanModeStDevStatView = (props: MeanModeStDevStat) => {
    const rowTypes = [
        {
            Label: "Mode",
            Value: props?.Mode
        },
        {
            Label: "Mean",
            Value: props?.Mean
        },
        {
            Label: "StDev",
            Value: props?.StDev
        }
    ]

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {rowTypes.map( row => 
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
                    <Box sx={{ width: "50px", mr: 2}}>
                        <Typography variant="statText">{row.Label}</Typography>
                    </Box>
                    <Box sx={{ width: "40px"}}>
                        <Typography variant="statText">{limitDecimal(row.Value)}</Typography>
                    </Box>
                </Box>
            )}
        </Box>
    )
}

const QuartileStatView = (props: QuartileStat) => {
    const rowTypes = [
        {
            Label: "Min",
            Value: props?.Minimum
        },
        {
            Label: "25%",
            Value: props?.Q1
        },
        {
            Label: "50%",
            Value: props?.Median
        },
        {
            Label: "75%",
            Value: props?.Q3
        },
        {
            Label: "Max",
            Value: props?.Maximum
        },
    ]

    // TODO: Verify if Quantities or Quantiles
    return (
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Box>
                <Typography variant="statText" >
                    Quantiles
                </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {rowTypes.map( row => 
                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
                        <Box sx={{ width: "60px", mr: 2}}>
                            <Typography variant="statText">{row.Value}</Typography>
                        </Box>
                        <Box sx={{ width: "30px"}}>
                            <Typography variant="statText" sx={{ color: "#B1B1B1"}}>{row.Label}</Typography>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
        
    )
}