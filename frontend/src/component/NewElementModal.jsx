import { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, TextField } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
  bgcolor: 'background.paper',
  border: '2px solid black',
  boxShadow: 24,
  p: 4,
};

const NewElementModal = ({ open, onClose, elementType, addElementToSlide }) => {
  const [blockSizeValue, setBlockSizeValue] = useState(50);
  const [contentValue, setContentValue] = useState('');
  const [fontSizeValue, setFontSizeValue] = useState(1);
  const [fontColorValue, setFontColorValue] = useState('#000000');
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  
  const modalTitle = () => {
    switch (elementType) {
    case 'text':
      return 'New Text Box';
    case 'image':
      return 'Add Image';
    case 'video':
      return 'Add Video';
    case 'code':
      return 'Add Code Box';
    default:
      return 'New Element';
    }
  }

  useEffect(() => {
    if (!open) {
      // Clear inputs when modal closes
      setBlockSizeValue(50);
      setContentValue('');
      setFontSizeValue(1);
      setFontColorValue('#000000');
      setImageUrl('');
      setAltText('');
    }
  }, [open]);

  const handleAction = () => {
    let newElement = {
      elementId: `element_${Date.now()}`,
      type: elementType,
      size: blockSizeValue,
      position: { x: 0, y: 0 },
    };

    switch (elementType) {
    case 'text':
      newElement = {
        ...newElement,
        content: contentValue,
        fontSize: fontSizeValue,
        color: fontColorValue,
      };
      break;
    case 'image':
      newElement = {
        ...newElement,
        url: imageUrl,
        altText: altText,
      };
      break;
    default:
      break;
    }

    addElementToSlide(newElement);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-title" variant="subtitle1">
          {modalTitle()}
        </Typography>
        
        <TextField
          label="Block size (%)"
          type="number"
          variant="outlined"
          value={blockSizeValue}
          onChange={(e) => setBlockSizeValue(e.target.value)}
          sx={{ mt: 2, width: '45%' }}
        />

        {/* Conditional fields based on element type */}
        {elementType === 'text' && (
          <>
            <TextField
              label="Content"
              type="text"
              variant="outlined"
              value={contentValue}
              onChange={(e) => setContentValue(e.target.value)}
              multiline
              rows={4}
              fullWidth
              sx={{ mt: 2 }}
            />
            <TextField
              label="Font size (em)"
              type="number"
              variant="outlined"
              value={fontSizeValue}
              onChange={(e) => setFontSizeValue(e.target.value)}
              sx={{ mt: 2, width: '45%' }}
            />
            <TextField
              label="Font color (hex)"
              type="text"
              variant="outlined"
              value={fontColorValue}
              onChange={(e) => setFontColorValue(e.target.value)}
              sx={{ mt: 2, ml: 2, width: '45%' }}
            />
          </>
        )}
        
        {elementType === 'image' && (
          <>
            <TextField
              label="Image URL"
              type="text"
              variant="outlined"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
            />
            <TextField
              label="Image Description"
              type="text"
              variant="outlined"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
            />
          </>
        )}

        {elementType === 'video' && (
          <>
          Complete
          </>
        )}

        {elementType === 'code' && (
          <>
          Complete
          </>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="contained" onClick={handleAction}>
            Confirm
          </Button>
          <Button variant="contained" color="error" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default NewElementModal;
