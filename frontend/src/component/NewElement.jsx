import { useState, useEffect } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import NewElementModal from './NewElementModal';
import { Menu, Button } from '@mui/material';

export default function NewElement({presentation, setPresentation, currentSlideIndex, savePresentationsToStore, presentations}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [modalOpen, setModalOpen] = useState(false);

  const elementTypes = ['text', 'image', 'video', 'code'];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    if (elementTypes.includes(event.currentTarget.dataset.myValue)) {
      setModalOpen(true);
    }
    setAnchorEl(null);
  };

  const addElementToSlide = (element) =>{
    console.log('addingElementToSlide', element);
    const updatedPresentation = { ...presentation};
    updatedPresentation.slides[currentSlideIndex].elements.push(element);
    console.log(updatedPresentation);
    setPresentation(updatedPresentation);
    savePresentationsToStore(
      presentations.map(p => p.presentationId === presentation.presentationId ? updatedPresentation : p)
    );
    console.log(presentation);
  }

  return (
    <>
      <Button
        id="basic-button"
        variant="contained"
        color=""
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        New Element
      </Button>
      <Menu
        id="new-element-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem
          onClick={handleClose}
          data-my-value={'text'}
        >
          Text
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          data-my-value={'image'}
        >
          Image
        </MenuItem><MenuItem
          onClick={handleClose}
          data-my-value={'video'}
        >
          Video
        </MenuItem><MenuItem
          onClick={handleClose}
          data-my-value={'code'}
        >
          Code
        </MenuItem>
      </Menu>
      <NewElementModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        elementType={anchorEl}
        addElementToSlide={addElementToSlide}
      />
    </>
  );
}

