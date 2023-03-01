import styled from "styled-components";

export const OutputTableStyled = styled.div`
    width: auto;
    height: 300px;
    overflow:scroll;

    & .ant-table-thead {
        position: sticky;
        top: 0px;
        background-color: white;
        z-index: 1;
    }
`

export const OutputContainer = styled.div`
    min-width:400px;
    margin-top:10px;
`