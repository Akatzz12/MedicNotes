import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  Typography
} from '@mui/material';
import {
  Summarize as SummarizeIcon,
  Person as PersonIcon,

  School as InstructorIcon,
  Close as CloseIcon
} from '@mui/icons-material';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const drawerWidth = 240;

const menuItems = [
  {
    id: 'summarizer',
    label: 'Evaluation',
    icon: <SummarizeIcon />
  },
  {
    id: 'patients',
    label: 'Past Evaluation',
    icon: <PersonIcon />
  },
  {
    id: 'evaluators',
    label: 'Instructors',
    icon: <InstructorIcon />
  }
  ,
  {
    id: 'patientInfo',
    label: 'Student',
    icon: <PersonIcon />
  }
];

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, currentPage, onPageChange }) => {
  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, 
        BackdropProps: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.3)', 
            backdropFilter: 'blur(4px)', 
            WebkitBackdropFilter: 'blur(4px)', 
          }
        }
      }}
      sx={{
        display: { xs: 'block', md: 'none' },
        zIndex: 1300, 
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: drawerWidth,
          backgroundColor: 'white', 
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          zIndex: 1300, 
          backdropFilter: 'none !important', 
          filter: 'none !important', 
          transform: 'none !important',
          willChange: 'auto' 
        },
      }}
    >
      {/* Title + Close */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between', 
        px: 2,
        py: 1.5,
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
      }}>
        <Typography 
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: '1rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          Medical Notes App
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.08)',
            }
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={currentPage === item.id}
              onClick={() => {
                onPageChange(item.id);
                onClose(); 
              }}
              sx={{
                mx: 1,
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.12)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: currentPage === item.id ? 'primary.main' : 'text.primary',
                minWidth: { xs: 40, sm: 44 },
                '& .MuiSvgIcon-root': {
                  fontSize: { xs: '1.5rem', sm: '1.8rem' }
                }
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: currentPage === item.id ? 600 : 400,
                  color: currentPage === item.id ? 'primary.main' : 'text.primary',
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;