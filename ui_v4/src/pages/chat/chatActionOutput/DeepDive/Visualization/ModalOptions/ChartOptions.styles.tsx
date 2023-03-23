import { Button } from 'antd'
import styled from 'styled-components'


export const ChartConfigModalStyled = styled.div`
   padding:20px;
   display:flex;
    width: 100%;
    justify-content: space-evenly;
    align-items: center;
    flex-wrap: wrap;
}
`
export const SelectWrapper = styled.div`
    padding: 10px;
    font-size: 14px;
    display:flex;
    
    & > label {
        min-width: 100px;
        width:100%
    }
    & > .ant-select.ant-select-single {
        width:100%;
        min-width:150px;
    }
`
export const StyledOptionWrap = styled.div`
    position:absolute;
    background-color:white;
    top:auto;
    left:auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`
export const OptionWrapperStyled = styled(Button)`
    display: block;

`
export const SelectedValueStyled = styled.div`
    display:flex;

    & > input {
        width:200px;
    }
`