import { Tabs } from "antd";
import styled from "styled-components";

export const NavigationTabs = styled(Tabs)`
    padding: 5px 40px;
    height: 43px;
    && .ant-tabs-tab-btn{
        text-transform:capitalize
    }
    && .ant-tabs-tab{
        border:none;
        margin-right:8px;

    }
    && .ant-tabs-nav::before{
        border:0
    }
    && .ant-tabs-nav-add{
        border:0;
        font-weight:600;
    }

    && .ant-tabs-nav-add {
        border: 0;
        font-weight: 600;
        color: #0770e3;
        font-size: 16px;
    }

`

 