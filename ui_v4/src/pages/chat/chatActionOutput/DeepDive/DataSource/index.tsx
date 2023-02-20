import ProviderInstanceId from '@/helpers/enums/ProviderInstanceId';
import { Select, Skeleton } from 'antd'
import { useEffect, useState } from 'react';
import UseFetchProviderInstanceDetailsHook from '../../../../../hooks/actionExecution/UseFetchProviderInstanceDetailsHook';
import { createProviderInstanceSelectData } from '../../utils'



const DataSource = ({handleDataSource}:any) => {
    const { availableProviderInstanceQuery: childNodes, availableProviderDefinitionQuery: parentNodes } = UseFetchProviderInstanceDetailsHook()
    const [dataProviders, setDataProviders] = useState<any>([])

    useEffect(() => {
        if(childNodes?.data?.length! > 0 && parentNodes?.data?.length! > 0){
            setDataProviders(createProviderInstanceSelectData(parentNodes?.data, childNodes?.data))
            handleDataSource()
        }
    }, [childNodes.data, parentNodes.data])

    return (
        dataProviders.length > 0 ? (
            <Select
            size="large"
            style={{ width: '100%' }}
            onChange={handleDataSource}
            options={dataProviders}
            defaultValue={{label: 'LocalDB', value: "231646c0-3e6c-4d35-aff6-ebdd62089c3e"}}
        />
        ) : <Skeleton active />
    )
}
export default DataSource