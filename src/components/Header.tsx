import React from 'react';
import { Box, IconButton, AppBar, Toolbar } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

interface HeaderProps {
  onMenuClick: () => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, currentPage }) => {

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          display: { xs: 'block', md: 'none' },
          backgroundColor: 'white',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Box sx={{ 
        mt: { xs: 7, md: 0 } 
      }}>
      </Box>
    </>
  );
};

export default Header;
