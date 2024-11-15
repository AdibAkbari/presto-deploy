import { 
  useNavigate, 
  useParams, 
  useLocation, 
  Routes, 
  Route 
} from "react-router-dom";

import { useEffect, useState } from "react";

import {
  Box, 
  Typography, 
  IconButton, 
  Button, 
  Tooltip 
} from "@mui/material";

import { 
  ArrowBack, 
  ArrowForward, 
  Edit as EditIcon, 
  DeleteForever as DeleteForeverIcon, 
} from "@mui/icons-material";

import { updateStore } from "../helpers/ApiDatastore";
import usePresentation from '../helpers/UsePresentation';
import PopupModal from "../component/PopupModal";
import Slide from "../component/Slide";
import ToolsBar from "../component/ToolsBar";
import SlidesRearrange from "./SlidesRearrange";
import FontFamilyModal from "../component/FontFamilyModal";
import ThemeModal from "../component/ThemeModal";
import PresentationContext from "../PresentationContext";

function Presentation({ token }) {

  const { presentationId } = useParams();
  const { presentation, setPresentation, presentations, savePresentationsToStore } = usePresentation(token, presentationId);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Controls the Edit PopupModal
  const [isUpdateThumbnailOpen, setIsUpdateThumbnailOpen] = useState(false); // Controls the Update Thumbnail PopupModal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Controls the Delete Thumbnail PopupModal
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isSlideInitialized, setIsSlideInitialized] = useState(false);
  const [isRearranging, setIsRearranging] = useState(false);
  const [isFontFamilyModalOpen, setIsFontFamilyModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorElNav, setAnchorElNav] = useState(null);

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

  const handleDelete = () => {
    updateStore(token, presentations.filter(p => p.presentationId !== presentationId))
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

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
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
              <ToolsBar
                handleOpenNavMenu={handleOpenNavMenu}
                anchorElNav={anchorElNav}
                handleCloseNavMenu={handleCloseNavMenu}
                setIsFontFamilyModalOpen={setIsFontFamilyModalOpen}
                createNewSlide={createNewSlide}
                setIsRearranging={setIsRearranging}
                navigate={navigate}
                handlePreview={handlePreview}
                setIsThemeModalOpen={setIsThemeModalOpen}
                setIsUpdateThumbnailOpen={setIsUpdateThumbnailOpen}
                deleteSlide={deleteSlide}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
                setIsEditModalOpen={setIsEditModalOpen}
                presentation={presentation}
                setPresentation={setPresentation}
                currentSlideIndex={currentSlideIndex}
                savePresentationsToStore={savePresentationsToStore}
                presentations={presentations}
              />

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
                  px: "12px",
                  my: 1
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
                  <Tooltip title={presentation?.title || "Loading..."} arrow>
                    <Typography
                      variant="h5"
                      align="center"
                      sx={{
                        textAlign: "center",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {presentation ? presentation.title : "Loading..."}
                    </Typography>
                  </Tooltip>
                  <Tooltip title="Edit the title of the presentation." placement="right">
                    <IconButton
                      key={"edit-title"}
                      onClick={() => setIsEditModalOpen(true)}
                      variant="text"
                      color="secondary"
                    >
                      {<EditIcon/>}
                    </IconButton>
                  </Tooltip>
                </Box>
                <Tooltip title="Delete this presentation and return to the dashboard." placement="bottom">
                  <Button
                    variant="text"
                    onClick={() => setIsDeleteModalOpen(true)}
                    endIcon={<DeleteForeverIcon/>}
                    color="error"
                    sx={{ my: 2, display: {xxs: "none", sm: "flex"}}}
                  >
                    Delete Presentation
                  </Button>
                </Tooltip>
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
                    display: {xxs: "none", xs: "flex"}
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
                  sx={{
                    fontSize: "2rem",
                    display: {xxs: "none", xs: "flex"}
                  }}
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
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "space-around",
                  alignContent: "center"
                }}
              >
                <IconButton
                  disabled={presentation && currentSlideIndex === 0}
                  onClick={() => setCurrentSlideIndex(currentSlideIndex - 1)}
                  sx={{
                    fontSize: "2rem",
                    display: {xxs: "flex", xs: "none"}
                  }}
                >
                  <ArrowBack fontSize="inherit" />
                </IconButton>
                <IconButton
                  disabled={presentation && currentSlideIndex === presentation.slides.length - 1}
                  onClick={() => setCurrentSlideIndex(currentSlideIndex + 1)}
                  sx={{
                    fontSize: "2rem",
                    display: {xxs: "flex", xs: "none"}
                  }}
                >
                  <ArrowForward fontSize="inherit" />
                </IconButton>
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

