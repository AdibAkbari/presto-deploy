import { Box } from '@mui/material';
import { Rnd } from 'react-rnd';
import { useState, useEffect, useRef } from 'react';
import TextElement from './TextElement';
import ImageElement from './ImageElement';
import VideoElement from './VideoElement';
import CodeElement from './CodeElement';

function DisplayElement({ element, doubleClickFunc, onUpdateElement, parentWidth, parentHeight, onOpenDeleteModal, isPreview }) {
  const [position, setPosition] = useState(element.position);
  const [size, setSize] = useState({ width: element.width, height: element.height });
  const [isClicked, setIsClicked] = useState(false);
  const [resizeHandleDisplay, setResizeHandleDisplay] = useState('none');
  const [borderStyle, setborderStyle] = useState('grey');
  const elementRef = useRef(null);

  useEffect(() => {
    if (isClicked && !isPreview) {
      setResizeHandleDisplay('inline');
      setborderStyle('blue');
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

  const handleDragStop = (e, data) => {
    const updatedPosition = {
      x: (data.x / parentWidth) * 100,
      y: (data.y / parentHeight) * 100
    };
    setPosition(updatedPosition);
    onUpdateElement({ ...element, position: {...updatedPosition} });
  };

  const handleResizeStop = (e, direction, ref, delta, newPosition) => {
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
        border: `1px solid ${borderStyle}`
      }}
      ref={elementRef}
    >
      <Box
        sx={{
          backgroundColor: 'blue',
          position: 'absolute',
          width: '5px',
          height: '5px',
          top: -3,
          left: -3
        }}
        display={resizeHandleDisplay}
      ></Box>
      <Box
        sx={{
          backgroundColor: 'blue',
          position: 'absolute',
          width: '5px',
          height: '5px',
          left: -3,
          bottom: -3
        }}
        display={resizeHandleDisplay}
      ></Box>
      <Box
        sx={{
          backgroundColor: 'blue',
          position: 'absolute',
          width: '5px',
          height: '5px',
          right: -3,
          bottom: -3
        }}
        display={resizeHandleDisplay}
      ></Box>
      <Box
        sx={{
          backgroundColor: 'blue',
          position: 'absolute',
          width: '5px',
          height: '5px',
          top: -3,
          right: -3
        }}
        display={resizeHandleDisplay}
      ></Box>

      {element.type === 'text' && (
        <TextElement 
          element={element} 
          doubleClickFunc={doubleClickFunc}
          handleClick={handleClick} 
          handleBlur={handleBlur}
          onOpenDeleteModal={() => onOpenDeleteModal(element)}
          isPreview={isPreview}
        />
      )}

      {element.type === 'image' && (
        <ImageElement 
          element={element} 
          doubleClickFunc={doubleClickFunc}
          handleClick={handleClick} 
          handleBlur={handleBlur}
          onOpenDeleteModal={() => onOpenDeleteModal(element)}
          isPreview={isPreview}
        />
      )}

      {element.type === 'video' && (
        <VideoElement 
          element={element}
          doubleClickFunc={doubleClickFunc}
          handleClick={handleClick} 
          handleBlur={handleBlur}
          onOpenDeleteModal={() => onOpenDeleteModal(element)}
          isPreview={isPreview}
        />
      )}

      {element.type === 'code' && (
        <CodeElement
          element={element}
          doubleClickFunc={doubleClickFunc}
          handleClick={handleClick} 
          handleBlur={handleBlur}
          onOpenDeleteModal={() => onOpenDeleteModal(element)}
          isPreview={isPreview}
        />
      )}
    </Rnd>
  );
}

export default DisplayElement;
