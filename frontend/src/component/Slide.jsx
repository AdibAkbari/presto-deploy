import { Box, Typography } from '@mui/material';

function Slide({ slide, slideIndex }) {
  if (!slide) return null;

  return (
    <Box
      sx={{
        position: 'relative',
        width: '70%',
        border: '2px solid grey',
        aspectRatio: '2/1',
        mt: 2,
        p: 1
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          position: 'absolute',
          bottom: '0px',
          fontSize: '1em'
        }}
      >
        {slideIndex + 1}
      </Typography>
    </Box>
  );
}

export default Slide;
