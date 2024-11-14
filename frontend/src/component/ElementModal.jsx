import { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, TextField, FormControlLabel, Checkbox } from '@mui/material';
import PopupModal from './PopupModal';

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

const defaultBlockSize = 30;
const errorMessage = "All fields are required.";

const ElementModal = ({ 
  open, 
  onClose, 
  elementType, 
  onSubmit,
  initialData = {},
  mode = "new" // "new" for new element, "edit" for edit element
}) => {
  const [blockWidth, setBlockWidth] = useState(initialData.width || defaultBlockSize);
  const [blockHeight, setBlockHeight] = useState(initialData.height || defaultBlockSize);
  const [contentValue, setContentValue] = useState(initialData.content || '');
  const [fontSizeValue, setFontSizeValue] = useState(initialData.fontSize || 1);
  const [fontColorValue, setFontColorValue] = useState(initialData.color || '#000000');
  const [mediaUrl, setMediaUrl] = useState(initialData.url || '');
  const [imageFile, setImageFile] = useState(null);
  const [altText, setAltText] = useState(initialData.altText || '');
  const [autoPlay, setAutoPlay] = useState(initialData.autoPlay || false);

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const modalTitle = () => {
    switch (elementType) {
    case 'text': return mode === 'new'? 'New Text Box': 'Edit Text Box';
    case 'image': return mode === 'new'? 'Add Image': 'Edit Image';
    case 'video': return mode === 'new'? 'Add Video': 'Edit Video';
    case 'code': return mode === 'new'? 'Add Code Box': 'Edit Code Box';
    default: return 'New Element';
    }
  }

  useEffect(() => {
    if (!open) {
      // Clear inputs when modal closes
      setBlockWidth(defaultBlockSize);
      setBlockHeight(defaultBlockSize);
      setContentValue('');
      setFontSizeValue(1);
      setFontColorValue('#000000');
      setMediaUrl('');
      setImageFile(null);
      setAltText('');
      setAutoPlay(false);
    }
  }, [open]);

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

  const handleSubmit = () => {
    if (mode === "new" && (!blockWidth || !blockHeight)) {
      setIsErrorModalOpen(true);
      return
    }
    let elementData = {
      elementId: initialData.elementId || `elid_${Date.now()}`,
      type: elementType,
      width: blockWidth,
      height: blockHeight,
      position: initialData.position || { x: 0, y: 0 },
    };

    switch (elementType) {
    case 'text':
      if (!contentValue || !fontSizeValue || !fontColorValue) {
        setIsErrorModalOpen(true);
        return;
      }
      elementData = {
        ...elementData,
        content: contentValue,
        fontSize: fontSizeValue,
        color: fontColorValue,
      };
      break;
    case 'image':
      if ((!mediaUrl && !imageFile) || !altText) {
        setIsErrorModalOpen(true);
        return;
      }
      elementData = {
        ...elementData,
        url: mediaUrl,
        altText: altText,
      };
      break;
    case 'video':
      if (!mediaUrl) {
        setIsErrorModalOpen(true);
        return;
      }
      elementData = {
        ...elementData,
        url: mediaUrl,
        autoPlay: autoPlay
      };
      break;
    case 'code':
      if (!contentValue || !fontSizeValue) {
        setIsErrorModalOpen(true);
        return;
      }
      elementData = {
        ...elementData,
        content: contentValue,
        fontSize: fontSizeValue,
      };
      break;
    default:
      break;
    }

    onSubmit(elementData),
    onClose();
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
          <Typography id="modal-title" variant="subtitle1">
            {modalTitle()}
          </Typography>

          {/* only show width and height inputs in new element mode */}
          {mode === "new" && (
            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
              <TextField
                label="Block width (%)"
                type="number"
                variant="outlined"
                value={blockWidth}
                onChange={(e) => setBlockWidth(e.target.value)}
                sx={{ mt: 2, width: '45%' }}
              />
              <TextField
                label="Block height (%)"
                type="number"
                variant="outlined"
                value={blockHeight}
                onChange={(e) => setBlockHeight(e.target.value)}
                sx={{ mt: 2, width: '45%' }}
              />
            </Box>
          )}
          

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
              <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
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
              </Box>
            </>
          )}
          
          {elementType === 'image' && (
            <>
              <TextField
                label="Image URL"
                type="text"
                variant="outlined"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
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
              <TextField
                label="Video URL"
                type="text"
                variant="outlined"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={autoPlay}
                    onChange={(e) => setAutoPlay(e.target.checked)}
                    color="primary"
                  />
                }
                label="Autoplay"
                sx={{ mt: 2 }}
              />
            </>
          )}

          {elementType === 'code' && (
            <>
              <TextField
                label="Code Content"
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
            </>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button variant="contained" onClick={handleSubmit}>
              {mode === "new" ? "Create" : "Save"}
            </Button>
            <Button variant="contained" color="error" onClick={onClose}>
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

export default ElementModal;
