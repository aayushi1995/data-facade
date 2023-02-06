import { Grid } from '@mui/material'
import React from 'react'
import { useQuery } from 'react-query'
import { ReactQueryWrapper } from '../../../../common/components/error-boundary/ReactQueryWrapper'
import { SetModuleContextState } from '../../../../common/components/main_module/context/ModuleContext'
import dataManager from '../../../../data_manager/data_manager'
import { TableProperties } from '../../../../generated/entities/Entities'
import labels from '../../../../labels/labels'
import useFetchActionDefinitions from '../../../applications/workflow/create/hooks/useFetchActionDefinitions'
import TableSummary from '../../table_details/components/TableSummary'
import TableView from '../../table_details/components/TableView'
import RecommendedQuestions from '../../upload_table/components/RecommendedQuestions'
import './../../../../css/table_browser/TableRowExpanded.css'
import { formDateText } from './AllTableView'

export type TableRowExpandedProps = {
    TableId?: string
}

const TableRowExpanded = (props: TableRowExpandedProps) => {
    const setModuleContext = React.useContext(SetModuleContextState)
    const fetchedDataManagerInstance = dataManager.getInstance as { retreiveData: Function }

    const {isLoading: tableDetailLoading, error: tableDetailError, data: tableDetailData} = useQuery<TableProperties>(
        [labels.entities.TableProperties, props?.TableId], 
        () => {
            return fetchedDataManagerInstance.retreiveData(labels.entities.TableProperties, 
                {
                    filter: {
                        Id: props?.TableId
                    }
                })
                .then( (data: TableProperties[]) => data?.[0] )
        }
    )
    
    const [actionDefinitions, questionsLoading, questionsError] = useFetchActionDefinitions({
        filter: {TableId: props.TableId}
    })

    
    React.useEffect(() => {
        if(!!tableDetailData?.UniqueName) {
            const timestampString = formDateText(tableDetailData?.FullSyncedOn)
            setModuleContext({
                type: "SetHeader",
                payload: {
                    newHeader: {
                        Title: tableDetailData?.UniqueName,
                        SubTitle: `Last Synced ${timestampString} | From ${tableDetailData?.ProviderInstanceName}`
                    }   
                }
            })
        }
    }, [tableDetailData])

    return (
        <ReactQueryWrapper
            isLoading={tableDetailLoading}
            error={tableDetailError}
            data={tableDetailData}
            children={() => 
                <Grid container spacing={2  }>
                    <Grid item xs={12}>
                        <TableSummary TableId={tableDetailData?.Id}/>
                    </Grid>
                    <Grid item xs={12}>
                        <ReactQueryWrapper 
                            isLoading={questionsLoading}
                            error={questionsError}
                            data={actionDefinitions}>
                                {() => <RecommendedQuestions recommenedQuestions={actionDefinitions}/>}
                            </ReactQueryWrapper>
                    </Grid>
                    <Grid item xs={12}>
                        <TableView showBTN={true} TableId={tableDetailData?.Id}/>
                    </Grid>
                </Grid>
            }
        />
    )
   
}

export default TableRowExpanded;
