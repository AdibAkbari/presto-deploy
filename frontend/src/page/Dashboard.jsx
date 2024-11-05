// Dashboard.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Grid, Card, CardContent, Box, Button } from '@mui/material';
import InputModal from '../component/InputModal';
import CreateIcon from '@mui/icons-material/Create';

function Dashboard({ token }) {
  const [presentations, setPresentations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls the InputModal

  // Load presentations when component mounts
  useEffect(() => {
    if (token) {
      axios
        .get('http://localhost:5005/store', { headers: { Authorization: `Bearer ${token}` } })
        .then(response => {
          console.log(response.data.store);
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
      title: title,
      description: '',
      thumbnail: '', // Grey square by default
      slides: [{ slideId: `slide_1`, elements: [] }] // Default with one empty slide
    };

    const updatedPresentations = [...presentations, newPresentation];
    setPresentations(updatedPresentations);
    savePresentationsToStore(updatedPresentations);
  };

  // Function to save presentations to the backend
  const savePresentationsToStore = (updatedData) => {
    axios
      .put('http://localhost:5005/store', { store: updatedData }, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => console.log("Presentations saved successfully"))
      .catch(error => console.error("Error saving presentations:", error));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>

      {/* New Presentation Button */}
      <Button
        onClick={() => setIsModalOpen(true)}
        variant="contained"
        sx={{ position: "fixed", bottom: "30px", right: "30px" }}
        endIcon={<CreateIcon />}
      >
        New Presentation
      </Button>

      {/* InputModal for creating a new presentation */}
      <InputModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        instruction="Enter the name of your new presentation"
        nameOfInput="Presentation Title"
        onSubmit={addPresentation}
      />
    </Box>
  );
}

export default Dashboard;