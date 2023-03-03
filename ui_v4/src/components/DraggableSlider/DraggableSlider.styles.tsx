import styled from "styled-components";

export const DraggableSliderWrapper = styled.div`
    display:flex;
    position:relative;

    & div[dir="Horizontal"] {
        position: relative;
        width: 50px;
        right: -50px;
        height: 80vh;
        background-color: transparent !important;
    }
    
    & div[dir="Horizontal"] ~ div {
        min-width: 50px !important;
    }
    & div[dir="Horizontal"] > div {
        background: #9CA3AF;
        position: relative;
        right: 4px;
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
    & div[dir="Horizontal"]:hover {
        background: transparent! important;
    }
`
export const SliderFlexBox = styled.div`
    display:flex;
    z-index: 1;
    position: relative;
`