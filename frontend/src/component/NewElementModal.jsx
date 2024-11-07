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

const NewElementModal = ({ open, onClose, elementType, addElementToSlide}) => {
  const [blockSizeValue, setBlockSizeValue] = useState(50);
  const [contentValue, setContentValue] = useState('');
  const [fontSizeValue, setFontSizeValue] = useState(1);
  const [fontColorValue, setFontColorValue] = useState('#000000');

  useEffect(() => {
    if (!open) {
      setBlockSizeValue(''); // Clear input when the modal is closed
    }
  }, [open]);

  const handleAction = () => {
    const newElement = {
      type: elementType,
      size: blockSizeValue,
      content: contentValue,
      fontSize: fontSizeValue,
      color: fontColorValue,
      position: { x: 0, y: 0 }
    }
    addElementToSlide(newElement);

    onClose(); // Close the modal
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
          New Text Box
        </Typography>
        
        <Box sx={{ display: "flex", justifyContent: "space-between"}}>
          <TextField
            label='Box size (%)'
            type="number"
            variant="outlined"
            value={blockSizeValue}
            onChange={(e) => setBlockSizeValue(e.target.value)}

            sx={{ mt: 2 }}
          />
          <TextField
            label='Font size (em)'
            type="number"
            variant="outlined"
            value={fontSizeValue}
            onChange={(e) => setFontSizeValue(e.target.value)}

            sx={{ mt: 2 }}
          />

          <TextField
            label='Font colour (hex)'
            type="text"
            variant="outlined"
            value={fontColorValue}
            onChange={(e) => setFontColorValue(e.target.value)}
          
            sx={{ mt: 2 }}
          />
        </Box>
        

        <TextField
          label='Content'
          type="text"
          variant="outlined"
          multiline
          rows={4}
          value={contentValue}
          onChange={(e) => setContentValue(e.target.value)}
          fullWidth
          sx={{ mt: 2 }}
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
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