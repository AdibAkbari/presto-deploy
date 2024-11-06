import { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, TextField } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid blue',
  boxShadow: 24,
  p: 4,
};

const PopupModal = ({ instruction, nameOfInput, onSubmit, open, onClose, confirmMsg, cancelMsg}) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!open) {
      setInputValue(''); // Clear input when the modal is closed
    }
  }, [open]);

  const handleAction = () => {
    onSubmit(inputValue); // Pass the input value (or null) to parents submit function
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
          {instruction}
        </Typography>
        
        {nameOfInput && (
          <TextField
            label={nameOfInput}
            type="text"
            variant="outlined"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
        )}
  
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button variant="contained" onClick={handleAction}>
            {confirmMsg}
          </Button>
          {cancelMsg && (
            <Button variant="outlined" onClick={onClose} sx={{ ml: 2 }}>
              {cancelMsg}
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default PopupModal;