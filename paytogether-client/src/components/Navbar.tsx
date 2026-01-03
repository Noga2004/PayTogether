import { AppBar, Box, Button, Stack, Toolbar, Typography } from "@mui/material";

interface NavbarProps {
    setCurrentView: (view: 'landing' | 'signup' | 'signin') => void;
}

const Navbar = ({ setCurrentView }: NavbarProps) => {
    return <AppBar 
        position="static" 
        elevation={0} 
        sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0' }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
              PayTogether
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button 
              onClick={() => setCurrentView('signin')}
              sx={{ color: '#666', textTransform: 'none', fontWeight: 500 }}
            >
              Sign In
            </Button>
            <Button 
              onClick={() => setCurrentView('signup')}
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
        </Toolbar>
      </AppBar>
};

export default Navbar;