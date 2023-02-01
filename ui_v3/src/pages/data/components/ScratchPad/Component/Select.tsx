import React, { useState } from 'react'
import '../styles.css'
import { FormControl, Select, MenuItem, InputLabel} from '@mui/material';


const SelectOptions = ({columns, handleSelectChange, title, defaultValue}:any) => {

    const [value, setValue] = useState(defaultValue)
    
    const handleChange = (event:any) => {
        setValue(event.target.value)
        handleSelectChange(event.target.value)
    }
    return (
        <div className='wrapper'>
            
            <FormControl style={{width:'100%', minWidth: '200px'}}>
                    <InputLabel id="data-source">{title}</InputLabel>
                    <Select
                        label="Select Data Source"
                        labelId="data-source"
                        id="demo-simple-select"
                        onChange={handleChange}
                        value={value || ""}
                        >
                        {columns?.map((obj:any) => (
                            <MenuItem value={obj.field}>{obj.name}</MenuItem>
                        ))}
                        
                    </Select>
                    </FormControl> 
        </div>
    )
}

export default SelectOptions