import React from 'react';
import {FormControl, MenuItem, Select} from '@material-ui/core';


const SelectOption = (props) => {


    const filterOption = props.filterOption !== undefined ? props.filterOption : props.menuItems[0].value
    const [option, setOption] = React.useState(filterOption)
    const handleSetOption = (event) => {
        setOption(event.target.value)

    }

    return (
        <FormControl variant="outlined" fullWidth>
            <Select
                value={option}
                onChange={(event) => {
                    handleSetOption(event);
                    props.filterOptionHandler(event);
                }}
            >
                {
                    props.menuItems.map((item, index) => (
                        <MenuItem value={item.value} key={`menuItem-selectoption-${index}`}>{item.display}</MenuItem>
                    ))
                }

            </Select>
        </FormControl>
    )

}

export default SelectOption;