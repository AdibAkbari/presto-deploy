import { Box } from '@mui/material';
import ReactPlayer from 'react-player/lazy';

const VideoElement = (
  {
    element, 
    handleDoubleClick, 
    handleClick, 
    handleBlur, 
    handleDelete 
  }) => {
  return (
    <Box
      tabIndex={-1}
      onClick={handleClick}
      onBlur={handleBlur}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleDelete}
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        border: '10px solid #3b3b3b',
        boxSizing: 'border-box'
      }}
    >
      <ReactPlayer
        url={element.url}
        width='100%'
        height='100%'
        playing={element.autoPlay}
        muted={element.autoPlay}
        controls={true}
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