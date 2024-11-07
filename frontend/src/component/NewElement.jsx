import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import NewElementModal from './NewElementModal';

export default function NewElement() {
  const [elementType, setElementType] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const handleChange = (event) => {
    setElementType(event.target.value);
    setOpen(true);
  };

  const addElementToSlide = (element) =>{
    console.log('addingElementToSlide', element);

  }

  return (
    <>
      <FormControl sx={{width: '10%'}}>
        <InputLabel id="demo-simple-select-label">New Element</InputLabel>
        <Select
          value={elementType}
          label="New Element"
          onChange={handleChange}
        >
          <MenuItem value={10}>Text</MenuItem>
          <MenuItem value={20}>Code</MenuItem>
          <MenuItem value={30}>Image</MenuItem>
          <MenuItem value={30}>Video</MenuItem>
        </Select>
      </FormControl>
      <NewElementModal
        open={open}
        onClose={() => setOpen(false)}
        elementType={elementType}
        addElementToSlide={addElementToSlide}
      />
    </>
  );
}

