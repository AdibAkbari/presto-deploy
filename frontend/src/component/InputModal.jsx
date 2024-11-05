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

const InputModal = ({ instruction, nameOfInput, onSubmit, open, onClose }) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!open) {
      setInputValue(''); // Clear input when the modal is closed
    }
  }, [open]);

  const handleCreate = () => {
    if (inputValue.trim()) {
      onSubmit(inputValue); // Trigger the parent’s submit function
      onClose(); // Close the modal
    }
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
        <TextField
          label={nameOfInput}
          type="text"
          variant="outlined"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          fullWidth
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button variant="contained" onClick={handleCreate}>
            Create
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default InputModal;