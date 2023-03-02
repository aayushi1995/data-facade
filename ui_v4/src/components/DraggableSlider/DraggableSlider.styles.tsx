import styled from "styled-components";

export const DraggableSliderWrapper = styled.div`
    display:flex;
    position:relative;

    & div[dir="Horizontal"] {
        height: 80vh;
        background-color: transparent !important;
    }
    & div[dir="Horizontal"] ~ div {
        min-width: 50px !important;
    }
    & div[dir="Horizontal"] > div {
        background: #9CA3AF;
        position: relative;
        right: -25px;
        border-radius: 0px;
        z-index: 2;
    }

    & div[dir="Horizontal"] > div::before {
        content: "";
        display: block;
        height: 24px;
        width: 4px;
        position: relative;
        background: #9CA3AF;
        right: -8px;
    }
`
export const FlexBox = styled.div`
    display:flex;
    z-index: 1;
    position: relative;
`