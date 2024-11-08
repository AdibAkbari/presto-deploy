import { useState } from 'react';
import {Menu, Button, MenuItem} from '@mui/material/';
import NewElementModal from './NewElementModal';

export default function NewElement({ presentation, setPresentation, currentSlideIndex, savePresentationsToStore, presentations }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [elementType, setElementType] = useState('');

  const open = Boolean(anchorEl);
  const elementTypes = ['text', 'image', 'video', 'code'];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    if (elementTypes.includes(event.currentTarget.dataset.myValue)) {
      setElementType(event.currentTarget.dataset.myValue);
      setModalOpen(true);
    }
    setAnchorEl(null);
  };

  const addElementToSlide = (element) =>{
    console.log('addingElementToSlide', element);
    const updatedPresentation = { ...presentation};
    updatedPresentation.slides[currentSlideIndex].elements.push(element);
    setPresentation(updatedPresentation);
    savePresentationsToStore(
      presentations.map(p => p.presentationId === presentation.presentationId ? updatedPresentation : p)
    );
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
        {elementTypes.map((type) => (
          <MenuItem
            key={type}
            onClick={handleClose}
            data-my-value={type}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </MenuItem>
        ))}
      </Menu>
      <NewElementModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        elementType={elementType}
        addElementToSlide={addElementToSlide}
      />
    </>
  );
}

