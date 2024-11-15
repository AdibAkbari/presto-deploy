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
import NewElement from '../component/NewElement';

const ToolsBar = ({
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
              <Tooltip title="Change the thumbnail of the presentation" placement="right">
                <MenuItem
                  onClick={() => {
                    setIsUpdateThumbnailOpen(true);
                    handleCloseNavMenu();
                  }}
                >
                  <Button startIcon={<InsertPhotoIcon />} color="secondary">
                    Update Thumbnail
                  </Button>
                </MenuItem>
              </Tooltip>
              <Tooltip title="Delete this slide and move back to the previous slide" placement="right">
                <MenuItem
                  onClick={() => {
                    deleteSlide();
                    handleCloseNavMenu();
                  }}
                  sx={{
                    display: { xs: 'flex', sm: 'none' },
                  }}
                >
                  <Button startIcon={<DeleteIcon />} color="error">
                    Delete Slide
                  </Button>
                </MenuItem>
              </Tooltip>
            </Menu>
            {/* Additional buttons for small screens */}
            <Box
              sx={{
                my: 2,
                display: { xs: 'none', sm: 'flex', md: 'none' },
              }}
            >
              <NewElement
                presentation={presentation}
                setPresentation={setPresentation}
                currentSlideIndex={currentSlideIndex}
                savePresentationsToStore={savePresentationsToStore}
                presentations={presentations}
                inMenu={false}
              />
            </Box>
            <Tooltip title="Add a new slide to the presentation" placement="bottom">
              <Button
                onClick={createNewSlide}
                variant="text"
                endIcon={<AddBoxIcon />}
                color="secondary"
                sx={{ my: 2, display: { xs: 'none', sm: 'flex', md: 'none' } }}
              >
                New Slide
              </Button>
            </Tooltip>
            <Tooltip title="Preview the presentation (Opens in a new tab)" placement="bottom">
              <Button
                onClick={handlePreview}
                variant="text"
                endIcon={<SlideshowIcon />}
                color="secondary"
                sx={{ my: 2, display: { xs: 'none', sm: 'flex', md: 'none' } }}
              >
                Preview
              </Button>
            </Tooltip>
            <Tooltip title="Delete this slide and move back to the previous slide" placement="bottom">
              <Button
                variant="text"
                onClick={deleteSlide}
                endIcon={<DeleteIcon />}
                sx={{ my: 2, display: { xs: 'none', sm: 'flex', md: 'none' } }}
                color="error"
              >
                Delete Slide
              </Button>
            </Tooltip>
            <Tooltip title="Delete this presentation and return to the dashboard." placement="bottom">
              <Button
                variant="text"
                onClick={() => setIsDeleteModalOpen(true)}
                endIcon={<DeleteForeverIcon />}
                color="error"
                sx={{ my: 2, display: { xs: 'flex', sm: 'none' } }}
              >
                Delete Presentation
              </Button>
            </Tooltip>
          </Box>

          {/* Desktop Menu */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'space-evenly',
            }}
          >
            <NewElement
              presentation={presentation}
              setPresentation={setPresentation}
              currentSlideIndex={currentSlideIndex}
              savePresentationsToStore={savePresentationsToStore}
              presentations={presentations}
              inMenu={false}
            />
            <Tooltip title="Change the font family of the entire presentation" placement="bottom">
              <Button
                onClick={() => setIsFontFamilyModalOpen(true)}
                variant="text"
                endIcon={<FontIcon />}
                color="secondary"
                sx={{ my: 2 }}
              >
                Font Family
              </Button>
            </Tooltip>
            <Tooltip title="Add a new slide to the presentation" placement="bottom">
              <Button
                onClick={createNewSlide}
                variant="text"
                endIcon={<AddBoxIcon />}
                color="secondary"
                sx={{ my: 2 }}
              >
                New Slide
              </Button>
            </Tooltip>
            <Tooltip title="Rearrange the slides in the presentation" placement="bottom">
              <Button
                onClick={() => {
                  setIsRearranging(true);
                  navigate('rearrange');
                }}
                variant="text"
                endIcon={<LowPriorityIcon />}
                color="secondary"
                sx={{ my: 2 }}
              >
                Rearrange Slides
              </Button>
            </Tooltip>
            <Tooltip title="Preview the presentation (Opens in a new tab)" placement="bottom">
              <Button
                onClick={handlePreview}
                variant="text"
                endIcon={<SlideshowIcon />}
                color="secondary"
                sx={{ my: 2 }}
              >
                Preview
              </Button>
            </Tooltip>
            <Tooltip
              title="Change the background style of the slide or the presentation's default style"
              placement="bottom"
            >
              <Button
                variant="text"
                onClick={() => setIsThemeModalOpen(true)}
                endIcon={<ColorLensIcon />}
                color="secondary"
                sx={{ my: 2 }}
              >
                Theme
              </Button>
            </Tooltip>
            <Tooltip title="Change the thumbnail of the presentation" placement="bottom">
              <Button
                onClick={() => setIsUpdateThumbnailOpen(true)}
                variant="text"
                endIcon={<InsertPhotoIcon />}
                color="secondary"
                sx={{ my: 2 }}
              >
                Update Thumbnail
              </Button>
            </Tooltip>
            <Tooltip title="Delete this slide and move back to the previous slide" placement="bottom">
              <Button
                variant="text"
                onClick={deleteSlide}
                endIcon={<DeleteIcon />}
                sx={{ my: 2 }}
                color="error"
              >
                Delete Slide
              </Button>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default ToolsBar;