import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Button } from '@mui/material';
import PopupModal from '../component/PopupModal';
import Slide from '../component/Slide';
import EditIcon from '@mui/icons-material/Edit';

function Presentation({ token }) {
  const { presentationId } = useParams();
  const [presentation, setPresentation] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Controls the Edit PopupModal
  const [isUpdateThumbnailOpen, setIsUpdateThumbnailOpen] = useState(false); // Controls the Update Thumbnail PopupModal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Controls the Delete Thumbnail PopupModal
  const [presentations, setPresentations] = useState([]);
  const navigate = useNavigate();

  // Function to handle editing the title of a presentation
  const editPresentationTitle = (newTitle) => {
    const currentPresentations = [...presentations];
    const presentationToEdit = currentPresentations.find(p => p.presentationId === presentationId);
    presentationToEdit.title = newTitle;
    setPresentations(currentPresentations);
    savePresentationsToStore(currentPresentations);
  };

  const updateThumbnail = (newThumbnail) => {
    console.log(newThumbnail);
    const currentPresentations = [...presentations];
    const presentationToEdit = currentPresentations.find(p => p.presentationId === presentationId);
    presentationToEdit.thumbnail = newThumbnail;
    setPresentations(currentPresentations);
    savePresentationsToStore(currentPresentations);
  }

  // Function to save presentations to the backend
  const savePresentationsToStore = (updatedData) => {
    axios
      .put('http://localhost:5005/store', { store: updatedData }, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => console.log("Presentation edited successfully"))
      .catch(error => console.error("Error editing presentations:", error));
  };

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
    <Box
      sx={{ p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {/* Bar with back button, presentation title and delete presentation button */}
      <Box sx={{
        display: 'flex',
        width: '100%'
        }}>
        <Button
          variant="contained"
          onClick={() => navigate('/dashboard')}
        >
          Back
        </Button>
        <Box sx={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '24px'
        }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{
              textAlign: 'center'
            }}
          >
            {presentation ? presentation.title : 'Loading...'}
          </Typography>
          <Button
            onClick={() => setIsEditModalOpen(true)}
            variant="contained"
            endIcon={<EditIcon/>}
          >
            Edit
          </Button>
          <PopupModal
            open={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            instruction="Enter a new title for your presentation"
            nameOfInput="New Title"
            onSubmit={editPresentationTitle}
            confirmMsg={"Edit"}
          />
        <Button
          onClick={() => setIsUpdateThumbnailOpen(true)}
          variant="contained"
          color="secondary"
          endIcon={<EditIcon/>}
        >
          Update Thumbnail
        </Button>
        <PopupModal
          open={isUpdateThumbnailOpen}
          onClose={() => setIsUpdateThumbnailOpen(false)}
          instruction="Put the URL of the image"
          nameOfInput="Thumbnail"
          onSubmit={updateThumbnail}
          confirmMsg={"Update"}
        />
        </Box>
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