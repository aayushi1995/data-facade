import { Grid } from '@mui/material'
import React from 'react'
import { useQuery } from 'react-query'
import { SetModuleContextState } from '../../../common/components/ModuleContext'
import { ReactQueryWrapper } from '../../../common/components/ReactQueryWrapper'
import dataManager from '../../../data_manager/data_manager'
import { TableProperties } from '../../../generated/entities/Entities'
import labels from '../../../labels/labels'
import TableSummary from '../../table_details/components/TableSummary'
import TableView from '../../table_details/components/TableView'
import './../../../css/table_browser/TableRowExpanded.css'
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
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <TableSummary TableId={tableDetailData?.Id}/>
                    </Grid>
                    <Grid item xs={12}>
                        <TableView TableId={tableDetailData?.Id}/>
                    </Grid>
                </Grid>
            }
        />
    )
   
}

export default TableRowExpanded;
