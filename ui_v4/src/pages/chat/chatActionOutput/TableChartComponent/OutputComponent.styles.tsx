import { Typography } from "antd";
import styled from "styled-components";

export const TabsWrapper = styled.div`
    position:relative;
    top:-10px;

    & .ant-tabs-nav-wrap {
        justify-content: flex-end;
    }
    & .ant-tabs-tab {
        background-color: #fafafa !important;
    }
    & .ant-tabs-tab.ant-tabs-tab-active {
        background-color: white !important;
    }
`


export const TitleHeader = styled(Typography.Text)`
    position:relative;
    top:18px
`
