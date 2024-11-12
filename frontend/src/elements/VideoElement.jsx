import { Box } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import ReactPlayer from 'react-player/lazy';
import { useState } from 'react';

function VideoElement({ element, doubleClickFunc, handleClick, handleBlur }) {
  const [resize, setResize] = useState(false);
  const boxRef = useRef(null);
  const borderWidth = 12; // Define the border width

  const handleVideoClick = (event) => {
    if (boxRef.current) {
      const rect = boxRef.current.getBoundingClientRect();

      // Check if the click is within the border area
      if (
        event.clientX < rect.left + borderWidth || 
        event.clientX > rect.right - borderWidth || 
        event.clientY < rect.top + borderWidth || 
        event.clientY > rect.bottom - borderWidth
      ) {
        alert("Border clicked!");
      } else {
        alert("Inside area clicked!");
      }
    }
  };

  const elementAutoPlay = {element};

  useEffect(() => {
    if (resize) {
      handleClick();
    } else {
      handleBlur();
    }
  }, [resize]);
  return (
    <Box
      ref={boxRef}
      tabIndex={-1}
      onClick={handleVideoClick}
      onBlur={handleBlur}
      onDoubleClick={() => doubleClickFunc(element)}
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative'
      }}
    >
      <ReactPlayer
        url={element.url}
        width='100%'
        height='100%'
        playing={element.autoPlay}
        muted={element.autoPlay}
        controls={element.autoPlay}
        onPause={() => setResize(false)}
        onPlay={() => setResize(true)}
        // According to the documentation this positioning allows for a responsive
        // video player.
        sx={{
          position: 'absolute',
          top: 0,
          left: 0
        }}
      />
    </Box>
  );
}

export default VideoElement;