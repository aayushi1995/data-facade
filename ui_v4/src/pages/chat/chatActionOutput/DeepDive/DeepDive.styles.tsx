import { Col, Collapse } from "antd";
import styled from "styled-components";
const {Panel} = Collapse

export const DeepDiveMainWrapper = styled<any>(Col)`
    padding: 20px;
    margin: 10px;
    height: 75vh;
    overflow: scroll;
    background-color: #F9FAFB;
`
export const DeepDiveCollapsable = styled.div`
    width:100%;
`
export const StyledPanel = styled<any>(Panel)`
    font-size: 18px;
    font-weight:600;
    margin: 10px 0px;
    border: 1px solid lightgrey;
    background-color:white;
    border-bottom: 1px solid lightgrey !important;
`
export const PlaceHolderText = styled.div`
    color: #9CA3AF;
    font-size: 14px;
    padding: 10px;
    background-color: #F9FAFB;
    font-weight: 500;
`

