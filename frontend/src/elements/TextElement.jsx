import { Box } from '@mui/material';
import { Rnd } from 'react-rnd';
import { useState, useEffect } from 'react';

function TextElement({ element, doubleClickFunc, onUpdateElement, parentWidth, parentHeight }) {
  const [position, setPosition] = useState(element.position);
  const [size, setSize] = useState({ width: element.width, height: element.height });

  useEffect(() => {
    setPosition(element.position);
    setSize({ width: element.width, height: element.height });
  }, [element]);

  const handleDragStop = (e, data) => {
    const updatedPosition = {
      x: (data.x / parentWidth) * 100,
      y: (data.y / parentHeight) * 100
    };

    setPosition(updatedPosition);
    onUpdateElement({ ...element, position: {...updatedPosition} });
  };

  const handleResizeStop = (e, direction, ref, delta, newPosition) => {
    
    const updatedSize = {
      width: (ref.offsetWidth / parentWidth) * 100,
      height: (ref.offsetHeight / parentHeight) * 100,
    };

    const updatedPosition = {
      x: (newPosition.x / parentWidth) * 100,
      y: (newPosition.y / parentHeight) * 100,
    };

    setSize(updatedSize);
    setPosition(updatedPosition);

    onUpdateElement({
      ...element,
      width: updatedSize.width,
      height: updatedSize.height,
      position: updatedPosition,
    });
  };


  return (
    <Rnd
      size={{
        width: `${size.width}%`,
        height: `${size.height}%`,
      }}
      position={{ 
        x: (position.x * parentWidth) / 100,
        y: (position.y * parentHeight) / 100
      }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      bounds="parent"
      minWidth="1%"
      minHeight="1%"
      style={{
        border: '1px solid grey',
      }}
    >
      <Box
        onDoubleClick={() => doubleClickFunc(element)}
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
    </Rnd>
  );
}

export default TextElement;
