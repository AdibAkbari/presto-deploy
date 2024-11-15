import { useEffect, useState } from 'react';
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
import PopupModal from './PopupModal';

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

const errorMessage = "All fields are required.";

const ThemeModal = ({ updateTheme, open, onClose }) => {
  // 'presentation' is the default theme. Other scope is 'current slide'
  const [themeScope, setThemeScope] = useState('');

  const [backgroundType, setBackgroundType] = useState('solid');
  const [solidColor, setSolidColor] = useState('#ffffff');
  const [firstColor, setFirstColor] = useState('#000000');
  const [secondColor, setSecondColor] = useState('#ffffff');
  const [imageUrl, setImageUrl] = useState('');

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  useEffect(() => {
    console.log('theme scope', themeScope);
  }, [themeScope]);

  const handleAction = () => {
    if (themeScope === '' || themeScope === null) {
      setIsErrorModalOpen(true);
      return;
    }
    if (backgroundType === 'solid' && solidColor === '') {
      setIsErrorModalOpen(true);
      return;
    }
    if (backgroundType === 'gradient' && (firstColor === '' || secondColor === '')) {
      setIsErrorModalOpen(true);
      return;
    }
    if (backgroundType === 'image' && imageUrl === '') {
      setIsErrorModalOpen(true);
      return;
    }
    
    const returnObject = {
      themeScope,
      backgroundType,
      solidColor: backgroundType === 'solid' ? solidColor : null,
      gradient: backgroundType === 'gradient' ? `linear-gradient(${firstColor}, ${secondColor})` : null,
      imageUrl: backgroundType === 'image' ? imageUrl : null,
    };
    setSolidColor('#ffffff');
    setFirstColor('#000000');
    setSecondColor('#ffffff');
    setImageUrl('');
    updateTheme(returnObject);
    onClose();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

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
    <>
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
                <Box sx={{display: 'flex', justifyContent: 'start'}}>
                  <TextField
                    label="Colour 1"
                    type="text"
                    value={firstColor}
                    onChange={(e) => setFirstColor(e.target.value)}
                    sx={{ mt: 1, mr: 1, width: '45%' }}  
                  />
                  <TextField
                    label="Colour 2"
                    type="text"
                    value={secondColor}
                    onChange={(e) => setSecondColor(e.target.value)}
                    sx={{ mt: 1, width: '45%' }}
                  />
                </Box>
              )}
              <FormControlLabel value="image" control={<Radio />} label="Image" />
              {backgroundType === 'image' && (
                <>
                  <TextField
                    label="Image URL"
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    sx={{ mt: 1, mb: 1 }}
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
      <PopupModal
        open={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        instruction={errorMessage}
        onSubmit={() => setIsErrorModalOpen(false)}
        confirmMsg="OK"
      />
    </>
  );
};

export default ThemeModal;