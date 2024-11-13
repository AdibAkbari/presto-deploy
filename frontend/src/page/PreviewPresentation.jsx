import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import BACKEND_PORT from '../../backend.config.json';
import { Box, Typography } from '@mui/material';
import Slide from '../component/Slide';

function PreviewPresentation({ token }) {
  const { presentationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [presentation, setPresentation] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isSlideInitialized, setIsSlideInitialized] = useState(false);

  // tries to parse slide number from url
  useEffect(() => {
    if (!isSlideInitialized) {
      const searchParams = new URLSearchParams(location.search);
      const slideParam = searchParams.get('slide');
      if (slideParam) {
        const slideNumber = parseInt(slideParam, 10) - 1; // slide numbers start from 1
        if (!isNaN(slideNumber)) {
          setCurrentSlideIndex(slideNumber);
        }
      }
      setIsSlideInitialized(true);
    }
  }, [location.search, isSlideInitialized]);

  // updates URL when currentSlideIndex changes
  useEffect(() => {
    if (isSlideInitialized) {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('slide', currentSlideIndex + 1);
      navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    }
  }, [currentSlideIndex, location.pathname, navigate, isSlideInitialized]);
  
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


  useEffect(() => {
    if (token) {
      axios
        .get(`http://localhost:${BACKEND_PORT.BACKEND_PORT}/store`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const presentations = response.data.store || [];
          const currentPresentation = presentations.find(
            (p) => p.presentationId === presentationId
          );
          setPresentation(currentPresentation || null);
        })
        .catch((error) => console.error('Error loading presentation:', error));
    }
  }, [token, presentationId]);

  if (!presentation) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {presentation.slides && presentation.slides.length > 0 && (
        <Slide
          slide={presentation.slides[currentSlideIndex]}
          slideIndex={currentSlideIndex}
          isPreview={true}
        />
      )}
    </Box>
  );

}

export default PreviewPresentation;
