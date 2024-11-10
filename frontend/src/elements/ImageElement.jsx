import { Box } from '@mui/material';

function ImageElement({ element, doubleClickFunc, handleClick, handleBlur }) {
  return (
    <Box
      component="img"
      tabIndex={-1}
      onClick={handleClick}
      onBlur={handleBlur}
      onDragStart={(e) => e.preventDefault()}
      onDoubleClick={() => doubleClickFunc(element)}
      sx={{
        width: '100%',
        height: '100%',
      }}
      alt={element.altText}
      src={element.url}
    >
    </Box>
  );
}

export default ImageElement;
