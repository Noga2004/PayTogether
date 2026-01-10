import React, { useState } from 'react';
import { Box, Button, Card, Stack, Typography, Alert } from '@mui/material';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import Logo from './Logo';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login({ email, password });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#fafafa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3
    }}>
      <Box sx={{ width: '100%', maxWidth: 500 }}>
        <Button 
          onClick={() => navigate('/')}
          startIcon={<ArrowRight size={20} style={{ transform: 'rotate(180deg)' }} />}
          sx={{ color: '#666', textTransform: 'none', mb: 5, fontWeight: 500 }}
        >
          Back to Home
        </Button>

        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Box sx={{ mb: 3 }}>
            <Logo size={90}/>
          </Box>

          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1.5 }}>
            Welcome back
          </Typography>
          <Typography variant="h6" sx={{ color: '#666', fontWeight: 400, mb: 2 }}>
            Sign in to access your shared expenses
          </Typography>
        </Box>

        <Card elevation={0} sx={{ p: 5, borderRadius: 3, border: '1px solid #e5e5e5' }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3.5}>
              {error && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 1.5, color: '#333' }}>
                  Email address
                </Typography>
                <Box sx={{
                  border: '2px solid #e5e5e5',
                  borderRadius: 2.5,
                  p: 2.5,
                  bgcolor: 'white',
                  '&:focus-within': {
                    borderColor: '#8B9D83',
                    boxShadow: '0 0 0 4px rgba(139, 157, 131, 0.1)'
                  }
                }}>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    style={{
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      backgroundColor: 'transparent',
                      color: '#333'
                    }}
                  />
                </Box>
              </Box>

              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 1.5, color: '#333' }}>
                  Password
                </Typography>
                <Box sx={{
                  border: '2px solid #e5e5e5',
                  borderRadius: 2.5,
                  p: 2.5,
                  bgcolor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  '&:focus-within': {
                    borderColor: '#8B9D83',
                    boxShadow: '0 0 0 4px rgba(139, 157, 131, 0.1)'
                  }
                }}>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    style={{
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      backgroundColor: 'transparent',
                      color: '#333'
                    }}
                  />
                </Box>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  bgcolor: '#8B9D83',
                  py: 2,
                  fontSize: '1.05rem',
                  textTransform: 'none',
                  borderRadius: 2.5,
                  fontWeight: 600,
                  mt: 1,
                  '&:hover': { bgcolor: '#7a8c72' },
                  '&:disabled': { bgcolor: '#ccc' }
                }}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </Stack>
          </Box>
        </Card>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body1" sx={{ color: '#666', fontSize: '0.95rem' }}>
            Don't have an account?{' '}
            <Button 
              onClick={() => navigate('/signup')}
              sx={{ 
                color: '#000', 
                textTransform: 'none',
                fontWeight: 600,
                p: 0,
                fontSize: '0.95rem',
                '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
              }}
            >
              Sign up
            </Button>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SignIn;