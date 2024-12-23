import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Box, Typography, IconButton } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

import Slide from '../component/Slide';
import usePresentation from '../helpers/UsePresentation';

const PreviewPresentation = ({ token }) => {
  const { presentationId } = useParams();
  const { presentation } = usePresentation(token, presentationId);
  const location = useLocation();
  const navigate = useNavigate();
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

  if (!presentation) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      {/* Slide box */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {presentation.slides && presentation.slides.length > 0 && (
          <Slide
            presentation={presentation}
            slideIndex={currentSlideIndex}
            isPreview={true} // set to true so slide is bigger for preview 
          />
        )}
      </Box>

      {/* Left and right slide buttons */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 2,
          gap: '5%'
        }}
      >
        <IconButton
          disabled={currentSlideIndex === 0}
          onClick={() => setCurrentSlideIndex(currentSlideIndex - 1)}
          sx={{fontSize: '2rem'}}
        >
          <ArrowBack fontSize="inherit" />
        </IconButton>
        <IconButton
          disabled={presentation && currentSlideIndex === presentation.slides.length - 1}
          onClick={() => setCurrentSlideIndex(currentSlideIndex + 1)}
          sx={{fontSize: '2rem'}}
        >
          <ArrowForward fontSize="inherit" />
        </IconButton>
      </Box>
    </>
  );

}

export default PreviewPresentation;
