import { useNavigate, useParams, useLocation, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import BACKEND_PORT from '../../backend.config.json';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import PopupModal from '../component/PopupModal';
import Slide from '../component/Slide';
import EditIcon from '@mui/icons-material/Edit';
import NewElement from '../component/NewElement';
import SlidesRearrange from './SlidesRearrange';
import PresentationContext from '../PresentationContext';

function Presentation({ token }) {
  const { presentationId } = useParams();
  const [presentation, setPresentation] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Controls the Edit PopupModal
  const [isUpdateThumbnailOpen, setIsUpdateThumbnailOpen] = useState(false); // Controls the Update Thumbnail PopupModal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Controls the Delete Thumbnail PopupModal
  const [presentations, setPresentations] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isSlideInitialized, setIsSlideInitialized] = useState(false);
  const [isRearranging, setIsRearranging] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to handle editing the title of a presentation
  const editPresentationTitle = (newTitle) => {
    if (presentation) {
      const updatedPresentation = { ...presentation, title: newTitle };
      setPresentation(updatedPresentation);
      savePresentationsToStore(
        presentations.map(p => p.presentationId === presentationId ? updatedPresentation : p)
      );
    }
  };

  // tries to get slide number from url
  useEffect(() => {
    if (!isRearranging && !isSlideInitialized) {
      const searchParams = new URLSearchParams(location.search);
      const slideParam = searchParams.get('slide');
      if (slideParam) {
        const slideNumber = parseInt(slideParam, 10) - 1;
        if (!isNaN(slideNumber)) {
          setCurrentSlideIndex(slideNumber);
        }
      }
      setIsSlideInitialized(true); // prevents flickering between slides after reload
    }
  }, [location.search, isSlideInitialized]);
  
  // adds slide number to url when currentSlideIndex changes
  useEffect(() => {
    if (!isRearranging && isSlideInitialized) {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('slide', currentSlideIndex + 1);
      navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    }
  }, [currentSlideIndex, location.pathname, navigate, isSlideInitialized]);
  
  // updates element of current slide in presentation
  const updateElement = (updatedElement) => {
    console.log('updating element', updatedElement);
    const updatedSlides = [...presentation.slides];
    const currentSlide = { ...updatedSlides[currentSlideIndex] };
    currentSlide.elements = currentSlide.elements.map((el) =>
      el.elementId === updatedElement.elementId ? updatedElement : el
    );
    updatedSlides[currentSlideIndex] = currentSlide;
    const updatedPresentation = { ...presentation, slides: updatedSlides };
    setPresentation(updatedPresentation);
    savePresentationsToStore(
      presentations.map((p) =>
        p.presentationId === updatedPresentation.presentationId ? updatedPresentation : p
      )
    );
  };

  const deleteElement = (elementId) => {
    const updatedSlides = [...presentation.slides];
    const currentSlide = { ...updatedSlides[currentSlideIndex] };
    currentSlide.elements = currentSlide.elements.filter((el) => el.elementId !== elementId);
    updatedSlides[currentSlideIndex] = currentSlide;
    const updatedPresentation = { ...presentation, slides: updatedSlides };
    setPresentation(updatedPresentation);
    savePresentationsToStore(
      presentations.map((p) =>
        p.presentationId === updatedPresentation.presentationId ? updatedPresentation : p
      )
    );
  };

  const updateThumbnail = (newThumbnail) => {
    if (presentation) {
      const updatedPresentation = { ...presentation, thumbnail: newThumbnail };
      setPresentation(updatedPresentation);
      savePresentationsToStore(
        presentations.map(p => p.presentationId === presentationId ? updatedPresentation : p)
      );
    }
  }

  const createNewSlide = () => {
    if (presentation) {
      const newSlide = {
        slideId: `slide_${presentation.slides.length + 1}`,
        elements: []
      }
      const updatedPresentation = { ...presentation, slides: [...presentation.slides, newSlide] };
      setPresentation(updatedPresentation);
      savePresentationsToStore(
        presentations.map(p => p.presentationId === presentationId ? updatedPresentation : p)
      );
      setCurrentSlideIndex(updatedPresentation.slides.length - 1);
    }
  }

  const deleteSlide = () => {
    if (presentation) {
      // Check if the user is deleting the last slide in the presentation.
      if (presentation.slides.length === 1) {
        // Delete the presentation
        setIsDeleteModalOpen(true);
      } else {
        // Delete current slide
        const updatedSlides = [...presentation.slides];
        updatedSlides.splice(currentSlideIndex, 1);
        const updatedPresentation = {...presentation, slides: updatedSlides};
        setPresentation(updatedPresentation);
        savePresentationsToStore(
          presentations.map(p => p.presentationId === presentationId ? updatedPresentation : p)
        );
        // Show the previous slide
        setCurrentSlideIndex(currentSlideIndex - 1);
      }
    }
  }

  // Function to save presentations to the backend
  const savePresentationsToStore = (updatedData) => {
    axios
      .put(`http://localhost:${BACKEND_PORT.BACKEND_PORT}/store`, { store: updatedData }, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => console.log("Presentation edited successfully", updatedData))
      .catch(error => console.error("Error editing presentations:", error));
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft" && currentSlideIndex > 0) {
        setCurrentSlideIndex(currentSlideIndex - 1);
      } else if (event.key === "ArrowRight" && currentSlideIndex < presentation.slides.length - 1) {
        setCurrentSlideIndex(currentSlideIndex + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlideIndex, presentation?.slides?.length]);

  const handlePreview = () => {
    window.open(`/preview/${presentationId}`, '_blank');
  };

  useEffect(() => {
    if (token) {
      axios.get(`http://localhost:${BACKEND_PORT.BACKEND_PORT}/store`, { headers: { Authorization: `Bearer ${token}` } })
        .then(response => {
          setPresentations(response.data.store || []);
          const currentPresentation = presentations.find(p => p.presentationId === presentationId);
          setPresentation(currentPresentation || null);
        })
        .catch(error => console.error("Error loading presentation:", error));
    }
  }, [token, presentationId, presentations]);

  const handleDelete = () => {
    axios.put(`http://localhost:${BACKEND_PORT.BACKEND_PORT}/store`,
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

  const contextValue = {
    presentation,
    setPresentation,
    presentations,
    savePresentationsToStore,
    currentSlideIndex,
    setCurrentSlideIndex,
    presentationId,
    token,
    navigate,
    setIsRearranging
  };


  return (
    <PresentationContext.Provider value={contextValue}>
      <Routes>
        <Route
          path="/"
          element={
            <Box
              sx={{ 
                p: 3,
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
                  <NewElement
                    presentation={presentation}
                    setPresentation={setPresentation}
                    currentSlideIndex={currentSlideIndex}
                    savePresentationsToStore={savePresentationsToStore}
                    presentations={presentations}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePreview}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      setIsRearranging(true)
                      navigate('rearrange')
                    }}
                  >
                    Rearrange Slides
                  </Button>
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
                <Slide 
                  slide={presentation.slides[currentSlideIndex]} 
                  slideIndex={currentSlideIndex} 
                  onUpdateElement={updateElement}
                  deleteElement={deleteElement}
                  isPreview={false}
                />
              )}
              {/* Footer controls */}
              <Box
                sx={{
                  p: 3,
                  display: 'flex',
                  width: '1000px',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                  alignContent: 'center'
                }}
              >
                <IconButton
                  disabled={currentSlideIndex === 0}
                  onClick={() => setCurrentSlideIndex(currentSlideIndex - 1)}
                  sx={{fontSize: '2rem'}}
                >
                  <ArrowBack fontSize="inherit" />
                </IconButton>

                <Button
                  variant="contained"
                  color="success"
                  onClick={() => createNewSlide()}
                >
                  New Slide
                </Button>
                <IconButton
                  disabled={presentation && currentSlideIndex === presentation.slides.length - 1}
                  onClick={() => setCurrentSlideIndex(currentSlideIndex + 1)}
                  sx={{fontSize: '2rem'}}
                >
                  <ArrowForward fontSize="inherit" />
                </IconButton>
              </Box>
              {/* Sub-footer controls */}
              <Box
                sx={{
                  p: 3,
                  display: 'flex',
                  width: '1000px',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'right',
                  alignContent: 'center'
                }}
              >
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => deleteSlide()}
                >
                  Delete Slide
                </Button>
              </Box>
            </Box>
          }
        />
        <Route path="rearrange" element={<SlidesRearrange />} />
      </Routes>
    </PresentationContext.Provider>
  );

}

export default Presentation;