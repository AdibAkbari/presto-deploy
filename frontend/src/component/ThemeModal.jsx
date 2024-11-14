import { useState, useEffect } from 'react';
import { Box,
  Button,
  Typography,
  Modal,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  TextField
} from '@mui/material';

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

const ThemeModal = ({onSubmit, open, onClose, currentSlideIndex}) => {
  const [inputValue, setInputValue] = useState(null);
  const [defaultImgUrl, setDefaultImgUrl] = useState('');
  const [slideImgUrl, setSlideImgUrl] = useState('');
  useEffect(() => {
    if (!open) {
      setInputValue(null); // Clear input when the modal is closed
      setDefaultImgUrl('');
      setSlideImgUrl('');
    }
  }, [open]);
  const handleAction = () => {
    onSubmit(slideImgUrl); // Pass the input value (or null) to parents submit function
    onClose(); // Close the modal
  };
  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaUrl(reader.result); // set mediaUrl to base64 string
      };
      reader.readAsDataURL(file);
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
          Set Presentations's Theme Type.
        </Typography>
        <FormControl>
          <RadioGroup
            aria-labelledby="font-family-radio-buttons-group"
            defaultValue="poppins"
            value={inputValue}
            onChange={handleChange}
            name="font-family-radio-buttons-group"
          >
            <FormControlLabel value="solid-colour" control={<Radio />} label="Solid Colour" />
            <FormControlLabel value="gradient" control={<Radio />} label="Gradient" />
            <FormControlLabel value="image" control={<Radio />} label="Image" />
          </RadioGroup>
        </FormControl>
        <Box>
          <Typography id="modal-title" variant="subtitle1">
            Set Presentations's Default Theme.
          </Typography>
          {
            inputValue === "image" &&
            <>
              <TextField
                label="Image URL"
                type="text"
                variant="outlined"
                value={defaultImgUrl}
                onChange={(e) => setDefaultImgUrl(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
              />
              <Typography variant="body2" sx={{ mt: 2 }}>Or upload a file:</Typography>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ marginTop: '8px', marginBottom: '8px' }}
              />
            </>
          }
        </Box>

        <Box>
          <Typography id="modal-title" variant="subtitle1">
            Set Slide's Default Theme.
          </Typography>
          {
            inputValue === "image" &&
            <>
              <TextField
                label="Image URL"
                type="text"
                variant="outlined"
                value={slideImgUrl}
                onChange={(e) => setSlideImgUrl(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
              />
              <Typography variant="body2" sx={{ mt: 2 }}>Or upload a file:</Typography>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ marginTop: '8px', marginBottom: '8px' }}
              />
            </>
          }
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button variant="contained" onClick={handleAction}>
            Save
          </Button>
          <Button variant="outlined" onClick={onClose} sx={{ ml: 2 }}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ThemeModal;