// Could we combine this with NewElementModal somehow? Would be tricky though
import { useState, useEffect } from 'react';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';

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

function EditElementModal({ open, element, onClose, onSave }) {
  const [size, setSize] = useState(element.size || 50);
  const [content, setContent] = useState(element.content || '');
  const [fontSize, setFontSize] = useState(element.fontSize || 1);
  const [color, setColor] = useState(element.color || '#000000');
  const [position, setPosition] = useState(element.position || { x: 0, y: 0 });

  useEffect(() => {
    if (!open) {
      setSize(element.size || 50);
      setContent(element.content || '');
      setFontSize(element.fontSize || 1);
      setColor(element.color || '#000000');
      setPosition(element.position || { x: 0, y: 0 });
    }
  }, [open, element]);

  const handleSave = () => {
    const updatedElement = {
      ...element,
      size,
      content,
      fontSize,
      color,
      position,
    };
    onSave(updatedElement);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6">Edit Text Box</Typography>
        <TextField
          label="Box size (%)"
          type="number"
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          fullWidth
          sx={{ mt: 2 }}
        />
        <TextField
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          multiline
          rows={3}
          fullWidth
          sx={{ mt: 2 }}
        />
        <TextField
          label="Font Size (em)"
          type="number"
          value={fontSize}
          onChange={(e) => setFontSize(parseFloat(e.target.value))}
          fullWidth
          sx={{ mt: 2 }}
        />
        <TextField
          label="Color (Hex)"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          fullWidth
          sx={{ mt: 2 }}
        />
        <TextField
          label="Position X (%)"
          type="number"
          value={position.x}
          onChange={(e) => setPosition({ ...position, x: parseFloat(e.target.value) })}
          fullWidth
          sx={{ mt: 2 }}
        />
        <TextField
          label="Position Y (%)"
          type="number"
          value={position.y}
          onChange={(e) => setPosition({ ...position, y: parseFloat(e.target.value) })}
          fullWidth
          sx={{ mt: 2 }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
          <Button variant="contained" color="error" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default EditElementModal;
