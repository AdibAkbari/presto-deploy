import { Box } from '@mui/material';
import { Rnd } from 'react-rnd';
import { useState, useEffect, useRef } from 'react';
import TextElement from './TextElement';
import ImageElement from './ImageElement';
import VideoElement from './VideoElement';
import CodeElement from './CodeElement';

function DisplayElement({ element, doubleClickFunc, onUpdateElement, parentWidth, parentHeight, onOpenDeleteModal, isPreview, presentation }) {
  const [position, setPosition] = useState(element.position);
  const [size, setSize] = useState({ width: element.width, height: element.height });
  const [isClicked, setIsClicked] = useState(false);
  const [resizeHandleDisplay, setResizeHandleDisplay] = useState('none');
  const [borderStyle, setborderStyle] = useState('grey');
  const elementRef = useRef(null);

  // positions for 4 boxes for resizing handling
  const boxPositions = [
    { top: -3, left: -3 },
    { left: -3, bottom: -3 },
    { right: -3, bottom: -3 },
    { top: -3, right: -3 }
  ]

  // puts blue border and four boxes when clicked
  useEffect(() => {
    if (isClicked && !isPreview) {
      setResizeHandleDisplay('inline');
      setborderStyle('#1976d3');
    }
  }, [isClicked]);

  const handleClick = () => {
    setIsClicked(true);
  }

  const handleBlur = () => {
    setIsClicked(false);
    setResizeHandleDisplay('none');
    setborderStyle('grey');
  };

  // only allows double click and delete if not in preview mode
  const handleDoubleClick = () => {
    if (!isPreview) {
      doubleClickFunc(element);
    }
  }
  
  const handleDelete = (event) => {
    if (!isPreview) {
      event.preventDefault();
      onOpenDeleteModal();
    }
  };

  const handleDragStop = (e, data) => {
    const updatedPosition = {
      x: (data.x / parentWidth) * 100,
      y: (data.y / parentHeight) * 100
    };
    setPosition(updatedPosition);
    onUpdateElement({ ...element, position: {...updatedPosition} });
  };

  const handleResizeStop = (e, direction, ref, delta, newPosition) => {
    // calculates percentage width and height based on offset in pixels 
    // from top left of parent
    const newWidth = (ref.offsetWidth / parentWidth) * 100;
    const newHeight = (ref.offsetHeight / parentHeight) * 100;

    // updates size ensuring it is at least 1%
    const updatedSize = {
      width: newWidth < 1 ? 1 : newWidth,
      height: newHeight < 1 ? 1 : newHeight
    };

    const updatedPosition = {
      x: (newPosition.x / parentWidth) * 100,
      y: (newPosition.y / parentHeight) * 100
    };
    setIsClicked(false);
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
        // converts percentage position to pixels
        x: (position.x * parentWidth) / 100, 
        y: (position.y * parentHeight) / 100
      }}
      disableDragging={isPreview || !isClicked}
      enableResizing={!isPreview && isClicked}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      bounds="parent"
      minWidth="1%"
      minHeight="1%"
      style={{
        border: isPreview? 'none' : `1px solid ${borderStyle}`
      }}
      ref={elementRef}
    >
      {/* Boxes for resize handling */}
      {boxPositions.map((pos, index) => (
        <Box
          key={index}
          sx={{
            backgroundColor: '#1976d3',
            position: 'absolute',
            width: '5px',
            height: '5px',
            ...pos,
          }}
          display={resizeHandleDisplay}
        ></Box>
      ))}

      {element.type === 'text' && (
        <TextElement 
          element={element} 
          handleClick={handleClick}
          handleBlur={handleBlur}
          handleDoubleClick={handleDoubleClick}
          handleDelete={handleDelete}
          presentation={presentation}
        />
      )}

      {element.type === 'image' && (
        <ImageElement 
          element={element} 
          handleClick={handleClick} 
          handleBlur={handleBlur}
          handleDoubleClick={handleDoubleClick}
          handleDelete={handleDelete}
        />
      )}

      {element.type === 'video' && (
        <VideoElement 
          element={element}
          handleClick={handleClick} 
          handleBlur={handleBlur}
          handleDoubleClick={handleDoubleClick}
          handleDelete={handleDelete}
        />
      )}

      {element.type === 'code' && (
        <CodeElement
          element={element}
          handleClick={handleClick} 
          handleBlur={handleBlur}
          handleDoubleClick={handleDoubleClick}
          handleDelete={handleDelete}
        />
      )}
    </Rnd>
  );
}

export default DisplayElement;
