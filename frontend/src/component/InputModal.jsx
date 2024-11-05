import { useState } from 'react';
import {Box, Button, Typography, Modal, TextField } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';

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

const InputModal = ({instruction, nameOfInput, token}) => {
  const [open, setOpen] = useState(false);
  const [presName, setPresName] = useState('');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen} variant="contained" sx={{position: "fixed", bottom: "12px", right: "12px"}} endIcon={<CreateIcon/>}>
        New Presentation
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="subtitle1">
            {instruction}
          </Typography>
          <TextField
            label={nameOfInput}
            type="text"
            variant="outlined"
            value={presName}
            onChange={(e) => setPresName(e.target.value)}
            fullWidth
          />
          <br/>
          <br/>
          <Box sx={{display: "flex", justifyContent: "right"}}>
            <Button variant="contained" onClick={() => console.log('Presentation is created.')}>
              Create
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default InputModal;