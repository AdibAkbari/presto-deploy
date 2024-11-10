import { Box } from '@mui/material';

function TextElement({ element, doubleClickFunc, handleClick, handleBlur }) {
  return (
    <Box
      onDoubleClick={() => doubleClickFunc(element)} 
      tabIndex={-1} 
      onClick={handleClick} 
      onBlur={handleBlur}
      sx={{
        color: element.color,
        fontSize: `${element.fontSize}em`,
        width: '100%',
        height: '100%',
        textAlign: 'left',
        overflow: 'hidden',
        padding: 1,
      }}
    >
      {element.content}
    </Box>
  );
}

export default TextElement;
