import styled from "styled-components";

export const DeepDiveTabs = styled.div`
    && .ant-tabs-content-holder{
        background:#fff;
        padding:20px 20px
    }
    && .ant-tabs-nav{
        margin:0
    }
    && .ant-tabs-tab-btn{
        text-transform:capitalize;
        color:#6B7280;
        font-weight:500;
    }
    && .ant-tabs-tab{
        border:none;
    }
    && .ant-tabs-tab-active{
        background:#FFF;
        & .ant-tabs-tab-btn{
            color:#000;
            font-weight:500;
        }

    }
    && .ant-tabs-nav::before{
        border:0
    }    
`