import dataManager from '@/api/dataManager'
import { ReactQueryWrapper } from '@/components/ReactQueryWrapper/ReactQueryWrapper'
import { TableProperties } from '@/generated/entities/Entities'
import { labels } from '@/helpers/constant'
import useFetchActionDefinitions from '@/hooks/actionDefinitions/useFetchActionDefinitions'
import { Col, Row } from 'antd'
import React from 'react'
import { useQuery } from 'react-query'
import TableSummary from './TableSummary'
import TableView from './TableView'

export type TableRowExpandedProps = {
    TableId?: string
}
export const formDateText = (timestamp?: number) => {
    const dateFormatter = new Intl.DateTimeFormat([], {year: "numeric", month: "short", day: "numeric", weekday: "short",hour: "numeric", minute: "numeric", second: "numeric", hour12: true})
        
    if(timestamp!==undefined){
        return dateFormatter.format(new Date(timestamp))
    } else {
        return ""
    }
}
const TableRowExpanded = (props: TableRowExpandedProps) => {
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
    
    return (
        <ReactQueryWrapper
            isLoading={tableDetailLoading}
            error={tableDetailError}
            data={tableDetailData}>
                <Row>
                    <Col span={24}>
                        <TableSummary TableId={tableDetailData?.Id}/>
                    </Col>
                    <Col span={24}>
                        <TableView showBTN={false} TableId={tableDetailData?.Id}/>
                    </Col>
                </Row>
            </ReactQueryWrapper>
    )
   
}

export default TableRowExpanded;
