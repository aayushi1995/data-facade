import { Box } from '@mui/system';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { fetchEntityBrowser } from '../../../../data_manager/data_manager';
import { ProviderInstance } from '../../../../generated/entities/Entities';
import SelectProviderInstance from '../../../applications/execute_action/components/SelectProviderInstance';
import SelectProviderInstanceHook from '../../../applications/execute_action/components/SelectProviderInstanceHook';
import ScratchPad from './ScratchPad';

export const ScratchPadLandingPage = () => {
    const [dataColumns, setDataColumns] = useState<any[]>([])
    const [current, setCurrent] = useState<any>()
    const [providerInstance, setProviderInstance] = useState<any[]>([])
    const paramsExecutionId = new URLSearchParams(window.location.href).get('executionId')  
    let executionId = (location.search === '?source=browser&name=ScratchPad') ? uuidv4() : paramsExecutionId
    const {availableProviderInstanceQuery} = SelectProviderInstanceHook()

    React.useEffect(() => {
       
        fetchEntityBrowser('data').then((res: any) => {
            if (res) {
                console.log(res)
                setProviderInstance(res)
            }
        })

    }, [])

    React.useEffect(() => {
        if(availableProviderInstanceQuery?.data && availableProviderInstanceQuery?.data?.length > 0 && providerInstance.length > 0 ){
            const newData = providerInstance?.map((obj:any) => {
                let findObj = availableProviderInstanceQuery?.data?.find(providerObj => providerObj.ProviderDefinitionId === obj.id)
                // console.log(findObj)
                return {
                    ...obj,
                    providerInstanceId: findObj?.Id
                }
            })
            setDataColumns(newData)
            setCurrent(newData[0].providerInstanceId)
        }
    }, [availableProviderInstanceQuery.data, providerInstance])
    
    const handleChange = (event:any) => {
        setCurrent(event.target.value)
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Box sx={{ width: '100%' }}>
                <h3>Scratch Pad</h3>
                    <hr/><br/>
                    <SelectProviderInstance
                        selectedProviderInstance={undefined}
                        onProviderInstanceChange={(newProviderInstance?: ProviderInstance) => 
                            newProviderInstance?.Id && setCurrent(newProviderInstance?.Id)
                        }
                    />
                    <br/><br/>
                    <ScratchPad current={current} dataSourceId={current} executionId={paramsExecutionId || executionId}/>
            </Box>
        </Box>

    )
}

export default ScratchPadLandingPage

