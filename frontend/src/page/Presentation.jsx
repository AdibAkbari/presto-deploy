import { useNavigate, useParams, useLocation, Routes, Route } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BACKEND_PORT from '../../backend.config.json';
import { Box, Typography, AppBar, Container, Toolbar, IconButton, Menu, MenuItem, Button, Tooltip, Avatar } from '@mui/material';
import { ArrowBack, ArrowForward, Delete } from '@mui/icons-material';
import PopupModal from '../component/PopupModal';
import Slide from '../component/Slide';
import EditIcon from '@mui/icons-material/Edit';
import NewElement from '../component/NewElement';
import SlidesRearrange from './SlidesRearrange';
import PresentationContext from '../PresentationContext';
import FontFamilyModal from '../component/FontFamilyModal';
import FontIcon from '@mui/icons-material/TextFields';
import ThemeModal from '../component/ThemeModal';
import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/menu';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

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
  const [isFontFamilyModalOpen, setIsFontFamilyModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
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
        slideId: `slide_${Date.now()}`,
        elements: [],
        backgroundImage: 'none',
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
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
  // Function to change the font family of the entire presentation.
  const updateFont = (newFont) => {
    const updatedPresentation = {...presentation, fontFamily: `${newFont}`};
    setPresentation(updatedPresentation);
    savePresentationsToStore(
      presentations.map((p) =>
        p.presentationId === updatedPresentation.presentationId ? updatedPresentation : p
      )
    );
  };

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

  const updateSlideTheme = (themeObject) => {
    console.log('updating theme', themeObject);
    const { themeScope, backgroundType, solidColor, gradient, imageUrl } = themeObject;

    if (themeScope === 'presentation') {
      const updatedPresentation = { ...presentation };
      if (backgroundType === 'solid') {
        updatedPresentation.backgroundColor = solidColor;
        updatedPresentation.backgroundImage = '';
      } else if (backgroundType === 'gradient') {
        updatedPresentation.backgroundColor = gradient;
        updatedPresentation.backgroundImage = 'none';
      } else { // image
        updatedPresentation.backgroundImage = imageUrl;
        updatedPresentation.backgroundColor = 'none';
      }
      setPresentation(updatedPresentation);
      savePresentationsToStore(
        presentations.map((p) =>
          p.presentationId === updatedPresentation.presentationId ? updatedPresentation : p
        )
      );
    }
    else { // current slide
      const updatedSlides = [...presentation.slides];
      const currentSlide = { ...updatedSlides[currentSlideIndex] };
      if (backgroundType === 'solid') {
        currentSlide.backgroundColor = solidColor;
        currentSlide.backgroundImage = 'none';
      } else if (backgroundType === 'gradient') {
        currentSlide.backgroundColor = gradient;
        currentSlide.backgroundImage = 'none';
      } else { // image
        currentSlide.backgroundImage = imageUrl;
        currentSlide.backgroundColor = 'none';
      }
      updatedSlides[currentSlideIndex] = currentSlide;
      const updatedPresentation = { ...presentation, slides: updatedSlides };
      setPresentation(updatedPresentation);
      savePresentationsToStore(
        presentations.map((p) =>
          p.presentationId === updatedPresentation.presentationId ? updatedPresentation : p
        )
      );
    }
  };


  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <PresentationContext.Provider value={contextValue}>
      <Routes>
        <Route
          path="/"
          element={
            <Box
              sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              {/* Bar with back button, presentation title and delete presentation button*/}
              <AppBar position="static" sx={{display: 'flex', alignItems: 'center', gap: '8px'}} color="#ffffff">
                <Container maxWidth="xl">
                  <Toolbar disableGutters>
                 <Box sx={{maxWidth: '15%', overflow: 'scroll'}}>
                  <Typography
                      variant="h4"
                      align="center"
                      sx={{
                        textAlign: 'center'
                      }}
                    >
                      {presentation ? presentation.title : 'Loading...'}
                  </Typography>
                  <IconButton
                      key={"edit-title"}
                      onClick={() => setIsEditModalOpen(true)}
                      variant="text"
                      sx={{ my: 2, color: 'black' }}
                    >
                      {<EditIcon/>}
                  </IconButton>
                 </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                      {/* Puts all the buttons in a menu when the screen size gets small. */}
                      <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        color="inherit"
                      >
                        <MenuIcon />
                      </IconButton>
                      <Menu
                        id="menu-appbar"
                        anchorEl={anchorElNav}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
                        }}
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu}
                        sx={{ display: { xs: 'block', md: 'none' } }}
                      >
                        {/* {pages.map((page) => (
                          <MenuItem key={page} onClick={handleCloseNavMenu}>
                            <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                          </MenuItem>
                        ))} */}
                      </Menu>
                    </Box>
                    {/* The buttons of the app bar. */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    <Button
                      onClick={() => setIsEditModalOpen(true)}
                      variant="text"
                      endIcon={<InsertPhotoIcon/>}
                      sx={{ my: 2, color: 'black' }}
                    >
                      Update Thumbnail
                    </Button>
                    <Button
                      key={"update-font-family"}
                      onClick={() => setIsFontFamilyModalOpen(true)}
                      variant="text"
                      endIcon={<FontIcon/>}
                      sx={{ my: 2, color: 'black' }}
                    >
                      Font Family
                    </Button>
                    <Button
                      onClick={() => createNewSlide()}
                      variant="text"
                      endIcon={<AddBoxIcon/>}
                      sx={{ my: 2, color: 'black' }}
                    >
                      New Slide
                    </Button>
                    <Button
                      onClick={handlePreview}
                      variant="text"
                      endIcon={<SlideshowIcon/>}
                      sx={{ my: 2, color: 'black' }}
                    >
                      Preview
                    </Button>
                    <NewElement
                      presentation={presentation}
                      setPresentation={setPresentation}
                      currentSlideIndex={currentSlideIndex}
                      savePresentationsToStore={savePresentationsToStore}
                      presentations={presentations}
                    />
                    <Button
                      onClick={() => {
                        setIsRearranging(true)
                        navigate('rearrange')
                      }}
                      variant="text"
                      endIcon={<LowPriorityIcon/>}
                      sx={{ my: 2, color: 'black' }}
                    >
                      Rearrange Slides
                    </Button>
                    <Button
                      variant="text"
                      onClick={() => deleteSlide()}
                      endIcon={<DeleteIcon/>}
                      sx={{ my: 2, color: 'black' }}
                    >
                      Delete Slide
                    </Button>
                    <Button
                      variant="text"
                      onClick={() => setIsDeleteModalOpen(true)}
                      endIcon={<DeleteForeverIcon/>}
                      sx={{ my: 2, color: 'black' }}
                    >
                      Delete Presentation
                    </Button>
                    <Button
                      variant="text"
                      onClick={() => setIsThemeModalOpen(true)}
                      sx={{my: 2, color: 'black'}}
                    >
                      Theme
                    </Button>
                    </Box>
                  </Toolbar>
                </Container>
              </AppBar>

              {/* Modals */}
              {/* Edit presentation title modal */}
              <PopupModal
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                instruction="Enter a new title for your presentation"
                nameOfInput="New Title"
                onSubmit={editPresentationTitle}
                confirmMsg={"Edit"}
              />
              {/* Update presentation thumbnail modal */}
              <PopupModal
                open={isUpdateThumbnailOpen}
                onClose={() => setIsUpdateThumbnailOpen(false)}
                instruction="Put the URL of the image"
                nameOfInput="Thumbnail"
                onSubmit={updateThumbnail}
                confirmMsg={"Update"}
              />
              <FontFamilyModal
                open={isFontFamilyModalOpen}
                onClose={() => setIsFontFamilyModalOpen(false)}
                instruction="Select the font family for all textboxes"
                onSubmit={updateFont}
                confirmMsg={"Update"}
              />
		          <ThemeModal
                  open={isThemeModalOpen}
                  onClose={() => setIsThemeModalOpen(false)}
                  onSubmit={updateSlideTheme}
                  presentation={presentation}
                >
                </ThemeModal>
              {/* Delete confirmation modal */}
              <PopupModal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                instruction="Are you sure you want to delete this presentation?"
                onSubmit={handleDelete}
                confirmMsg="Yes"
                cancelMsg="No"
              />
              {/* Box for title, edit title button, back button and delete presentation button */}
              {/* Box for slide and slide navigation buttons */}
              <Box sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-evenly',
                alignContent: 'center'
              }}>
                <IconButton
                  disabled={presentation && currentSlideIndex === 1}
                  onClick={() => setCurrentSlideIndex(currentSlideIndex - 1)}
                  sx={{
                    fontSize: '2rem',
                  }}
                >
                  <ArrowBack fontSize="inherit" />
                </IconButton>
                {/* Displaying first slide */}
                {presentation && presentation.slides && presentation.slides.length > 0 && (
                    <Slide
                      slide={presentation.slides[currentSlideIndex]} 
                      slideIndex={currentSlideIndex} 
                      onUpdateElement={updateElement}
                      deleteElement={deleteElement}
                      isPreview={false}
                      presentation={presentation}
                    />
                )}
                <IconButton
                    disabled={presentation && currentSlideIndex === presentation.slides.length - 1}
                    onClick={() => setCurrentSlideIndex(currentSlideIndex + 1)}
                    sx={{fontSize: '2rem'}}
                  >
                    <ArrowForward fontSize="inherit" />
                </IconButton> 
              </Box>
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
              </Box>
              {/* Sub-footer controls */}
              <Box
                sx={{
                  p: 3,
                  display: 'flex',
                  width: '1000px',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  alignContent: 'center'
                }}
              >
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



