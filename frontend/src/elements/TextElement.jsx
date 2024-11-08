import { Box } from '@mui/material';

function TextElement({element, doubleClickFunc}) {
  return (
    <>
      <Box
        onDoubleClick={() => doubleClickFunc(element)}
        sx={{
          position: 'absolute',
          top: `${element.position.y}%`,
          left: `${element.position.x}%`,
          width: `${element.width}%`,
          height: `${element.height}%`,
          color: element.color,
          fontSize: `${element.fontSize}em`,
          border: '1px solid grey',
          padding: 1,
          overflow: 'hidden',
          textAlign: 'left',
        }}
      >
        {element.content}
      </Box>
    </>
  );
}


export default TextElement;