import { Box, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import ElementModal from './ElementModal';
import DisplayElement from '../elements/DisplayElement';
import PopupModal from './PopupModal';

function Slide({ slide, slideIndex, onUpdateElement, deleteElement, isPreview, presentation }) {
  const [selectedElement, setSelectedElement] = useState(null); // Track the element to edit
  const [isEditing, setIsEditing] = useState(false);
  const slideRef = useRef(null);
  const [slideWidth, setSlideWidth] = useState(0);
  const [slideHeight, setSlideHeight] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleOpenDeleteModal = (element) => {
    setSelectedElement(element);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    deleteElement(selectedElement.elementId);
    setIsDeleteModalOpen(false);
    setSelectedElement(null);
  };

  useEffect(() => {
    if (slideRef.current) {
      const { offsetWidth, offsetHeight } = slideRef.current;
      setSlideWidth(offsetWidth);
      setSlideHeight(offsetHeight);
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
        width: isPreview ? '98%' : '70%',
        outline: '2px solid grey',
        aspectRatio: '2/1',
        mt: 2,
      }}
    >
      {/* Render text elements on the slide */}
      {slide.elements &&
        slide.elements.map((element, index) =>
          <DisplayElement
            key={`${element.elementId}-${index}`}
            element={element}
            doubleClickFunc={handleDoubleClick}
            onUpdateElement={onUpdateElement}
            parentWidth={slideWidth}
            parentHeight={slideHeight}
            onOpenDeleteModal={handleOpenDeleteModal}
            isPreview={isPreview}
            presentation={presentation}
          />
        )}

      {/* Slide number */}
      {!isPreview && <Typography variant="subtitle1" sx={{ position: 'absolute', bottom: '0px', fontSize: '1em', ml: '0.8%' }}>
        {slideIndex + 1}
      </Typography> }

      {/* Modal to edit text box properties */}
      {!isPreview && (
        <>
          {isEditing && selectedElement && (
            <ElementModal
              open={isEditing}
              onClose={() => setIsEditing(false)}
              elementType={selectedElement.type}
              onSubmit={handleSave}
              initialData={selectedElement}
              mode="edit"
            />
          )}
          <PopupModal
            open={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            instruction="Are you sure you want to delete this element?"
            onSubmit={handleDelete}
            confirmMsg="Yes"
            cancelMsg="No"
          />
        </>
      )}
    </Box>
  );
}

export default Slide;