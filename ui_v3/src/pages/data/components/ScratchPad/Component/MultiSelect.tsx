import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const MultipleSelectCheckmarks = ({title, columns, handleMultiSelectChange, value}:any) => {
  const [personName, setPersonName] = React.useState<string[]>(value);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    handleMultiSelectChange(value)
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="multiSelectLabel">{title}</InputLabel>
        <Select
          labelId="multiSelectLabel"
          id="multiSelect"
          multiple
          value={personName || []}
          onChange={handleChange}
          input={<OutlinedInput label={title} />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {columns.map((obj:any) => (
            <MenuItem key={obj.field} value={obj.field}>
              <Checkbox checked={personName?.length > 0 && personName?.indexOf(obj.field) > -1} />
              <ListItemText primary={obj.field} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
export default MultipleSelectCheckmarks