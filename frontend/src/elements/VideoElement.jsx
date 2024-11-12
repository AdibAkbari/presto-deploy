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
      tabIndex={-1}
      onClick={handleClick}
      onBlur={handleBlur}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleDelete}
      sx={{
        width: '100%',
        height: '100%'
      }}
    >
      <ReactPlayer
        url={element.url}
        width='100%'
        height='100%'
        autoPlay={element.autoplay}
        muted={element.autoplay}
        onPause={() => setResize(!resize)}
        onPlay={() => setResize(!resize)}
      />
    </Box>
  );
}

export default VideoElement;