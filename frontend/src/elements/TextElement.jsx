import { Box } from '@mui/material';
import { useContext, useState } from 'react';
import '@fontsource/open-sans';
import '@fontsource/poppins';
import PresentationContext from '../PresentationContext';

function TextElement({ element, doubleClickFunc, handleClick, handleBlur, onOpenDeleteModal, isPreview }) {
  const currFontFamily = useContext(PresentationContext).fontFamily;
  const handleDoubleClick = () => {
    if (!isPreview) {
      doubleClickFunc(element);
    }
  };

  const handleDelete = (event) => {
    if (!isPreview) {
      event.preventDefault();
      onOpenDeleteModal();
    }
  };

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
        fontFamily: `${currFontFamily}`,
      }}
    >
      {element.content}
    </Box>
  );
}

export default TextElement;
