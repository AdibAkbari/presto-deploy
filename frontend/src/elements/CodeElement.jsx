import { Box } from '@mui/material';
import flourite from 'flourite';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeElement = (
  { 
    element, 
    handleDoubleClick, 
    handleClick, 
    handleBlur, 
    handleDelete 
  }) => {
  return (
    <Box
      tabIndex={-1}
      onClick={handleClick}
      onBlur={handleBlur}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleDelete}
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative'
      }}
    >
      <SyntaxHighlighter
        // Infers language of code block
        language={flourite(element.content).language.toLowerCase()}
        style={coy}
        useInlineStyles={true}
        wrapLongLines={true}
        customStyle={{
          fontSize: `${element.fontSize}em`,
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          margin: '0px'
        }}
      >
        {element.content}
      </SyntaxHighlighter>
    </Box>
  );
}

export default CodeElement;