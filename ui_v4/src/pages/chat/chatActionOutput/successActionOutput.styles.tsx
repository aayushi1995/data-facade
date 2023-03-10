import styled from "styled-components";

export const OutputTableStyled = styled.div`
    width: auto;
    height: 330px;
    overflow:scroll;

    & .ant-table-thead {
        position: sticky;
        top: 0px;
        background-color: white;
        z-index: 1;
    }
    &  .ant-select.ant-pagination-options-size-changer {
        display:none;
    }
`

export const OutputContainer = styled.div<any>`
    max-width: ${props => props.fromDeepDive ? "1000px" : "100%"};
    min-width:400px;
    margin-top:10px;
    width:100%;
    height:100%;
`
