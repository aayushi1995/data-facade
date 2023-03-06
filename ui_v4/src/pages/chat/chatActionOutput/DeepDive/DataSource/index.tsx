import SelectProviderInstance from '@/pages/chat/chatActionDefination/SelectProviderInstance';
import { Select, Skeleton } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import UseFetchProviderInstanceDetailsHook from '../../../../../hooks/actionOutput/UseFetchProviderInstanceDetailsHook';
import { createProviderInstanceSelectData } from '../../../utils';



const DataSource = ({handleDataSource}:any) => {
    const { availableProviderInstanceQuery: childNodes, availableProviderDefinitionQuery: parentNodes } = UseFetchProviderInstanceDetailsHook()
    const [dataProviders, setDataProviders] = useState<any>([])

    // We are setting a data provider state and setting to it to the defaultProvider
    useEffect(() => {
        if(childNodes?.data?.length! > 0 && parentNodes?.data?.length! > 0){
            let data = createProviderInstanceSelectData(parentNodes?.data, childNodes?.data)
            setDataProviders([...data])
            let defaultValue =  data?.find((obj:any) => {
                return obj?.options?.find((o:any) => !!o?.IsDefaultProvider)
            })
            handleDataSource(defaultValue)
        }
    }, [childNodes.data, parentNodes.data])

    // fetch default 
    let defaultValue = useMemo(() => {
        return dataProviders?.find((obj:any) => {
            return obj?.options?.find((o:any) => !!o?.IsDefaultProvider)
        })
       
    },[dataProviders]);

    return (
        dataProviders.length > 0 ? (
            <Select
            size="large"
            style={{ width: '100%' }}
            onChange={handleDataSource}
            options={dataProviders}
            defaultValue={defaultValue?.options[0]}
        />
        ) : <Skeleton active />
    )
}
export default DataSource