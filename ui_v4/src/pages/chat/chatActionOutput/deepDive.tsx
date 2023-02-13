import { Col, Row, TabsProps,Tabs } from "antd";
import { DeepDiveTabs } from "./deepDive.style";
import DeepDiveDetails from "./deepDiveDetails";



const tabItems:TabsProps['items'] = [
    {
        label:'Mareting vs Sales',
        key:'1',
        children: <DeepDiveDetails/>
    },
    {
        label:'Mareting vs Sales v2',
        key:'2',
        children: `marketing vs Sales v2`
    }
]

const DeepDive = () => {
    return (
        <Row>
            <Col span={24} style={{ background: '#F9FAFB', padding: 20 }}>
                <DeepDiveTabs>
                <Tabs               
                    className="deepdive-tabs"
                    type="card"
                    size="middle"
                    items={tabItems}
                    tabBarGutter={9}
                    
                />
                </DeepDiveTabs>

            </Col>
        </Row>
    )
}

export default DeepDive