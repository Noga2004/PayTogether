import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Card,
  IconButton
} from '@mui/material';
import { Plus, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

interface Group {
  id: string;
  name: string;
  membersCount: number;
  totalSpent: number;
  lastActivity: string;
}

const GroupsPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [groups] = useState<Group[]>([
    {
      id: '1',
      name: 'Copenhagen Trip',
      membersCount: 4,
      totalSpent: 1240.50,
      lastActivity: '2h ago'
    },
    {
      id: '2',
      name: 'Apartment 4B',
      membersCount: 3,
      totalSpent: 450.00,
      lastActivity: '1d ago'
    },
    {
      id: '3',
      name: 'Friday Dinner Club',
      membersCount: 6,
      totalSpent: 890.25,
      lastActivity: '3d ago'
    },
    {
      id: '4',
      name: 'Ski Weekend',
      membersCount: 8,
      totalSpent: 2100.00,
      lastActivity: '1w ago'
    }
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
      <Navbar showAuthButtons={false} showNavigation={true} />

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 5 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: '#000' }}>
              Your Groups
            </Typography>
            <Typography variant="h6" sx={{ color: '#666', fontWeight: 400 }}>
              Manage shared expenses with friends and family.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            sx={{
              bgcolor: '#8B9D83',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              textTransform: 'none',
              borderRadius: 2.5,
              fontWeight: 600,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#7a8c72',
                boxShadow: 'none'
              }
            }}
          >
            Create Group
          </Button>
        </Box>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
          gap: 3
        }}>
          {groups.map((group) => (
            <Card
              key={group.id}
              elevation={0}
              sx={{
                p: 4,
                border: '1px solid #e5e5e5',
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: '#8B9D83',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  transform: 'translateY(-2px)'
                }
              }}
              onClick={() => navigate(`/groups/${group.id}`)}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      bgcolor: 'rgba(184, 169, 212, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Users size={28} style={{ color: '#B8A9D4' }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: '#999', fontSize: '0.875rem' }}>
                    {group.lastActivity}
                  </Typography>
                </Box>

                {/* Group Info */}
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#000' }}>
                  {group.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 4 }}>
                  {group.membersCount} members
                </Typography>

                {/* Total Spent */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  pt: 3,
                  borderTop: '1px solid #f0f0f0'
                }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#999', fontSize: '0.75rem', display: 'block', mb: 0.5 }}>
                      Total Spent
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#000' }}>
                      {formatCurrency(group.totalSpent)}
                    </Typography>
                  </Box>
                  <IconButton 
                    sx={{ 
                      bgcolor: '#f5f5f5',
                      '&:hover': {
                        bgcolor: '#e5e5e5'
                      }
                    }}
                  >
                    <ArrowRight size={20} style={{ color: '#666' }} />
                  </IconButton>
                </Box>
              </Card>
          ))}

          <Card
            elevation={0}
            sx={{
              p: 4,
                border: '2px dashed #e0e0e0',
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 280,
                bgcolor: 'transparent',
                '&:hover': {
                  borderColor: '#8B9D83',
                  bgcolor: 'rgba(139, 157, 131, 0.02)'
                }
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  bgcolor: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2
                }}
              >
                <Plus size={32} style={{ color: '#999' }} />
              </Box>
              <Typography variant="h6" sx={{ color: '#666', fontWeight: 500 }}>
                Create a new group
              </Typography>
            </Card>
        </Box>
      </Container>

      <Box sx={{ bgcolor: 'white', py: 4, mt: 8, borderTop: '1px solid #e0e0e0' }}>
        <Container>
          <Typography variant="body2" sx={{ color: '#999', textAlign: 'center' }}>
            © 2024 payTogether. Simple expense sharing.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default GroupsPage;