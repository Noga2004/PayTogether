import React from 'react';
import { Box, Container, Typography, Button, Card, Avatar, Stack } from '@mui/material';
import { Users, Receipt, PieChart, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { authService } from '../services/authService';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
      <Navbar showAuthButtons={!user} showNavigation={!!user} />

      <Container maxWidth="lg" sx={{ pt: { xs: 8, md: 14 }, pb: 8 }}>
        <Box sx={{ textAlign: 'center', position: 'relative' }}>
          <Box sx={{
            position: 'absolute',
            top: -100,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 500,
            height: 500,
            background: 'radial-gradient(circle, rgba(139, 157, 131, 0.25) 0%, transparent 70%)',
            filter: 'blur(80px)',
            zIndex: 0,
            pointerEvents: 'none'
          }} />
          <Box sx={{
            position: 'absolute',
            top: -50,
            left: '65%',
            width: 450,
            height: 450,
            background: 'radial-gradient(circle, rgba(184, 169, 212, 0.25) 0%, transparent 70%)',
            filter: 'blur(80px)',
            zIndex: 0,
            pointerEvents: 'none'
          }} />

          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '3.5rem', md: '6rem' },
              fontWeight: 800,
              mb: 3,
              position: 'relative',
              zIndex: 1,
              lineHeight: 1.05
            }}
          >
            Split expenses,<br />
            stay together.
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#666',
              mb: 6,
              maxWidth: 700,
              mx: 'auto',
              fontSize: { xs: '1.1rem', md: '1.5rem' },
              lineHeight: 1.6,
              position: 'relative',
              zIndex: 1,
              fontWeight: 400
            }}
          >
            The easiest way to share expenses with friends and family. No more
            awkward math or forgotten debts. Just simple, fair sharing.
          </Typography>

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center" 
            sx={{ mb: 6, position: 'relative', zIndex: 1 }}
          >
            <Button
              onClick={() => navigate('/signup')}
              variant="contained"
              endIcon={<ArrowRight size={20} />}
              sx={{
                bgcolor: '#8B9D83',
                px: 5,
                py: 2,
                fontSize: '1.1rem',
                textTransform: 'none',
                borderRadius: 3,
                fontWeight: 600,
                '&:hover': { bgcolor: '#7a8c72' }
              }}
            >
              Start Splitting Free
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: '#ddd',
                borderWidth: 2,
                color: '#666',
                px: 5,
                py: 2,
                fontSize: '1.1rem',
                textTransform: 'none',
                borderRadius: 3,
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#bbb',
                  borderWidth: 2,
                  bgcolor: 'rgba(0,0,0,0.02)'
                }
              }}
            >
              View Demo
            </Button>
          </Stack>

          <Stack 
            direction="row" 
            spacing={4} 
            justifyContent="center" 
            flexWrap="wrap"
            sx={{ position: 'relative', zIndex: 1 }}
          >
            {[
              { icon: CheckCircle, text: 'Free forever' },
              { icon: CheckCircle, text: 'No ads' },
              { icon: CheckCircle, text: 'Secure' }
            ].map((item, idx) => (
              <Stack key={idx} direction="row" spacing={1} alignItems="center">
                <item.icon size={18} />
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {item.text}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Container>

      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
          gap: 4 
        }}>
          {[
            {
              icon: Users,
              title: 'Create Groups',
              description: 'Organize expenses by trip, house, or event. Keep everything separate and tidy.',
              color: '#8B9D83',
              bgColor: 'rgba(139, 157, 131, 0.1)'
            },
            {
              icon: Receipt,
              title: 'Track Expenses',
              description: "Add expenses in seconds. We'll do the math and keep a running total for everyone.",
              color: '#B8A9D4',
              bgColor: 'rgba(184, 169, 212, 0.1)'
            },
            {
              icon: PieChart,
              title: 'Settle Up',
              description: "See exactly who owes what. Pay back friends with a single tap when you're ready.",
              color: '#7BA3C7',
              bgColor: 'rgba(123, 163, 199, 0.1)'
            }
          ].map((feature, idx) => (
            <Card 
              key={idx}
              elevation={0}
              sx={{ 
                p: 4,
                border: '1px solid #e5e5e5',
                borderRadius: 4,
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 28px rgba(0,0,0,0.08)'
                }
              }}
            >
              <Avatar 
                sx={{ 
                  bgcolor: feature.bgColor,
                  width: 64,
                  height: 64,
                  mb: 3
                }}
              >
                <feature.icon size={32} style={{ color: feature.color }} />
              </Avatar>
              <Typography 
                variant="h6" 
                sx={{ fontWeight: 700, mb: 2, fontSize: '1.4rem' }}
              >
                {feature.title}
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.7 }}>
                {feature.description}
              </Typography>
            </Card>
          ))}
        </Box>
      </Container>

      <Box sx={{ bgcolor: '#f5f5f5', py: 12 }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Stack direction="row" justifyContent="center" sx={{ mb: 3 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Avatar 
                  key={i}
                  sx={{ 
                    width: 44, 
                    height: 44, 
                    bgcolor: '#d0d0d0',
                    ml: i > 1 ? -1.5 : 0,
                    border: '3px solid white'
                  }}
                />
              ))}
              <Avatar sx={{
                width: 44,
                height: 44,
                bgcolor: '#8B9D83',
                ml: -1.5,
                border: '3px solid white',
                fontSize: '0.8rem',
                fontWeight: 700
              }}>
                +2k
              </Avatar>
            </Stack>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
              Trusted by thousands of friends
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#666',
                fontStyle: 'italic',
                mb: 2,
                fontWeight: 400,
                lineHeight: 1.6
              }}
            >
              "Finally, an app that makes splitting bills actually feel fair. No more spreadsheets!"
            </Typography>
            <Typography variant="body2" sx={{ color: '#999' }}>
              — Sarah J., Copenhagen Trip Group
            </Typography>
          </Box>
        </Container>
      </Box>

      <Box sx={{ bgcolor: 'white', py: 5, borderTop: '1px solid #e0e0e0' }}>
        <Container>
          <Typography variant="body2" sx={{ color: '#999', textAlign: 'center' }}>
            © 2024 payTogether. Simple expense sharing.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;