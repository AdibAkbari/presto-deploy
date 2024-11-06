import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Button } from '@mui/material';
import PopupModal from '../component/PopupModal';
import Slide from '../component/Slide';

function Presentation({ token }) {
  const { presentationId } = useParams();
  const [presentation, setPresentation] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [presentations, setPresentations] = useState([]);
  
  
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:5005/store', { headers: { Authorization: `Bearer ${token}` } })
        .then(response => {
          setPresentations(response.data.store || []);
          const currentPresentation = presentations.find(p => p.presentationId === presentationId);
          setPresentation(currentPresentation || null);
        })
        .catch(error => console.error("Error loading presentation:", error));
    }
  }, [token, presentationId, presentations]);


  const handleDelete = () => {
    axios.put('http://localhost:5005/store', 
      {
        store: presentations.filter(p => p.presentationId !== presentationId)
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(() => {
        navigate('/dashboard');
      })
      .catch(error => {
        console.error("Error deleting presentation:", error);
      });
  }

  return (
    
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      {/* Bar with back button, presentation title and delete presentation button */}
      <Box sx={{ display: 'flex', width: '100%' }}>
        <Button variant="contained" onClick={() => navigate('/dashboard')}>
          Back
        </Button>

        <Typography variant="h4" align="center" sx={{ flexGrow: 1, textAlign: 'center' }}>
          {presentation ? presentation.title : 'Loading...'}
        </Typography>

        <Button
          variant="contained"
          color="error"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          Delete Presentation
        </Button>
      </Box>

      {/* Delete confirmation modal */}
      <PopupModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        instruction="Are you sure you want to delete this presentation?"
        onSubmit={handleDelete}
        confirmMsg="Yes"
        cancelMsg="No"
      />
 
      {/* Displaying first slide */}
      {presentation && presentation.slides && presentation.slides.length > 0 && (
        <Slide slide={presentation.slides[0]} />
      )}
    </Box>
  );

}

export default Presentation;