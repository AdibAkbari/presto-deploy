import { useContext } from 'react';
import PresentationContext from '../PresentationContext'
import {useNavigate} from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from '../StrictModeDroppable';

function SlidesRearrange() {
  const navigate = useNavigate();
  const {
    setIsRearranging,
    presentation
  } = useContext(PresentationContext);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Box 
        sx={{ 
          width: '70%',
          maxWidth: '1200px',
          minWidth: '600px'
        }}
      >
        <Typography variant="h5" gutterBottom>Rearrange Slides</Typography>
        
        <Button onClick={() => {
          setIsRearranging(false);
          navigate(-1);
        }}>Close</Button>
        <DragDropContext>
          <StrictModeDroppable droppableId='slides'>
            {(provided) => (
              <Grid
                container 
                spacing={2} 
                sx={{ 
                  mt: 3,
                }}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {presentation.slides.map((slide, index) => (
                  <Draggable key={`${presentation.presentationId}-${slide.slideId}`} draggableId={`${presentation.presentationId}-${slide.slideId}`} index={index}>
                    {(provided) => (
                      <Grid
                        item="true"
                        size={{xs: 12, sm: 6, md:4}}
                        key={slide.slideId}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      >
                        <Box
                          sx={{
                            width: '100%',
                            aspectRatio: '2 / 1',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#f5f5f5',
                            color: '#333',
                            cursor: 'pointer',
                            border: '1px solid #1976d3',
                            borderRadius: '4px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                            }
                          }}
                        >
                          {index + 1}
                        </Box>
                      </Grid>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Grid>
            )}
          </StrictModeDroppable>
        </DragDropContext>
      </Box>
    </Box>
  );
}


export default SlidesRearrange;