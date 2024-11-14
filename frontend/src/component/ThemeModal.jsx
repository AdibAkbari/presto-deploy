import { useState } from 'react';
import { Box,
  Button,
  Modal,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  FormControlLabel,
  TextField,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '30%',
  bgcolor: 'background.paper',
  border: '1px solid black',
  borderRadius: '5px',
  boxShadow: 24,
  pb: 1
};

const ThemeModal = ({onSubmit, open, onClose, currentSlideIndex}) => {
  // 'default' refers to the presentation
  const [themeScope, setThemeScope] = useState('presentation');

  const [backgroundType, setBackgroundType] = useState('solid'); // default to 'solid'
  const [solidColor, setSolidColor] = useState('#ffffff');
  const [gradient, setGradient] = useState('linear-gradient(to right, #000, #fff)');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const handleAction = () => {
    const returnObject = {
      themeScope,
      backgroundType,
      solidColor: backgroundType === 'solid' ? solidColor : null,
      gradient: backgroundType === 'gradient' ? gradient : null,
      imageUrl: backgroundType === 'image' ? imageUrl : null,
    };
    onSubmit(returnObject);
    onClose();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggle = (event, newAlignment) => {
    setThemeScope(newAlignment);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <ToggleButtonGroup
          color="primary"
          value={themeScope}
          exclusive
          onChange={handleToggle}
          aria-label="Scope"
          sx={{ display: 'flex', justifyContent: 'center'}}
        >
          <ToggleButton 
            value="presentation" 
            sx={{ width: '50%'}}
          >
            Presentation
          </ToggleButton>
          <ToggleButton 
            value="current slide" 
            sx={{ width: '50%'}}
          >
            Current Slide
          </ToggleButton>
        </ToggleButtonGroup>

        <FormControl component="fieldset" sx={{ mt: 2, ml: 3 }}>
          <FormLabel component="legend">Background Theme Type</FormLabel>
          <RadioGroup
            value={backgroundType}
            onChange={(e) => setBackgroundType(e.target.value)}
          >
            <FormControlLabel value="solid" control={<Radio />} label="Solid Color" />
            {backgroundType === 'solid' && (
              <TextField
                label="Solid Color Hex"
                type="text"
                value={solidColor}
                onChange={(e) => setSolidColor(e.target.value)}
                sx={{ mt: 1 }}
              />
            )}
            <FormControlLabel value="gradient" control={<Radio />} label="Gradient" />
            {backgroundType === 'gradient' && (
              <TextField
                label="Gradient (CSS)"
                type="text"
                value={gradient}
                onChange={(e) => setGradient(e.target.value)}
                sx={{ mt: 1 }}
              />
            )}
            <FormControlLabel value="image" control={<Radio />} label="Image" />
            {backgroundType === 'image' && (
              <>
                <TextField
                  label="Image URL"
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  sx={{ mt: 1 }}
                />
                <input type="file" onChange={handleFileChange}/>
              </>
            )}
          </RadioGroup>
        </FormControl>


        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
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