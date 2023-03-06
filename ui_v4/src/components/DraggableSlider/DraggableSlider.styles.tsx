import styled from "styled-components";

export const DraggableSliderWrapper = styled.div`
    display:flex;
    position:relative;

    & .Horizontal {
        overflow: inherit;
    }
    
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
export const SliderFlexBox = styled.div`
    display:flex;
    z-index: 1;
    position: relative;
`