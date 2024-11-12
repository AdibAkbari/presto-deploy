import { Box } from '@mui/material';
import { useEffect } from 'react';
import ReactPlayer from 'react-player/lazy';
import { useState } from 'react';

function VideoElement({ element, doubleClickFunc, handleClick, handleBlur, onOpenDeleteModal, isPreview }) {
  const [resize, setResize] = useState(false);

  const handleDoubleClick = () => {
    if (!isPreview) {
      doubleClickFunc(element);
    }
  };

  const handleDelete = (event) => {
    if (!isPreview) {
      event.preventDefault();
      onOpenDeleteModal();
    }
  };

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
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleDelete}
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