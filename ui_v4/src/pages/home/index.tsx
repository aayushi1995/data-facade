import useLogin from '@/hooks/useLogin'
import { Avatar, Button, Card, Col, Layout, Row, Space, Typography } from 'antd';
import React from 'react';
import { LoginOutlined } from '@ant-design/icons';

const Home = () => {

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const { handleLogin } = useLogin();

    const cardHeader = () => <React.Fragment>
        <Typography.Title level={3}>Login</Typography.Title>
        <Typography.Paragraph type="secondary">Please login to access your organisation</Typography.Paragraph>
    </React.Fragment>

    return (
        <Layout style={{ minHeight: '100vh', paddingTop: 200 }}>
            <Row justify="center" align="middle">
                <Col span={6}>
                    <Card title={cardHeader()} headStyle={{ border: 'none', padding: 20 }} bordered={false} hoverable>
                        
                            <Space size="large" direction="vertical" style={{width:'100%'}}>
                            {
                                user && user.name &&
                                <Row align="middle">
                                    <Col sm={4}>
                                        <Avatar size={50} src={user.picture} />
                                    </Col>
                                    <Col sm={20}>
                                        <Typography.Text>Welcome back , {user.name}</Typography.Text>
                                    </Col>
                                </Row>
                            }

                            <Row justify="space-between" align="middle">
                                <Col>
                                    <Typography.Link>Login to a different account</Typography.Link>
                                </Col>
                                <Col>
                                    <Button onClick={handleLogin} type="primary" block size="large" icon={<LoginOutlined />}>Login</Button>
                                </Col>
                            </Row>
                            </Space>

                       


                    </Card>
                </Col>

            </Row>
        </Layout>
    )
}
export default Home