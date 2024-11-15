
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
  setIsEditModalOpen, 
  deleteSlide 
}) => {
  return (
    <AppBar position="static" color="#ffffff">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default AppBarComponent;
