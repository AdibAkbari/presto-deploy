import { Box } from '@mui/material';
import { useEffect } from 'react';
import ReactPlayer from 'react-player/lazy';
import { useState } from 'react';

function VideoElement({ element, doubleClickFunc, handleClick, handleBlur, onOpenDeleteModal }) {
  const [resize, setResize] = useState(false);

  useEffect(() => {
    if (resize) {
      handleClick();
    } else {
      handleBlur();
    }
  }, [resize]);

  return (
    <Box
      tabIndex={-1}
      onClick={handleClick}
      onBlur={handleBlur}
      onDoubleClick={() => doubleClickFunc(element)}
      onContextMenu={(event) => {
        event.preventDefault();
        onOpenDeleteModal();
      }}
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