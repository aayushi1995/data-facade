import useLogin from '@/hooks/useLogin'
import { Avatar, Button, Card, Col, Layout, Row, Space, Typography } from 'antd';
import React from 'react';
import { ArrowRightOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons';
import './login.css'
import styled from 'styled-components';
import {ReactComponent as LoginLogo} from '@assets/icons/loginLogo.svg'

const LoginCardWrapper = styled.div`
    height: 100vh;
    width: 300px;
    background-color: rgb(246, 248, 252);
    width: 100vw;
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
`

const LoginTitle = styled.div`
    font-size:16px;
    color:#434343;
    font-weight: 400;
`
const UserInfoBlock = styled(Space)`
    padding:20px;
    border: 1px solid #C9CEDD;
    border-radius: 10px;
    width:100%;
`
const StyledButton = styled(Button)`
    background-color: #38C6FE;
    color: white;
    border-radius: 4px !important;
    height: 50px !important;
`
const LogoStyled = styled.div`
    font-size: 30px;
    font-weight:600;
    margin: 20px 0px;
`
const Login = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const { handleLogin } = useLogin();

    const cardHeader = () => <React.Fragment>
        <LogoStyled>
                <LoginLogo/> <span>Data Facade</span>
        </LogoStyled>
        <Typography.Title level={3} >Login</Typography.Title>
        <LoginTitle>Please login to access your organisation.</LoginTitle>
    </React.Fragment>

    return (
        <LoginCardWrapper>
            <Card title={cardHeader()} headStyle={{ border: 'none' }} bordered={false} hoverable style={{width:'500px', border:' 1px solid #C9CEDD',padding: '30px 50px'}}>
                <Space size="large" direction="vertical" style={{width:'100%',textAlign:'center'}}>
                {
                    user && user.name &&
                    <UserInfoBlock size={6}>
                        <Avatar style={{ backgroundColor: '' }} icon={<UserOutlined />} size="large" />
                        <div> <LoginTitle>Welcome back, <b>{user.name.split(' ')[0]}!</b></LoginTitle></div>
                    </UserInfoBlock>
                }   
                <div onClick={() => {
                    localStorage.removeItem('user')
                        handleLogin()
                }} style={{fontSize: '14px',fontWeight: '600'}}>
                    Login to a different account
                </div>
                <StyledButton onClick={handleLogin} type="primary" block size="large">Login <ArrowRightOutlined /></StyledButton>
                <div>Don't have an account? <span style={{color: '#38C6FE', fontWeight:600}}>Sign Up</span></div>
                </Space>
            </Card>
        </LoginCardWrapper>
    )
}
export default Login