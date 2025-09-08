import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography
} from '@mui/material';
import { Summarize as SummarizeIcon, Person as PersonIcon, MedicalServices as DoctorIcon, ChevronLeft, ChevronRight } from '@mui/icons-material';

interface PermanentSidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  collapsed?: boolean;
  onToggle: () => void;
}

const drawerWidth = 240;
const collapsedWidth = 60;

const menuItems = [
  {
    id: 'summarizer',
    label: 'Evaluation',
    icon: <SummarizeIcon />,
    description: 'Record and evaluate medical notes'
  },
  {
    id: 'patients',
    label: 'Past Evaluation',
    icon: <PersonIcon />,
    description: 'View previous evaluations'
  },
  {
    id: 'evaluators',
    label: 'Doctors',
    icon: <DoctorIcon />,
    description: 'View doctors'
  }
  ,
  {
    id: 'patientInfo',
    label: 'Student',
    icon: <PersonIcon />,
    description: 'View student'
  }
];

const PermanentSidebar: React.FC<PermanentSidebarProps> = ({ currentPage, onPageChange, collapsed = false, onToggle }) => {
  return (
    <Box
      sx={{
        width: collapsed ? collapsedWidth : drawerWidth,
        flexShrink: 0,
        backgroundColor: 'rgba(25, 118, 210, 0.02)',
        borderRight: '1px solid rgba(25, 118, 210, 0.12)',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1,
        overflow: 'auto',
        transition: 'width 0.3s ease'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1.5, py: 1 }}>
        {!collapsed && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '0.95rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            Medical Notes App
          </Typography>
        )}
        <IconButton
          onClick={onToggle}
          size="small"
          sx={{
            backgroundColor: 'white',
            boxShadow: 1,
            width: 28,
            height: 28,
            '&:hover': {
              backgroundColor: 'grey.50',
              boxShadow: 2
            }
          }}
        >
          {collapsed ? <ChevronRight fontSize="small" /> : <ChevronLeft fontSize="small" />}
        </IconButton>
      </Box>
      <List sx={{ pt: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={currentPage === item.id}
              onClick={() => onPageChange(item.id)}
              sx={{
                mx: 1,
                my: 0.5,
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
                color: currentPage === item.id ? 'primary.main' : 'text.secondary',
                minWidth: { xs: 36, sm: 40 },
                '& .MuiSvgIcon-root': {
                  fontSize: { xs: '1.2rem', sm: '1.5rem' }
                }
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                secondary={item.description}
                primaryTypographyProps={{
                  fontWeight: currentPage === item.id ? 600 : 400,
                  color: currentPage === item.id ? 'primary.main' : 'text.primary',
                  fontSize: { xs: '0.85rem', sm: '0.9rem' }
                }}
                secondaryTypographyProps={{
                  fontSize: { xs: '0.7rem', sm: '0.75rem' }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default PermanentSidebar;
