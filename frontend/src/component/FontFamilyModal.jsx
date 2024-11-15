import { useState, useEffect } from "react";
import { Box, Button, Typography, Modal, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid blue",
  boxShadow: 24,
  p: 4,
};

const FontFamilyModal = ({ instruction, onSubmit, open, onClose, confirmMsg, cancelMsg}) => {
  const [inputValue, setInputValue] = useState(null);

  useEffect(() => {
    if (!open) {
      setInputValue(null); // Clear input when the modal is closed
    }
  }, [open]);

  const handleAction = () => {
    onSubmit(inputValue); // Pass the input value (or null) to parents submit function
    onClose(); // Close the modal
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  }

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
        <FormControl>
          <RadioGroup
            aria-labelledby="font-family-radio-buttons-group"
            defaultValue="poppins"
            value={inputValue}
            onChange={handleChange}
            name="font-family-radio-buttons-group"
          >
            <FormControlLabel value="arial" control={<Radio />} label="Arial" />
            <FormControlLabel value="poppins" control={<Radio />} label="Poppins" />
            <FormControlLabel value="times-new-roman" control={<Radio />} label="Times New Roman" />
          </RadioGroup>
        </FormControl>

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

export default FontFamilyModal;