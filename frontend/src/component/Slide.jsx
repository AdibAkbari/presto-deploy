import { Box, Typography } from '@mui/material';
import { useEffect, useRef, useState, useMemo } from 'react';
import ElementModal from './ElementModal';
import DisplayElement from '../elements/DisplayElement';
import PopupModal from './PopupModal';
import { motion, AnimatePresence } from 'framer-motion';

const Slide = (
  { 
    presentation, 
    slideIndex, 
    onUpdateElement, 
    deleteElement, 
    isPreview 
  }) => {
  const slide = presentation.slides[slideIndex];
  const slideRef = useRef(null);

  const [selectedElement, setSelectedElement] = useState(null); // Track the element to edit
  const [isEditing, setIsEditing] = useState(false);
  const [slideWidth, setSlideWidth] = useState(0);
  const [slideHeight, setSlideHeight] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleOpenDeleteModal = (element) => {
    setSelectedElement(element);
    setIsDeleteModalOpen(true);
  };

  // deletes select element from database
  const handleDelete = () => {
    deleteElement(selectedElement.elementId);
    setIsDeleteModalOpen(false);
    setSelectedElement(null);
  };

  // sets background to slide background if it exists, 
  // otherwise to default presentation background - otherwise white
  const backgroundObject = useMemo(() => {
    if (!presentation || !slide) return { background: 'white' };
    if (slide.backgroundColor !== 'none') {
      return { background: slide.backgroundColor };
    }
    else if (slide.backgroundImage !== '') {
      return {
        backgroundImage: `url(${slide.backgroundImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      };
    }
    else if (presentation.backgroundColor !== 'none') {
      return {background: presentation.backgroundColor };
    }
    else if (presentation.backgroundImage !== '') {
      return {
        backgroundImage: `url(${presentation.backgroundImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      };
    }
    else {
      return { background: 'white' };
    }
  }, [
    slide?.backgroundColor,
    slide?.backgroundImage,
    presentation?.backgroundColor,
    presentation?.backgroundImage
  ]);
  

  // Use ResizeObserver to watch for changes in slide dimensions
  useEffect(() => {
    const updateSize = () => {
      if (slideRef.current) {
        const { offsetWidth, offsetHeight } = slideRef.current;
        setSlideWidth(offsetWidth);
        setSlideHeight(offsetHeight);
        console.log(offsetWidth, offsetHeight);
      }
    };

    const resizeObserver = new ResizeObserver(updateSize);
    if (slideRef.current) resizeObserver.observe(slideRef.current);

    // Initial size setting
    updateSize();

    return () => resizeObserver.disconnect();
  }, []);

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
      // vary slide size depending on if preview mode
      sx={{
        position: 'relative',
        width: isPreview? '94%' : '70%',
        outline: '2px solid grey',
        aspectRatio: '2/1',
        mt: isPreview? '1%': '0%',
      }}
    >
      {/* Only has transition for preview mode */}
      {isPreview ? (
        <AnimatePresence mode="wait">
          <motion.div
            style={{
              width: '100%',
              height: '100%',
            }}
            key={slide.slideId}
            // fade in
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            // fade out
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ ...backgroundObject, width: '100%', height: '100%' }}>
              {slide.elements &&
                slide.elements.map((element, index) => (
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
                ))}
            </Box>
          </motion.div>
        </AnimatePresence>
      ) : (
        <Box sx={{ ...backgroundObject, width: '100%', height: '100%' }}>
          {slide.elements &&
            slide.elements.map((element, index) => (
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
            ))}
        </Box>
      )}


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
          {/* Modal for confirming slide delete */}
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
      {/* Slide number */}
      <Typography variant="subtitle1" sx={{ position: 'absolute', bottom: '0px', fontSize: '1em', ml: '0.8%' }}>
        {slideIndex + 1}
      </Typography>
    </Box>
  );
}

export default Slide;