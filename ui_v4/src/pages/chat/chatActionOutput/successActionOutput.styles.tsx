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