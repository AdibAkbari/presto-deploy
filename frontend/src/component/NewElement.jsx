import { useState } from 'react';
import {Menu, Button, MenuItem, Tooltip} from '@mui/material/';
import ElementModal from './ElementModal';
import AddIcon from '@mui/icons-material/Add';

export default function NewElement({ presentation, setPresentation, currentSlideIndex, savePresentationsToStore, presentations, inMenu }) {
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
      <Tooltip title="Create a new Text, Image, Video or Code element" placement="bottom">
        <Button
          variant="text"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          endIcon={inMenu? null : <AddIcon/>}
          startIcon={inMenu? <AddIcon/> : null}
          sx={{my: inMenu? 0 : 2, color: 'black'}}
        >
          New Element
        </Button>
      </Tooltip>
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
      <ElementModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        elementType={elementType}
        onSubmit={addElementToSlide}
        mode="new"
      />
    </>
  );
}

