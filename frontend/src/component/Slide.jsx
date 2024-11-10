import { Box, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import EditElementModal from './EditElementModal';
import TextElement from '../elements/TextElement';

function Slide({ slide, slideIndex, onUpdateElement }) {
  const [selectedElement, setSelectedElement] = useState(null); // Track the element to edit
  const [isEditing, setIsEditing] = useState(false);
  const slideRef = useRef(null);
  const [slideWidth, setSlideWidth] = useState(0);
  const [slideHeight, setSlideHeight] = useState(0);

  useEffect(() => {
    if (slideRef.current) {
      const { offsetWidth, offsetHeight } = slideRef.current;
      setSlideWidth(offsetWidth);
      setSlideHeight(offsetHeight);
      console.log('slide width', slideWidth);
      console.log('slide Height', slideHeight);
    }
  })

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
      ref={slideRef}
      sx={{
        position: 'relative',
        width: '70%',
        outline: '2px solid grey',
        aspectRatio: '2/1',
        mt: 2,
      }}
    >
      {/* Render text elements on the slide */}
      {slide.elements &&
        slide.elements.map((element, index) =>
          element.type === 'text' ? (
            <TextElement 
              key={`${element.id}-${index}`} 
              element={element} 
              doubleClickFunc={handleDoubleClick}
              onUpdateElement={onUpdateElement}
              parentWidth={slideWidth}
              parentHeight={slideHeight}
            />
          ) : null
        )}

      {/* Slide number */}
      <Typography variant="subtitle1" sx={{ position: 'absolute', bottom: '0px', fontSize: '1em', ml: '0.8%' }}>
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