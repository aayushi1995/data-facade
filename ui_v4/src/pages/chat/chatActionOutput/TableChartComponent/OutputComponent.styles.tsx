import { Typography } from "antd";
import styled from "styled-components";

export const TabsWrapper = styled.div`
    position:relative;
    top:-10px;

    & .ant-tabs-nav-wrap {
        justify-content: flex-end;
    }
`


export const TitleHeader = styled(Typography.Text)`
    position:relative;
    top:18px
`
