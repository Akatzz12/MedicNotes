import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { AppProvider } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PermanentSidebar from './components/PermanentSidebar';
import SummarizerPage from './components/SummarizerPage';
import StudentsPage from './components/StudentsPage';
import EvaluatorsPage from './components/EvaluatorsPage';
import StudentInfoPage from './components/StudentInfoPage';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('summarizer');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'summarizer':
        return <SummarizerPage />;
      case 'patients':
        return <StudentsPage />;
      case 'evaluators':
        return <EvaluatorsPage />;
      case 'patientInfo':
        return <StudentInfoPage />;
      default:
        return <SummarizerPage />;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      display: 'flex'
    }}>
      {/* Permanent Sidebar for Desktop */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <PermanentSidebar 
          currentPage={currentPage} 
          onPageChange={handlePageChange}
          collapsed={sidebarCollapsed}
          onToggle={handleSidebarToggle}
        />
      </Box>

      {/* Temporary Sidebar for Mobile */}
      <Sidebar 
        open={sidebarOpen}
        onClose={handleSidebarClose}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      {/* Main Content Area */}
      <Box sx={{ 
        flexGrow: 1,
        ml: { xs: 0, md: sidebarCollapsed ? '60px' : '240px' }, 
        minHeight: '100vh',
        transition: 'margin-left 0.3s ease',
        overflow: 'hidden',
        width: { xs: '100%', md: 'auto' } 
      }}>
        

        <Box sx={{ 
          width: '100%',
          overflow: 'hidden',
          pt: { xs: 0, md: 0 } 
        }}>
          <Header 
            onMenuClick={handleMenuClick}
            currentPage={currentPage}
          />
          {renderCurrentPage()}
        </Box>
      </Box>
    </Box>
  );
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);


  if (isLoading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Loading Medical Notes App...
        </Typography>
      </Box>
    );
  }

  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;
