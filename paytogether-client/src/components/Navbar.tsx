import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Box, 
  Typography, 
  Stack, 
  Button,
  IconButton,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutGrid, Receipt, Plus, User, LogOut } from 'lucide-react';
import { authService } from '../services/authService';

interface NavbarProps {
  showAuthButtons?: boolean;
  showNavigation?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ showAuthButtons = true, showNavigation = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const user = authService.getCurrentUser();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
    handleMenuClose();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{ 
        bgcolor: 'white', 
        borderBottom: '1px solid #e0e0e0',
        top: 0,
        zIndex: 1100
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1.5, px: { xs: 2, md: 4 } }}>
        <Box 
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <Box sx={{ width: 36, height: 36, position: 'relative' }}>
            <Box sx={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              bgcolor: '#8B9D83',
              position: 'absolute',
              left: 0,
              top: 4
            }} />
            <Box sx={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              bgcolor: '#B8A9D4',
              position: 'absolute',
              right: 0,
              top: 0
            }} />
          </Box>
          <Typography variant="h6" sx={{ color: '#000', fontWeight: 600 }}>
            pay Together
          </Typography>
        </Box>
        
        {showAuthButtons && !showNavigation && (
          <Stack direction="row" spacing={2}>
            <Button 
              onClick={() => navigate('/signin')}
              sx={{ color: '#666', textTransform: 'none', fontWeight: 500 }}
            >
              Sign In
            </Button>
            <Button 
              onClick={() => navigate('/signup')}
              variant="contained"
              sx={{ 
                bgcolor: '#8B9D83',
                textTransform: 'none',
                px: 3,
                borderRadius: 2,
                '&:hover': { bgcolor: '#7a8c72' }
              }}
            >
              Sign Up
            </Button>
          </Stack>
        )}

        {showNavigation && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button
                onClick={() => navigate('/groups')}
                startIcon={<LayoutGrid size={20} />}
                sx={{
                  color: isActive('/groups') ? '#000' : '#666',
                  bgcolor: isActive('/groups') ? '#f5f5f5' : 'transparent',
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: '#f5f5f5'
                  }
                }}
              >
                Groups
              </Button>
              <Button
                onClick={() => navigate('/expenses')}
                startIcon={<Receipt size={20} />}
                sx={{
                  color: isActive('/expenses') ? '#000' : '#666',
                  bgcolor: isActive('/expenses') ? '#f5f5f5' : 'transparent',
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: '#f5f5f5'
                  }
                }}
              >
                Expenses
              </Button>
              <Button
                onClick={() => navigate('/add-expense')}
                startIcon={<Plus size={20} />}
                variant="contained"
                sx={{
                  bgcolor: '#B8A9D4',
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: '#a89ac4'
                  }
                }}
              >
                Add Expense
              </Button>
            </Stack>

            {user && (
              <Box>
                <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: '#8B9D83',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '1rem'
                    }}
                  >
                    {user.fullName?.charAt(0).toUpperCase()}
                  </Box>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  sx={{ mt: 1 }}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <Box sx={{ px: 2, py: 1, minWidth: 200 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#000' }}>
                      {user.fullName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666' }}>
                      {user.email}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <LogOut size={18} style={{ marginRight: 8 }} />
                    Sign Out
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;