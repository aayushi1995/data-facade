import { ProviderDefinitionDetail, ProviderInformation } from '@/generated/interfaces/Interfaces';
import React from 'react';
import { useNavigate } from 'react-router';
import { ConnectionQueryContext, ConnectionSetStateContext, ConnectionStateContext } from '@/contexts/ConnectionsContext';
import CreateProviderOptions from "./CreateProviderOptions";
import { ProviderIcon } from './ConnectionDialogContent';
import ProviderParameterDefinitionId from '@/helpers/enums/ProviderParameterDefinitionId';
import { SlackChannelSingle } from '@/components/parameters/ParameterInput';
import { Avatar, Card, Checkbox, Col, Divider, Input, Modal, Row, Typography } from 'antd';
import { useParams } from 'react-router-dom';
import { AntDesignOutlined } from '@ant-design/icons';
import { LogoIcon } from '@/assets/icon.theme';
import { DialogLogoContainer, DilogTypo1, DilogTypo2, DilogTypoContaioner, Paramheader } from './ConnectionPage.style';
import logo from "@assets/icons/Logo.svg"
export type ProviderParameterInputProps = { 
    ProviderDefinition?: ProviderDefinitionDetail,
    ProviderInstance?: ProviderInformation,
    onParameterValueChange?: ( parameterDefinitionId?: string, parameterValue?: string ) => void,
    onProviderInstanceNameChange?: ( newName: string ) => void,
    onCreate?: () => void,
    onRecurrenceIntervalChange?: (interval: number) => void,
    recurrenceInterval?: number,
    onDefaultProviderChange?: (value: boolean) => void
};

const ProviderParameterInput = ( props: ProviderParameterInputProps ) => {
    const [showHidden, setShowHidden] = React.useState(false)
    const connectionQueryState = React.useContext(ConnectionQueryContext)
    
    return (
        <div>
            {connectionQueryState?.loadProviderDefinitionQuery?.isLoading ? (
                <>Loading...</>
            ) : (
                <div>
                    <div>
                        <Row gutter={[30,15]}>
                            <Col span={12}>
                            <Paramheader>Instance name*</Paramheader>
                                <Input placeholder="Instance name" required value={props?.ProviderInstance?.ProviderInstance?.model?.Name} onChange={(event) => props?.onProviderInstanceNameChange?.(event.target.value)}/>
                            </Col>
                            {props?.ProviderInstance?.ProviderInstance?.model?.IsConfigurable !== false && props?.ProviderInstance?.ProviderParameterInstance?.map(paramInstance => {
                                const paramDef = props?.ProviderDefinition?.ProviderParameterDefinition?.find(paramDef => paramInstance?.ProviderParameterDefinitionId === paramDef?.Id)
                                const hidden = (paramDef?.Protected || false) && (!showHidden)
                                if(!!paramDef && paramDef?.FilledBy!=="FDS") {
                                    return (
                                            <Col span={12}>
                                                {paramInstance?.ProviderParameterDefinitionId===ProviderParameterDefinitionId.SLACK_ERROR_CHANNEL
                                                    ?
                                                        <SlackChannelSingle
                                                            parameterType='SLACK_CHANNEL_SINGLE'
                                                            inputProps={{
                                                                selectedChannelID: paramInstance?.ParameterValue,
                                                                onSelectedChannelIdChange: (selectedChannelId) => selectedChannelId && props?.onParameterValueChange?.(paramDef?.Id, selectedChannelId),
                                                                parameterName: ""
                                                            }}
                                                        />
                                                    :<>
                                                    <Paramheader>{paramDef?.ParameterName}*</Paramheader>

                                                        <Input
                                                            type={hidden ? "password" : undefined} 
                                                            placeholder={paramDef?.ParameterName} 
                                                            value={paramInstance?.ParameterValue} 
                                                            required 
                                                            onChange={(event) => props?.onParameterValueChange?.(paramDef?.Id, event.target.value)}
                                                        />
                                                        </>
                                                }
                                            </Col>
                                    )
                                } else {
                                    return <></>
                                }
                            })}
                        </Row>
                        <div>
                        <Checkbox checked={showHidden} onChange={(event) => setShowHidden(event.target.checked)}>Show hidden</Checkbox>
                        </div>
                    </div>
                    <div>
                    <Divider type="vertical" />
                    </div>
                        
                    <div>
                        <Input value={props.recurrenceInterval} placeholder="Recurrence Interval in Minutes" type="number" onChange={(event) => props?.onRecurrenceIntervalChange?.(parseInt(event.target.value))}/>
                        <Checkbox checked={props.ProviderInstance?.ProviderInstance?.model?.IsDefaultProvider} onChange={(event) => props.onDefaultProviderChange?.(event.target.checked)}>Make Default Provider</Checkbox>
                    </div>
                </div>
            )}
            
        </div>
    )
}
export const ProviderInputConnectionStateWrapper = () => {
    const { ProviderDefinitionId } = useParams();
    const connectionState = React.useContext(ConnectionStateContext)
    const setConnectionState = React.useContext(ConnectionSetStateContext)
    console.log(ProviderDefinitionId + " its id");
    
    React.useEffect(() => {
        setConnectionState({ type: "SetProviderDefinitionId", payload: { newProviderDefinitionId: ProviderDefinitionId ||"" }})
    }, [])
    const history = useNavigate()

    if(!!connectionState?.ProviderInformation && !!connectionState?.ProviderDefinitionDetail) {
        const paramInputProps: ProviderParameterInputProps = {
            ProviderDefinition: connectionState.ProviderDefinitionDetail,
            ProviderInstance: connectionState.ProviderInformation,
            onParameterValueChange: (parameterDefinitionId?: string, parameterValue?: string) => setConnectionState({ type: "SetProviderParameterValue", payload: { parameterDefinitionId: parameterDefinitionId, newValue: parameterValue }}),
            onProviderInstanceNameChange: (newName?: string) => setConnectionState({ type: "SetProviderInstanceName", payload: { newName: newName }}),
            onCreate: () => {},
            recurrenceInterval: connectionState.RecurrenceInterval,
            onRecurrenceIntervalChange: (recurrenceInterval?: number) => setConnectionState({
                type: 'SetRecurrenceInterval',
                payload: {
                    recurrenceInterval: recurrenceInterval || 0
                }
            })
        }
        const itrigateTitle = "Integrate with "+connectionState.ProviderDefinitionDetail.ProviderDefinition?.UniqueName
        const handleCancel = () => {
            history("/data/source")
          };
        return (
            
            <Modal title={itrigateTitle} open={true} onCancel={handleCancel} footer={<CreateProviderOptions/>} centered width={1000}>
                <div>
                    <DialogLogoContainer>
                        <Avatar.Group maxCount={2} >
                        <Avatar src={logo}></Avatar>
                            <Avatar style={{ backgroundColor: '#fff'}}><ProviderIcon providerUniqueName={connectionState.ProviderDefinitionDetail.ProviderDefinition?.UniqueName}/>
                            </Avatar>
                        </Avatar.Group>
                    </DialogLogoContainer>
                    <DilogTypoContaioner>
                    <DilogTypo1>
                    {`Connect ${connectionState.ProviderDefinitionDetail.ProviderDefinition?.UniqueName} to your workspace`}
                    </DilogTypo1>
                    <DilogTypo2>{`Connect to your ${connectionState.ProviderDefinitionDetail.ProviderDefinition?.UniqueName} database to sync all your data in real time.`}</DilogTypo2>
                    </DilogTypoContaioner>
                    <div>
                    <ProviderParameterInput {...paramInputProps}/>
                    </div>
                </div>
            </Modal>
        )
    } else {
        return <></>
    }
}

export default ProviderParameterInput;