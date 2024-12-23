import { Box } from '@mui/material';

const ImageElement = (
  { 
    element, 
    handleDoubleClick, 
    handleClick, 
    handleBlur, 
    handleDelete 
  }) => {
  return (
    <>
      <Box
        tabIndex={-1}
        onClick={handleClick}
        onBlur={handleBlur}
        onDragStart={(e) => e.preventDefault()}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleDelete}
        sx={{
          width: '100%',
          height: '100%'
        }}
      >
        <Box
          component="img"
          sx={{
            width: '100%',
            height: '100%'
          }}
          alt={element.altText}
          src={element.url}
        >
        </Box>
      </Box>
    </>
  );
}

export default ImageElement;
