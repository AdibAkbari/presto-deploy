import { useContext } from 'react';
import PresentationContext from '../PresentationContext'
import {useNavigate} from 'react-router-dom';
import { Box, Button, Typography, Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid2';

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
        
        <Grid 
          container 
          spacing={2} 
          sx={{ 
            mt: 3,
          }}
        >
          {presentation.slides.map((slide, index) => (
            <Grid
              item="true"
              size={{xs: 12, sm: 6, md:4}}
              key={slide.slideId}
            >
              <Card
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
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                  }
                }}
              >
                <CardContent>
                  {index + 1}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}


export default SlidesRearrange;