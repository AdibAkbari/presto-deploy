import { Box, Typography } from '@mui/material';

function Slide({ slide }) {
  if (!slide) return null;

  return (
    <Box
      sx={{
        width: '1000px',
        height: '500px',
        border: '2px solid grey',
        mt: 2,
        p: 2,
      }}
    >
      <Typography variant="h5">
        Slide {slide.slideId}
      </Typography>

    </Box>
  );
}

export default Slide;
