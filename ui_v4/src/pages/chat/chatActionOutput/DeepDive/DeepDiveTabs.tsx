import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { DeepDiveMainWrapper } from "./DeepDive.styles";
import DeepDiveDetails from "./index";

const TabComponent = ({deepdiveData}:any) => {
    console.log(deepdiveData)
    return ( <div>
        {/* <h2>{deepdiveData?.data?.ActionExecution?.ActionInstanceName || "New Deep Dive"}</h2> */}
        {/* Deep Dive Tabs pending */}
        {/* <DeepDiveTabs> */}
        <DeepDiveDetails defaultCode={deepdiveData?.data?.ActionInstance?.UserScript} actionExecutionDetailQuery={deepdiveData?.data}/>
        {/* </DeepDiveTabs> */}
        </div>)
}
const DeepDive = ({deepdiveData}:any) => {
    // console.log(deepdiveData)
    let [key, setKey] = useState(0)
    
    useEffect(() => {
        setKey(new Date().getTime())
    },[deepdiveData])
    
    return (
        
            <DeepDiveMainWrapper>
                <Tabs
                    key={key}
                    style={{background: '#F9FAFB'}}
                    hideAdd
                    activeKey={'1'}
                    items={[{
                        key: '1',
                        label: `New Deep Dive`,
                        children: <TabComponent deepdiveData={deepdiveData}/>,
                      }]}
                />
                </DeepDiveMainWrapper>
    )
}

export default DeepDive