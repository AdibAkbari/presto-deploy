import { useNavigate, useParams, useLocation, Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import BACKEND_PORT from "../../backend.config.json";
import { Box, Typography, AppBar, Container, Toolbar, IconButton, Menu, MenuItem, Button, Tooltip, Avatar, Divider } from "@mui/material";
import { ArrowBack, ArrowForward, Delete } from "@mui/icons-material";
import PopupModal from "../component/PopupModal";
import Slide from "../component/Slide";
import EditIcon from "@mui/icons-material/Edit";
import NewElement from "../component/NewElement";
import SlidesRearrange from "./SlidesRearrange";
import PresentationContext from "../PresentationContext";
import FontFamilyModal from "../component/FontFamilyModal";
import FontIcon from "@mui/icons-material/TextFields";
import ThemeModal from "../component/ThemeModal";
import MenuIcon from "@mui/icons-material/Menu";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ColorLensIcon from "@mui/icons-material/ColorLens";

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
      const slideParam = searchParams.get("slide");
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
      searchParams.set("slide", currentSlideIndex + 1);
      navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    }
  }, [currentSlideIndex, location.pathname, navigate, isSlideInitialized]);
  
  // updates element of current slide in presentation
  const updateElement = (updatedElement) => {
    console.log("updating element", updatedElement);
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
        backgroundColor: "none",
        backgroundImage: ""
      }
      const updatedPresentation = { ...presentation, slides: [...presentation.slides, newSlide] };
      setPresentation(updatedPresentation);
      savePresentationsToStore(
        presentations.map(p => p.presentationId === presentationId ? updatedPresentation : p)
      );
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
        // If deleting the last slide, move to the new last slide
        if (currentSlideIndex >= updatedSlides.length) {
          setCurrentSlideIndex(updatedSlides.length - 1);
        }
        else if (currentSlideIndex === 0 && updatedSlides.length > 0) {
          setCurrentSlideIndex(0); // Stay on the first slide if it’s the first
        }
        // If there are slides left, go to the previous index
        else {
          setCurrentSlideIndex(currentSlideIndex - 1);
        }
  
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
      // only allows slide change when not typing in an input field
      const activeElement = document.activeElement;
      const isInputField =
        activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        activeElement.isContentEditable;

      if (!isInputField) {
        if (event.key === "ArrowLeft" && currentSlideIndex > 0) {
          setCurrentSlideIndex(currentSlideIndex - 1);
        } else if (event.key === "ArrowRight" && currentSlideIndex < presentation.slides.length - 1) {
          setCurrentSlideIndex(currentSlideIndex + 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlideIndex, presentation?.slides?.length]);

  const handlePreview = () => {
    window.open(`/preview/${presentationId}`, "_blank");
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
        navigate("/dashboard");
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

  const updateTheme = (themeObject) => {
    console.log("updating theme", themeObject);
    const { themeScope, backgroundType, solidColor, gradient, imageUrl } = themeObject;

    if (themeScope === "presentation") {
      const updatedPresentation = { ...presentation };
      if (backgroundType === "solid") {
        updatedPresentation.backgroundColor = solidColor;
        updatedPresentation.backgroundImage = "";
      } else if (backgroundType === "gradient") {
        updatedPresentation.backgroundColor = gradient;
        updatedPresentation.backgroundImage = "none";
      } else { // image
        updatedPresentation.backgroundImage = imageUrl;
        updatedPresentation.backgroundColor = "none";
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
      if (backgroundType === "solid") {
        currentSlide.backgroundColor = solidColor;
        currentSlide.backgroundImage = "none";
      } else if (backgroundType === "gradient") {
        currentSlide.backgroundColor = gradient;
        currentSlide.backgroundImage = "none";
      } else { // image
        currentSlide.backgroundImage = imageUrl;
        currentSlide.backgroundColor = "none";
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
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <AppBar position="static" color="#ffffff">
                <Container maxWidth="xl">
                  <Toolbar disableGutters>
                    <Box sx={{
                    display: { xxs: "flex", md: "none" },
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%"}}>
                      {/* Mobile menu icon */}  
                      <IconButton
                        size="large"
                        aria-label="app menu"
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
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu}
                      >
                        <MenuItem
                          sx={{
                            display: {xxs: "flex", sm: "none"}
                          }}
                        >
                          <NewElement
                            presentation={presentation}
                            setPresentation={setPresentation}
                            currentSlideIndex={currentSlideIndex}
                            savePresentationsToStore={savePresentationsToStore}
                            presentations={presentations}
                            inMenu={true}
                          />
                        </MenuItem>
                        <MenuItem 
                          onClick={() => {
                            setIsFontFamilyModalOpen(true);
                            handleCloseNavMenu();
                          }}
                        >
                          <Button startIcon={<FontIcon />} color="secondary">Font Family</Button>
                        </MenuItem>
                        <MenuItem 
                        onClick={() => {
                          createNewSlide();
                          handleCloseNavMenu();
                        }}
                          sx={{
                            display: {xxs: "flex", sm: "none"}
                          }}
                        >
                          <Button startIcon={<AddBoxIcon />} color="secondary">New Slide</Button>
                        </MenuItem>
                        <MenuItem 
                          onClick={() => {
                            setIsRearranging(true);
                            navigate("rearrange");
                            handleCloseNavMenu();
                          }}
                          sx={{
                            display: {xxs: "flex", sm: "none"}
                          }}
                        >
                          <Button startIcon={<LowPriorityIcon />} color="secondary">Rearrange Slides</Button>
                        </MenuItem>
                        <MenuItem 
                          onClick={() => {
                            handlePreview();
                            handleCloseNavMenu();
                          }}
                          sx={{
                            display: {xxs: "flex", sm: "none"}
                          }}
                        >
                          <Button startIcon={<SlideshowIcon />} color="secondary">Preview</Button>
                        </MenuItem>
                        <MenuItem onClick={() => {
                          setIsThemeModalOpen(true);
                          handleCloseNavMenu();
                        }}>
                          <Button startIcon={<ColorLensIcon />} color="secondary">Theme</Button>
                        </MenuItem>
                        <MenuItem onClick={() => {
                          setIsUpdateThumbnailOpen(true)
                          handleCloseNavMenu()
                        }}>
                          <Button startIcon={<InsertPhotoIcon />} color="secondary">Update Thumbnail</Button>
                        </MenuItem>
                        <MenuItem 
                          onClick={() => {
                            deleteSlide();
                            handleCloseNavMenu();
                          }}
                          sx={{
                            display: {xxs: "flex", sm: "none"}
                          }}
                        >
                          <Button startIcon={<DeleteIcon />} color="error">Delete Slide</Button>
                        </MenuItem>
                      </Menu>
                      <Box
                      sx={{
                        my: 2,
                        display: {xxs: "none", sm: "flex", md: "none"}
                      }}>
                        <NewElement
                          presentation={presentation}
                          setPresentation={setPresentation}
                          currentSlideIndex={currentSlideIndex}
                          savePresentationsToStore={savePresentationsToStore}
                          presentations={presentations}
                          inMenu={false}
                        />
                      </Box>
                      <Button
                        onClick={() => createNewSlide()}
                        variant="text"
                        endIcon={<AddBoxIcon/>}
                        color="secondary"
                        sx={{ my: 2, display: {xxs: "none", sm: "flex", md: "none"} }}
                      >
                      New Slide
                      </Button>
                      <Button
                        onClick={handlePreview}
                        variant="text"
                        endIcon={<SlideshowIcon/>}
                        color="secondary"
                        sx={{ my: 2, display: {xxs: "none", sm: "flex", md: "none"} }}
                      >
                        Preview
                      </Button>
                      <Button
                        variant="text"
                        onClick={() => deleteSlide()}
                        endIcon={<DeleteIcon/>}
                        sx={{ my: 2, display: {xxs: "none", sm: "flex", md: "none"} }}
                        color="error"
                      >
                        Delete Slide
                      </Button>
                      <Button
                        variant="text"
                        onClick={() => setIsDeleteModalOpen(true)}
                        endIcon={<DeleteForeverIcon/>}
                        color="error"
                        sx={{ my: 2, display: {xs: "flex", sm: "none"}}}
                      >
                        Delete Presentation
                      </Button>
                    </Box>
                    {/* The buttons of the app bar. */}
                    <Box sx={{ flexGrow: 1, display: {xxs: "none", md: "flex" }, justifyContent: "space-evenly" }}>
                      <NewElement
                        presentation={presentation}
                        setPresentation={setPresentation}
                        currentSlideIndex={currentSlideIndex}
                        savePresentationsToStore={savePresentationsToStore}
                        presentations={presentations}
                        inMenu={false}
                      />
                      <Tooltip title="Change the font family of the entire presentaiton" placement="bottom">
                        <Button
                          key={"update-font-family"}
                          onClick={() => setIsFontFamilyModalOpen(true)}
                          variant="text"
                          endIcon={<FontIcon/>}
                          color="secondary"
                          sx={{ my: 2 }}
                        >
                          Font Family
                        </Button>
                      </Tooltip>
                      <Button
                        onClick={() => createNewSlide()}
                        variant="text"
                        endIcon={<AddBoxIcon/>}
                        color="secondary"
                        sx={{ my: 2 }}
                      >
                      New Slide
                      </Button>
                      <Button
                        onClick={() => {
                          setIsRearranging(true)
                          navigate("rearrange")
                        }}
                        variant="text"
                        endIcon={<LowPriorityIcon/>}
                        color="secondary"
                        sx={{ my: 2 }}
                      >
                      Rearrange Slides
                      </Button>
                      <Button
                        onClick={handlePreview}
                        variant="text"
                        endIcon={<SlideshowIcon/>}
                        color="secondary"
                        sx={{ my: 2 }}
                      >
                        Preview
                      </Button>
                      <Button
                        variant="text"
                        onClick={() => setIsThemeModalOpen(true)}
                        endIcon={<ColorLensIcon/>}
                        color="secondary"
                        sx={{my: 2}}
                      >
                      Theme
                      </Button>
                      <Button
                          onClick={() => setIsEditModalOpen(true)}
                          variant="text"
                          endIcon={<InsertPhotoIcon/>}
                          color="secondary"
                          sx={{ my: 2 }}
                        >
                        Update Thumbnail
                      </Button>
                      <Button
                        variant="text"
                        onClick={() => deleteSlide()}
                        endIcon={<DeleteIcon/>}
                        sx={{ my: 2 }}
                        color="error"
                      >
                        Delete Slide
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
                updateTheme={updateTheme}
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  px: "12px"
                }}>
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => navigate("/dashboard")}
                  startIcon={<ArrowBack/>}
                  sx={{ my: 2 }}
                >
                  Back
                </Button>
                <Box
                  sx={{
                    width: "30%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="h5"
                    align="center"
                    sx={{
                      textAlign: "center",
                    }}
                    overflow="auto"
                    whiteSpace="nowrap"
                  >
                    {presentation ? presentation.title : "Loading..."}
                  </Typography>
                  <IconButton
                    key={"edit-title"}
                    onClick={() => setIsEditModalOpen(true)}
                    variant="text"
                    color="secondary"
                    sx={{ my: 2 }}
                  >
                    {<EditIcon/>}
                  </IconButton>
                </Box>
                <Button
                  variant="text"
                  onClick={() => setIsDeleteModalOpen(true)}
                  endIcon={<DeleteForeverIcon/>}
                  color="error"
                  sx={{ my: 2, display: {xxs: "none", sm: "flex"}}}
                >
                  Delete Presentation
                </Button>
              </Box>
              {/* Box for slide and slide navigation buttons */}
              <Box sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-evenly",
                alignContent: "center",
                alignItems: "center"
              }}>
                <IconButton
                  disabled={presentation && currentSlideIndex === 0}
                  onClick={() => setCurrentSlideIndex(currentSlideIndex - 1)}
                  sx={{
                    fontSize: "2rem",
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
                  sx={{fontSize: "2rem"}}
                >
                  <ArrowForward fontSize="inherit" />
                </IconButton>
              </Box>
              {/* Footer controls */}
              <Box
                sx={{
                  p: 3,
                  display: "flex",
                  width: "1000px",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  alignContent: "center"
                }}
              >
              </Box>
              {/* Sub-footer controls */}
              <Box
                sx={{
                  p: 3,
                  display: "flex",
                  width: "1000px",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  alignContent: "center"
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



