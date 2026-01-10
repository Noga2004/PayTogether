import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Card,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { Plus, Users, ArrowRight, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import CreateGroupDialog from './CreateGroupDialog';
import { groupsService, Group } from '../services/groupsService';
import { authService } from '../services/authService';

const GroupsPage: React.FC = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const data = await groupsService.getAll();
      console.log('Fetched groups:', data);
      console.log('Current user:', currentUser);
      setGroups(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const handleGroupCreated = () => {
    fetchGroups();
  };

  const handleDeleteGroup = async (groupId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click navigation
    
    if (!window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      return;
    }

    try {
      await groupsService.delete(groupId);
      setGroups(groups.filter(g => g.id !== groupId));
      setSnackbar({ open: true, message: 'Group deleted successfully', severity: 'success' });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Failed to delete group';
      setSnackbar({ 
        open: true, 
        message: errorMessage, 
        severity: 'error' 
      });
    }
  };

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
            onClick={() => setDialogOpen(true)}
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

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#8B9D83' }} />
          </Box>
        ) : groups.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
              No groups yet
            </Typography>
            <Typography variant="body2" sx={{ color: '#999' }}>
              Create your first group to start sharing expenses
            </Typography>
          </Box>
        ) : (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 3
          }}>
            {groups.map((group) => {
              const isOwner = currentUser?.id === group.createdBy.id;
              console.log(`Group ${group.name}:`, {
                groupCreatedById: group.createdBy.id,
                groupCreatedByIdType: typeof group.createdBy.id,
                currentUserId: currentUser?.id,
                currentUserIdType: typeof currentUser?.id,
                isOwner,
                strictEqual: currentUser?.id === group.createdBy.id,
                looseEqual: currentUser?.id == group.createdBy.id
              });
              
              return (
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ color: '#999', fontSize: '0.875rem' }}>
                      {group.lastActivity}
                    </Typography>
                    {isOwner && (
                      <IconButton
                        size="small"
                        onClick={(e) => handleDeleteGroup(group.id, e)}
                        sx={{
                          color: '#d32f2f',
                          '&:hover': {
                            bgcolor: 'rgba(211, 47, 47, 0.08)'
                          }
                        }}
                      >
                        <Trash2 size={18} />
                      </IconButton>
                    )}
                  </Box>
                </Box>

                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#000' }}>
                  {group.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 4 }}>
                  {group.membersCount} members
                </Typography>

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
            );
          })}

          <Card
            elevation={0}
            onClick={() => setDialogOpen(true)}
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
        )}
      </Container>

      <Box sx={{ bgcolor: 'white', py: 4, mt: 8, borderTop: '1px solid #e0e0e0' }}>
        <Container>
          <Typography variant="body2" sx={{ color: '#999', textAlign: 'center' }}>
            © 2024 payTogether. Simple expense sharing.
          </Typography>
        </Container>
      </Box>

      <CreateGroupDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onGroupCreated={handleGroupCreated}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GroupsPage;