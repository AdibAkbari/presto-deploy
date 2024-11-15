import { useEffect, useState } from 'react';
import axios from 'axios';
import BACKEND_PORT from '../../backend.config.json';
import { Typography, Card, CardContent, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid2';
import PopupModal from '../component/PopupModal';
import CreateIcon from '@mui/icons-material/Create';

const Dashboard = ({ token }) => {
  const [presentations, setPresentations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls the PopupModal
  const navigate = useNavigate();
  // Load presentations when component mounts
  useEffect(() => {
    if (token) {
      axios
        .get(
          `http://localhost:${BACKEND_PORT.BACKEND_PORT}/store`, 
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(response => {
          let newPresentations;
          if (!response.data.store || Object.keys(response.data.store).length === 0) {
            newPresentations = [];
          }
          else {
            newPresentations = response.data.store
          }
          setPresentations(newPresentations);
        })
        .catch(error => {
          console.error("Error loading presentations:", error);
          setPresentations([]);
        });
    }
  }, [token]);

  // Function to handle adding a new presentation
  const addPresentation = (title) => {
    const newPresentation = {
      presentationId: `id_${Date.now()}`, // Temporary unique ID
      backgroundColor: 'none',
      backgroundImage: '',
      title: title,
      description: '',
      thumbnail: '', // Grey square by default
      slides: [{ slideId: `slide_${Date.now()}`,
        elements: [],
        backgroundImage: '',
        backgroundColor: 'none'
      }], // Default with one empty slide
      fontFamily: 'poppins'
    };

    const updatedPresentations = [...presentations, newPresentation];
    setPresentations(updatedPresentations);
    savePresentationsToStore(updatedPresentations);
  };

  // Function to save presentations to the backend
  const savePresentationsToStore = (updatedData) => {
    axios
      .put(`http://localhost:${BACKEND_PORT.BACKEND_PORT}/store`, { store: updatedData }, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => console.log("Presentations saved successfully"))
      .catch(error => console.error("Error saving presentations:", error));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      {/* Presentation represented in a grid*/}
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={4} sx={{ mt: 3 }}>
          {presentations.map(presentation => (
            <Grid
              item = "true"
              size={{xs: 12, sm: 6, md:4}} 
              key={presentation.presentationId}
              // navigate to the presentation page of presentation clicked
              onClick={() => navigate(`/presentation/${presentation.presentationId}`)}
            >
              <Card
                sx={{ width: '100%',
                  aspectRatio: '2 / 1',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'grey',
                  backgroundImage:`linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${presentation.thumbnail})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  color: 'white'
                }}
              >
                <CardContent>
                  <Typography variant="h6" overflow="hidden">{presentation.title}</Typography>
                  <Typography variant="body2">{presentation.description}</Typography>
                  <Typography variant="caption">Slides: {presentation.slides?.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* New Presentation Button */}
      <Button
        onClick={() => setIsModalOpen(true)}
        variant="contained"
        sx={{ position: "fixed", bottom: "30px", right: "30px" }}
        endIcon={<CreateIcon />}
      >
        New Presentation
      </Button>

      {/* PopupModal for creating a new presentation */}
      <PopupModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        instruction="Enter the title of your new presentation"
        nameOfInput="Presentation Title"
        onSubmit={addPresentation}
        confirmMsg={"Create"}
      />
    </Box>
  );
}

export default Dashboard;
