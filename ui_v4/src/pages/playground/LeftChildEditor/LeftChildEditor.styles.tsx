import Input from "antd/es/input";
import Select from "antd/es/select";
import styled from "styled-components";


export const PlaygroundLeftChildWrapper = styled.div`
    // styles
`
export const StyledInput = styled(Input)`
    border: 1px solid #E5E7EB;
    height:50px;
    width;100%;
    min-width:300px;
    border-radius: 0px;
`

export const StyledLabel = styled.div`
    width:100%;
    font-size:14px;
    color: #6B7280;
    margin-bottom:10px;
`
export const StyledLanguageSelect = styled(Select)`
    & > .ant-select-selector{
        height:50px !important;
        border: 1px solid #D1D5DB;
        display: flex;
        align-items: center;
        border-radius: 0px;
    }
`
export const FlexBox = styled.div`
    display:flex;
    align-items: center;
    justify-content: space-between;
`