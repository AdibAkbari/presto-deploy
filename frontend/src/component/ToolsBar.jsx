// src/components/AppBarComponent.js

import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Tooltip,
  Container,
  Box,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AddBox as AddBoxIcon,
  TextFields as FontIcon,
  LowPriority as LowPriorityIcon,
  Slideshow as SlideshowIcon,
  ColorLens as ColorLensIcon,
  InsertPhoto as InsertPhotoIcon,
  Delete as DeleteIcon,
  DeleteForever as DeleteForeverIcon,
} from '@mui/icons-material';
import NewElement from '../component/NewElement'; // Adjust the import path as necessary

const AppBarComponent = ({
  handleOpenNavMenu,
  anchorElNav,
  handleCloseNavMenu,
  setIsFontFamilyModalOpen,
  createNewSlide,
  setIsRearranging,
  navigate,
  handlePreview,
  setIsThemeModalOpen,
  setIsUpdateThumbnailOpen,
  deleteSlide,
  setIsDeleteModalOpen,
  presentation,
  setPresentation,
  currentSlideIndex,
  savePresentationsToStore,
  presentations,
}) => {
  return (
    <AppBar position="static" color="default">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Mobile Menu */}
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {/* Mobile menu icon */}
            <IconButton
              size="large"
              aria-label="app menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
            >
              <MenuItem
                sx={{
                  display: { xs: 'flex', sm: 'none' },
                }}
              >
                <NewElement
                  presentation={presentation}
                  setPresentation={setPresentation}
                  currentSlideIndex={currentSlideIndex}
                  savePresentationsToStore={savePresentationsToStore}
                  presentations={presentations}
                  inMenu={true}
                />
              </MenuItem>
              <Tooltip title="Change the font family of the entire presentation" placement="right">
                <MenuItem
                  onClick={() => {
                    setIsFontFamilyModalOpen(true);
                    handleCloseNavMenu();
                  }}
                >
                  <Button startIcon={<FontIcon />} color="secondary">
                    Font Family
                  </Button>
                </MenuItem>
              </Tooltip>
              <Tooltip title="Add a new slide to the presentation" placement="right">
                <MenuItem
                  onClick={() => {
                    createNewSlide();
                    handleCloseNavMenu();
                  }}
                  sx={{
                    display: { xs: 'flex', sm: 'none' },
                  }}
                >
                  <Button startIcon={<AddBoxIcon />} color="secondary">
                    New Slide
                  </Button>
                </MenuItem>
              </Tooltip>
              <Tooltip title="Rearrange the slides in the presentation" placement="bottom">
                <MenuItem
                  onClick={() => {
                    setIsRearranging(true);
                    navigate('rearrange');
                    handleCloseNavMenu();
                  }}
                  sx={{
                    display: { xs: 'flex', sm: 'none' },
                  }}
                >
                  <Button startIcon={<LowPriorityIcon />} color="secondary">
                    Rearrange Slides
                  </Button>
                </MenuItem>
              </Tooltip>
              <Tooltip title="Preview the presentation (Opens in a new tab)" placement="right">
                <MenuItem
                  onClick={() => {
                    handlePreview();
                    handleCloseNavMenu();
                  }}
                  sx={{
                    display: { xs: 'flex', sm: 'none' },
                  }}
                >
                  <Button startIcon={<SlideshowIcon />} color="secondary">
                    Preview
                  </Button>
                </MenuItem>
              </Tooltip>
              <Tooltip
                title="Change the background style of the slide or the presentation's default style"
                placement="right"
              >
                <MenuItem
                  onClick={() => {
                    setIsThemeModalOpen(true);
                    handleCloseNavMenu();
                  }}
                >
                  <Button startIcon={<ColorLensIcon />} color="secondary">
                    Theme
                  </Button>
                </MenuItem>
              </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default AppBarComponent;