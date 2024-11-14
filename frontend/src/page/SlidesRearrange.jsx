import { useContext, useEffect, useState } from 'react';
import PresentationContext from '../PresentationContext';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SlidesRearrange() {
  const navigate = useNavigate();
  const {
    presentation,
    presentationId,
    setPresentation,
    presentations,
    savePresentationsToStore,
    setIsRearranging
  } = useContext(PresentationContext);

  useEffect(() => {
    if (!presentation || !presentation.slides) {
      // Redirect back to the presentation page if no presentation (if user reloads)
      setIsRearranging(false);
      navigate(`/presentation/${presentationId}`);
    }
  }, [presentation, navigate]);

  // Local state to manage slides order during drag
  const [slidesOrder, setSlidesOrder] = useState(presentation?.slides || []);
  // saves original order of slides so user can see changes
  const [originalSlidesOrder, setOriginalSlidesOrder] = useState(presentation?.slides || []);

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id === over?.id) {
      return;
    }

    setSlidesOrder((slidesOrder) => {
      const oldIndex = slidesOrder.findIndex((slide) => slide.slideId === active.id);
      const newIndex = slidesOrder.findIndex((slide) => slide.slideId === over.id);
      const newSlides = [...arrayMove(slidesOrder, oldIndex, newIndex)];
      return newSlides;
    });
    
  };

  const handleSave = () => {
    const updatedPresentation = {
      ...presentation,
      slides: slidesOrder,
    };

    setPresentation(updatedPresentation);

    const updatedPresentations = presentations.map((p) =>
      p.presentationId === presentationId ? updatedPresentation : p
    );

    savePresentationsToStore(updatedPresentations);

    setOriginalSlidesOrder(slidesOrder);

    navigate(-1);
  };

  const handleCancel = () => {
    // doesn't update the presentation with the new order
    setSlidesOrder(originalSlidesOrder);
    setIsRearranging(false);
    // navigate back to presentation page
    navigate(-1);
  };

  return (
    <>
      {presentation && (
        <Box
          sx={{
            p: 3,
            ml: '8%',
            mr: '8%',
          }}
        >
          <Typography variant="h5" gutterBottom>
            Rearrange Slides
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button variant="contained" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </Box>


          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={slidesOrder.map((slide) => slide.slideId)}
              strategy={rectSortingStrategy}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(20%, 1fr))',
                  gap: 2,
                  mt: 3,
                }}
              >
                {slidesOrder.map((slide) => (
                  <SortableSlide
                    key={slide.slideId}
                    id={slide.slideId}
                    originalIndex={originalSlidesOrder.findIndex((s) => s.slideId === slide.slideId)}
                  />
                ))}
              </Box>
            </SortableContext>
          </DndContext>
        </Box>
      )}
    </>
  );
}

export default SlidesRearrange;

function SortableSlide({ id, originalIndex }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: '100%',
    aspectRatio: '2/1',
    border: '1px solid #ccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    userSelect: 'none',
    backgroundColor: '#fafafa',
    cursor: 'grab',
    boxShadow: isDragging ? '0 4px 8px rgba(0,0,0,0.2)' : 'none',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Typography variant="h4">{originalIndex + 1}</Typography>
    </div>
  );
}
