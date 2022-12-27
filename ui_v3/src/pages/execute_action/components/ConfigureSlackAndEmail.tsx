
import { Card, Grid, TextField } from "@mui/material"
import React from "react"
import { SlackChannelSingle } from "../../../common/components/workflow/create/ParameterInput"
import ActionDefinitionPresentationFormat from "../../../enums/ActionDefinitionPresentationFormat"
import { ActionParameterInstance } from "../../../generated/entities/Entities"
import useDefaultSlackErrorChannel from "./useDefaultSlackErrorChannel"


interface ConfigureSlackAndEmailProps {
    slack?: string,
    email?: string,
    writeBackTableName?: string
    parameterInstances: ActionParameterInstance[],
    actionDefinitionReturnType?: string
    handleEmailAndSlackChange: (slack?: string, email?: string) => void,
    handleWriteBackTableNameChange?: (tableName: string) => void
}

const ConfigureSlackAndEmail = (props: ConfigureSlackAndEmailProps) => {
    const defaultErrorChannelQuery = useDefaultSlackErrorChannel()

    React.useEffect(() => {
        if(props?.slack===undefined && defaultErrorChannelQuery?.data!==undefined) {
            handleSlackChange(defaultErrorChannelQuery?.data)
        }
    }, [defaultErrorChannelQuery?.data, props?.slack])
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement> ) => {
        props.handleEmailAndSlackChange?.(props.slack, e.target.value)
    }

    const handleSlackChange = (selectedChannelId?: string) => {
        props.handleEmailAndSlackChange(selectedChannelId, props.email)
    }

    const checkIfValid = () => {
        const providerInstanceIds = props.parameterInstances?.filter(pi => !!pi.ProviderInstanceId)?.map(pi => pi.ProviderInstanceId)
        const uniqueIds = new Set(providerInstanceIds)
        return !(uniqueIds.size === 1 && props.actionDefinitionReturnType === ActionDefinitionPresentationFormat.TABLE_VALUE)
    }

    const handleTableNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.handleWriteBackTableNameChange?.(e.target.value)
    }

    return (
        <Card sx={{background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(255, 255, 255, 0.4) 100%), #F8F8F8', 
                border: '2px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '-5px -5px 10px #E3E6F0, 5px 5px 10px #A6ABBD', 
                borderRadius: '10px', 
                backgroundBlendMode: 'soft-light, normal', 
                minWidth: '100%', 
                minHeight: '100%'}}>
            <Grid container spacing={2} sx={{my: 3, px: 2}}>
                <Grid item xs={4}>
                    <TextField fullWidth label="Email" value={props.email} onChange={handleEmailChange}/>
                </Grid>
                <Grid item xs={4}>
                    <SlackChannelSingle
                        parameterType='SLACK_CHANNEL_SINGLE'
                        inputProps={{
                            selectedChannelID: props.slack,
                            onSelectedChannelIdChange: (selectedChannelId) => handleSlackChange(selectedChannelId)
                        }}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField fullWidth label="Write Back Table Name" value={props.writeBackTableName} disabled={checkIfValid()} onChange={handleTableNameChange}/>
                </Grid>
            </Grid>
        </Card>
    )
}   

export default ConfigureSlackAndEmail