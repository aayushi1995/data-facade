import React, { useState } from 'react'
import { Collapse } from 'antd';
import {fetchEntityBrowser } from '../../../../../api/dataManager'
const { Panel } = Collapse;

interface IDynamicCollapsible {
    path:string
}

const DynamicCollapsible = ({path}:IDynamicCollapsible) => {

    const [data, setData] = useState([])
    
    React.useEffect(() => {
        if(path !== '') {
            fetchPathData(path)
        }
    },[path])


    const fetchPathData = async (path:string) => {
        fetchEntityBrowser(path)
        .then((response:any) => {
            console.log(response)
        })
        .catch((error:any) => {
            console.log(error)
        })
    }
    


    return (
        <Collapse defaultActiveKey={['1']} ghost>
            {data?.map((obj:any) => {
                console.log(obj?.IsExpandable === true)
                return (
                    <Panel header="" key="1" >
                        {obj?.name}
                        {/* {obj?.IsExpandable === true || obj?.type !== "table" && <DynamicCollapsible path={}/>} */}
                    </Panel>
                )
            })}
        </Collapse>
    )
}

export default DynamicCollapsible

