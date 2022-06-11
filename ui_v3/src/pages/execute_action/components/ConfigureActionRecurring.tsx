import { ActionInstance } from "../../../generated/entities/Entities"
import { Card, Box, FormGroup, FormControlLabel, Switch, TextField } from "@mui/material"
import DateTimePicker from '@mui/lab/DateTimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import React from "react"


interface ConfigureActionRecurringProps {
    handleStartDateChange: (startDate: Date) => void
    handleRecurringChange: (actionInstance: ActionInstance) => void
    actionInstance: ActionInstance
    startDate: Date
}

const ConfigureActionRecurring = (props: ConfigureActionRecurringProps) => {

    const handleIsRecurring = () => {
        props.handleRecurringChange({
            ...props.actionInstance,
            IsRecurring: !props.actionInstance.IsRecurring
        })
    }

    const handleIntervalChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const parameterValue = event.target.value
        if (parameterValue.match(/^-?\d+$/)) {
            props.handleRecurringChange({
                ...props.actionInstance,
                RecurrenceIntervalInSecs: parseInt(parameterValue)
            })
        } else if(parameterValue==="") {
            props.handleRecurringChange({
                ...props.actionInstance,
                RecurrenceIntervalInSecs: undefined  
            })
        }
    }

    const handleStartTimeChange = (event: string | null) => {
        console.log(event)
        if(event !== "Invalid Date" && event !== null){
            props.handleStartDateChange(new Date(event))
        }
    }

    return (
        <Card sx={{background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(255, 255, 255, 0.4) 100%), #F8F8F8', 
                border: '2px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '-5px -5px 10px #E3E6F0, 5px 5px 10px #A6ABBD', 
                borderRadius: '10px', 
                backgroundBlendMode: 'soft-light, normal', 
                minWidth: '100%', 
                minHeight: '100%'}}>
            
            <Box sx={{minHeight: '100%', minWidth: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', m: 3, gap: 2}}>
                <FormGroup sx={{border: '1px solid rgba(0, 0, 0, 0.23)', borderRadius: '16px'}}>
                    <FormControlLabel sx={{padding: 2}} control={
                        <Switch 
                            checked={props.actionInstance.IsRecurring}
                            onClick={handleIsRecurring}
                        />} 
                        label="Make Action Recurring" />
                </FormGroup>
                {props.actionInstance.IsRecurring ? (
                    <Box sx={{display: 'flex', gap: 2, justifyContent: 'center', width: '100%', alignItems: 'center'}}>
                        <TextField label="Recurrence Interval In Seconds" variant="outlined" sx={{minWidth: '350px'}} value={props.actionInstance.RecurrenceIntervalInSecs} onChange={handleIntervalChange} type='number'/>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                value={props.startDate}
                                label="Start Date"
                                renderInput={(params) => <TextField {...params} sx={{minWidth: '350px'}}/>}
                                onChange={handleStartTimeChange}
                            />
                        </LocalizationProvider>
                    </Box>
                ) : (
                    <></>
                )}
            </Box>

        </Card>

    )
}

export default ConfigureActionRecurring