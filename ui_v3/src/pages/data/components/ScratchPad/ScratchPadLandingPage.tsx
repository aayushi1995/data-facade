import { Box } from '@mui/system';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import dataManager, { fetchEntityBrowser } from '../../../../data_manager/data_manager';
import { ColumnProperties, ProviderInstance, TableProperties, TablePropertiesColumns } from '../../../../generated/entities/Entities';
import labels from '../../../../labels/labels';
import SelectProviderInstance from '../../../applications/execute_action/components/SelectProviderInstance';
import SelectProviderInstanceHook from '../../../applications/execute_action/components/SelectProviderInstanceHook';
import ScratchPad from './ScratchPad';

export const ScratchPadLandingPage = () => {
    const [current, setCurrent] = useState<any>()
    const [autoCompleteionData,setAutoCompleteionData]= useState<any[]>()
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
            const newObj = availableProviderInstanceQuery.data?.find((obj) => obj.Id === newData[0]?.providerInstanceId)
            handleProviderChange(newObj)
        }

    }, [availableProviderInstanceQuery.data, providerInstance])

    const handleFetchColumnDetails = (tableId:any) => {
            const filter: ColumnProperties = {TableId: tableId}
            const fetchedDataManager = dataManager.getInstance as { retreiveData: Function }

            fetchedDataManager?.retreiveData(labels.entities.ColumnProperties, {
                filter: filter
            }).then((response:any) => {
                if(response) {

                }
            })
    }

    const handleTableDetails = (providerInstanceId:any) => {
       
         const columnsToRetrieve: TablePropertiesColumns[] = ['Id', 'UniqueName']

            const filter: TableProperties = {
                    ProviderInstanceID: providerInstanceId
            }
            const fetchedDataManager = dataManager.getInstance as { retreiveData: Function }

            fetchedDataManager.retreiveData(labels.entities.TableProperties, {
                filter: filter,
                columnsToRetrieve: columnsToRetrieve
            }).then((response:any) => {
                handleReponseData(response)  
            })   

            fetchedDataManager?.retreiveData(labels.entities.ColumnProperties, {
                filter: filter
            }).then(((response:any) => {
                handleReponseData(response)  
            }))
                        
                
        }
    
    const handleReponseData = (response:any) => {
        let newResponse = response?.map((obj:any) => ({name: obj?.UniqueName, description: obj?.UniqueName}))

        autoCompleteionData ?  setAutoCompleteionData([...autoCompleteionData, ...newResponse]) : setAutoCompleteionData([...newResponse])
    }

    const handleProviderChange = (newProviderInstance:any) => {
        setCurrent(newProviderInstance)
        handleTableDetails(newProviderInstance.Id)
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
                    <ScratchPad autoCompleteionData={autoCompleteionData} dataSourceId={current?.Id} executionId={paramsExecutionId || executionId}/>
            </Box>
        </Box>

    )
}

export default ScratchPadLandingPage

