import { Box } from '@mui/material';
import '@fontsource/open-sans';
import '@fontsource/poppins';

const TextElement = (
  { 
    element, 
    handleDoubleClick, 
    handleClick, 
    handleDelete,
    handleBlur, 
    presentation 
  }) => {
  return (
    <Box
      onDoubleClick={handleDoubleClick}
      tabIndex={-1}
      onClick={handleClick}
      onBlur={handleBlur}
      onContextMenu={handleDelete}
      sx={{
        color: element.color,
        fontSize: `${element.fontSize}em`,
        width: '100%',
        height: '100%',
        textAlign: 'left',
        overflow: 'hidden',
        padding: 1,
        fontFamily: `${presentation.fontFamily}`,
      }}
    >
      {element.content}
    </Box>
  );
}

export default TextElement;