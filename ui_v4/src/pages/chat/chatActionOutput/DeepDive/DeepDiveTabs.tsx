import { Tabs } from "antd";
import { useEffect, useRef, useState } from "react";
import { DeepDiveMainWrapper } from "./DeepDive.styles";
import DeepDiveDetails from "./index";

const TabComponent = ({deepdiveData, handleActionSelected}:any) => {
    return ( 
        <div>
            <DeepDiveDetails defaultCode={deepdiveData?.data?.ActionInstance?.UserScript} actionExecutionDetailQuery={deepdiveData?.data} ResultTableName={deepdiveData?.data?.ActionInstance?.ResultTableName} handleActionSelected={handleActionSelected}/>
        </div>
    )
}

const initialItems = (deepdiveData:any, handleActionSelected:any) => [{
    label: 'New Deep Dive',
    children: <TabComponent deepdiveData={deepdiveData} handleActionSelected={handleActionSelected}/>,
    key: '0',
    closable: true,
  }]

const DeepDive = ({deepdiveData, handleActionSelected}:any) => {
        const [items, setItems] = useState(initialItems(deepdiveData, handleActionSelected));
        const [activeKey, setActiveKey] = useState<any>('0');
        const newTabIndex = useRef(0);

        const onChange = (newActiveKey: string) => {
            setActiveKey(newActiveKey);
        };
        

        const add = () => {
            const newActiveKey = `${newTabIndex.current++}`;
            const newPanes = [...items];
            newPanes.push({ label: 'title', children: <TabComponent deepdiveData={deepdiveData} handleActionSelected={handleActionSelected}/>, key: newActiveKey, closable: true });
            setItems(newPanes);
            setActiveKey(newActiveKey);
        };

        const remove = (targetKey: any) => {
            let newActiveKey = activeKey;
            let lastIndex = -1;
            items.forEach((item, i) => {
            if (item.key === targetKey) {
                lastIndex = i - 1;
            }
            });
            const newPanes = items.filter((item) => item.key !== targetKey);
            if (newPanes.length && newActiveKey === targetKey) {
            if (lastIndex >= 0) {
                newActiveKey = newPanes[lastIndex].key;
            } else {
                newActiveKey = newPanes[0].key;
            }
            }
            setItems(newPanes);
            setActiveKey(newActiveKey);
        };

        const onEdit = (targetKey: any, action: 'add' | 'remove') => {
            if (action === 'add') {
              add();
            } else {
              remove(targetKey);
            }
          };

        useEffect(() => {
            let DDobj = items?.find((obj:any) => obj?.key === deepdiveData?.data?.ActionInstance?.ResultTableName)
            if(!DDobj){
                let temp = {
                    label: deepdiveData?.data?.ActionDefinition?.UniqueName || 'New Tab',
                    children: <TabComponent deepdiveData={deepdiveData} handleActionSelected={handleActionSelected}/>,
                    key: deepdiveData?.data?.ActionInstance?.ResultTableName,
                    closable: true,
                }
                items[0].key === '0' ? setItems([temp]) :  setItems([...items,temp])
            } 
           
            if(items.length === 0) {
                setItems(initialItems(deepdiveData, handleActionSelected))
            }
            setActiveKey(deepdiveData?.data?.ActionInstance?.ResultTableName)
        },[deepdiveData])
       
    
    return (
            <DeepDiveMainWrapper>
                <Tabs
                    hideAdd
                    onChange={onChange}
                    activeKey={activeKey}
                    type="editable-card"
                    onEdit={onEdit}
                    items={items}
                />
                </DeepDiveMainWrapper>
    )
}

export default DeepDive