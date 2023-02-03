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
    // const {availableProviderInstanceQuery} = SelectProviderInstanceHook()
    const { availableProviderInstanceQuery, availableProviderDefinitionQuery } = SelectProviderInstanceHook()


    React.useEffect(() => {
       
        fetchEntityBrowser('data').then((res: any) => {
            if (res) {
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
            const newObj = availableProviderInstanceQuery.data?.find((obj) => obj.Id === newData[0]?.providerInstanceId)
            setCurrent(newObj)
        }

    }, [availableProviderInstanceQuery.data, providerInstance])
    
    const handleProviderChange = (newProviderInstance:any) => {
        setCurrent(newProviderInstance)
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Box sx={{ width: '100%' }}>
                <h3>Scratch Pad</h3>
                    <hr/><br/>
                    <SelectProviderInstance
                        selectedProviderInstance={current}
                        onProviderInstanceChange={(newProviderInstance?: ProviderInstance) => 
                            newProviderInstance?.Id && handleProviderChange(newProviderInstance)
                        }
                    />
                    <br/><br/>
                    <ScratchPad dataSourceId={current?.Id} executionId={paramsExecutionId || executionId}/>
            </Box>
        </Box>

    )
}

export default ScratchPadLandingPage

