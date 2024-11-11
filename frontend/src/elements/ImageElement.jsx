import { Box } from '@mui/material';

function ImageElement({ element, doubleClickFunc, handleClick, handleBlur, onOpenDeleteModal }) {
  return (
    <>
      <Box
        tabIndex={-1}
        onClick={handleClick}
        onBlur={handleBlur}
        onDragStart={(e) => e.preventDefault()}
        onDoubleClick={() => doubleClickFunc(element)}
        onContextMenu={(event) => {
          event.preventDefault();
          onOpenDeleteModal();
        }}
        sx={{
          width: '100%',
          height: '100%',
        }}
      >
        <Box
          component="img"
          sx={{
            width: '100%',
            height: '100%',
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
