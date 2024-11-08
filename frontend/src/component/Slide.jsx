import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import EditElementModal from './EditElementModal';

function Slide({ slide, slideIndex, onUpdateElement }) {
  const [selectedElement, setSelectedElement] = useState(null); // Track the element to edit
  const [isEditing, setIsEditing] = useState(false);

  if (!slide) return null;

  const handleDoubleClick = (element) => {
    setSelectedElement(element);
    setIsEditing(true);
  };

  const handleSave = (updatedElement) => {
    onUpdateElement(updatedElement);
    setIsEditing(false);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '70%',
        border: '2px solid grey',
        aspectRatio: '2/1',
        mt: 2,
        p: 1,
      }}
    >
      {/* Render text elements on the slide */}
      {slide.elements &&
        slide.elements.map((element) =>
          element.type === 'text' ? (
            <Box
              key={element.elementId}
              onDoubleClick={() => handleDoubleClick(element)}
              sx={{
                position: 'absolute',
                top: `${element.position.y}%`,
                left: `${element.position.x}%`,
                width: `${element.width}%`,
                height: `${element.height}%`,
                color: element.color,
                fontSize: `${element.fontSize}em`,
                border: '1px solid grey',
                padding: 1,
                overflow: 'hidden',
                textAlign: 'left',
              }}
            >
              {element.content}
            </Box>
          ) : null
        )}

      {/* Slide number */}
      <Typography variant="subtitle1" sx={{ position: 'absolute', bottom: '0px', fontSize: '1em' }}>
        {slideIndex + 1}
      </Typography>

      {/* Modal to edit text box properties */}
      {isEditing && selectedElement && (
        <EditElementModal
          open={isEditing}
          element={selectedElement}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
        />
      )}
    </Box>
  );
}

export default Slide;