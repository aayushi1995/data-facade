import { CheckCircleOutlined, CheckOutlined, CloseOutlined, EditOutlined, PlayCircleOutlined, ThunderboltOutlined } from "@ant-design/icons"
import { Button, Card, Col, Form, Input, Row, Select, Space, Typography } from "antd"
import React from "react"
import { useState } from "react"

const actions = [
    {
        name: 'Table 1000',
        description: "Organize your spreadsheets with 1000 rows"
    },
    {
        name: "Scratchpad",
        description: "Description of the action occupying a maximum of two lines on the card"
    },
    {
        name: "Alpha Number",
        description: "Description of the action occupying a maximum of two lines on the card"
    }
]



const renderCode = () => <Card size="small">
    <code style={{ fontSize: 12 }}>
        {"WITH cte AS (SELECT {{column_names}} FROM {{table_name}}) INSERT INTO {{table_name}}({{column_names}}) SELECT * FROM cte UNION ALL SELECT {{values1}},{{values2}},...,{{valuesN}} UNION ALL SELECT {{values1}},{{values2}},...,{{valuesN}} UNION ALL . . . . . -- Add 10 rows here"}
    </code>
</Card>

const items = [
    {
        key: 'code',
        tab: 'Code',

    },
    {
        key: 'parameter',
        tab: `Parameter`,

    },
    {
        key: 'chart',
        tab: `Chart`,
    },
];

const contentList: Record<string, React.ReactNode> = {
    code: renderCode(),
    parameter: <p>content2</p>,
    chart: <p>content3</p>,
};


const tabExtraContent = () => <div><Button size="small" type="link" icon={<PlayCircleOutlined />}>Test</Button>
    <Button type="link" size="small" icon={<CheckCircleOutlined />}>Save</Button>
    <Button type="primary" size="small" icon={<ThunderboltOutlined />}>Run</Button>
</div>

const renderActionContent = () => <Card size="small" headStyle={{ border: 0 }} title="Actions" extra={<Button type="link" icon={<EditOutlined />} />}>
    <Row gutter={8} justify="space-between" >
        {
            actions.map((action: any, index: number) => <Col sm={8} key={index}>
                <Card size="small">
                    <Space direction="vertical" style={{ width: '100%' }} size="small">
                        <Button type="link" shape="circle" icon={<PlayCircleOutlined style={{ fontSize: 24 }} />} />
                        <Typography.Text strong >{action.name}</Typography.Text>
                        <Typography.Paragraph ellipsis={true}>{action.description}</Typography.Paragraph>
                    </Space>
                </Card>
            </Col>)
        }

    </Row>
</Card>

const renderEditAction = (activeTabKey: string, onScriptTabChange: any) => <Space direction="vertical" style={{ width: '100%' }} size="middle">
    <Select style={{ width: '100%' }} value={1}>
        <Select.Option value={1}>Connection Health</Select.Option>
        <Select.Option value={2}>Connection Health</Select.Option>
    </Select>
    <Card style={{ borderColor: 'blue' }} title="Script Generator"
        activeTabKey={activeTabKey}
        size="small"
        headStyle={{ border: 0 }}
        tabList={items}
        onTabChange={onScriptTabChange}
        tabProps={{ size: 'small' }}
        tabBarExtraContent={tabExtraContent()}
    >
        {contentList[activeTabKey]}
    </Card>

    <Card style={{ background: '#F9FAFB' }} bordered={false} size="small">
        <Row gutter={9}>
            <Col span={14}>
                <Form.Item label="What do you want to add to the code?">
                    <Input size="large" />
                </Form.Item>
            </Col>
            <Col span={10}>
                <Form.Item label="Select your script">
                    <Select value={1} size="large">
                        <Select.Option value={1}>PostgreSQL</Select.Option>
                        <Select.Option value={2}>mySQL</Select.Option>
                    </Select>
                </Form.Item>
            </Col>
            <Col span={24}>
                <Button type="primary" ghost block> {'< >'} Generate Code</Button>
            </Col>
        </Row>
    </Card>
</Space>

const DeepDiveDetails = () => {
    const [edit, setEdit] = useState(false);
    const [activeTabKey, setActiveTabKey] = useState<string>('code');
    const onScriptTabChange = (key: string) => {
        setActiveTabKey(key)
    }
    return (
        <Space direction="vertical" size="middle">
            <Card size="small" headStyle={{ border: 0 }} title="Data" extra={edit ? [<Button onClick={() => setEdit(false)} type="link" icon={<CheckOutlined />} />, <Button onClick={() => setEdit(false)} type="link" icon={<CloseOutlined />} />] : <Button onClick={() => setEdit(true)} type="link" icon={<EditOutlined />} />}>
                {
                    edit ?
                        renderEditAction(activeTabKey, onScriptTabChange)
                        :
                        renderCode()
                }
            </Card>

            {renderActionContent()}

            <Card title="Visualization" size="small" headStyle={{ border: 0 }}>
                Graph will be show here
            </Card>
            <Row justify="end" gutter={8}>

                <Space>
                    <Button type="primary" ghost>Discard Changes</Button>
                    <Button type="primary">Save</Button>
                </Space>
            </Row>
        </Space>
    )
}

export default DeepDiveDetails