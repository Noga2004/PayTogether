import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Card,
  Avatar,
  Stack,
  Chip,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  ArrowLeft, 
  Plus, 
  Users, 
  Receipt, 
  DollarSign,
  Trash2,
  UserPlus
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import TopBar from './Navbar';
import { groupsService, GroupDetail } from '../services/groupsService';
import { expensesService, Expense } from '../services/expensesService';

const GroupDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();

  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openAddMember, setOpenAddMember] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [addMemberLoading, setAddMemberLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const fetchGroupData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [groupData, expensesData] = await Promise.all([
        groupsService.getOne(groupId!),
        expensesService.getByGroup(groupId!)
      ]);
      
      setGroup(groupData);
      setExpenses(expensesData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load group data');
      console.error('Error fetching group data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (groupId) {
      fetchGroupData();
    }
  }, [groupId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) {
      setSnackbar({ open: true, message: 'Please enter an email address', severity: 'error' });
      return;
    }

    try {
      setAddMemberLoading(true);
      const updatedGroup = await groupsService.addMember(groupId!, { email: newMemberEmail });
      setGroup(updatedGroup);
      setNewMemberEmail('');
      setOpenAddMember(false);
      setSnackbar({ open: true, message: 'Member added successfully', severity: 'success' });
    } catch (err: any) {
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || 'Failed to add member', 
        severity: 'error' 
      });
    } finally {
      setAddMemberLoading(false);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      console.log('Attempting to delete expense:', expenseId);
      await expensesService.delete(expenseId);
      console.log('Delete successful');
      setExpenses(expenses.filter(e => e.id !== expenseId));
      const updatedGroup = await groupsService.getOne(groupId!);
      setGroup(updatedGroup);
      setSnackbar({ open: true, message: 'Expense deleted successfully', severity: 'success' });
    } catch (err: any) {
      console.log('Delete failed:', err);
      console.log('Error response:', err.response);
      console.log('Error data:', err.response?.data);
      
      // NestJS returns errors in format: { statusCode, message, error }
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Failed to delete expense';
      
      console.log('Showing error message:', errorMessage);
      
      // Show both alert and snackbar to ensure user sees it
      alert(errorMessage);
      
      setSnackbar({ 
        open: true, 
        message: errorMessage, 
        severity: 'error' 
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
        <TopBar showAuthButtons={false} showNavigation={true} />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress sx={{ color: '#8B9D83' }} />
        </Box>
      </Box>
    );
  }

  if (error || !group) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
        <TopBar showAuthButtons={false} showNavigation={true} />
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error || 'Group not found'}
          </Alert>
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={() => navigate('/groups')}
            sx={{
              color: '#666',
              textTransform: 'none',
              '&:hover': {
                bgcolor: 'transparent',
                color: '#000'
              }
            }}
          >
            Back to Groups
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
      <TopBar showAuthButtons={false} showNavigation={true} />

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => navigate('/groups')}
          sx={{
            color: '#666',
            textTransform: 'none',
            mb: 4,
            '&:hover': {
              bgcolor: 'transparent',
              color: '#000'
            }
          }}
        >
          Back to Groups
        </Button>

        <Card
          elevation={0}
          sx={{
            p: 4,
            border: '1px solid #e5e5e5',
            borderRadius: 3,
            mb: 4
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 3,
                  bgcolor: 'rgba(184, 169, 212, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Users size={40} style={{ color: '#B8A9D4' }} />
              </Box>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: '#000' }}>
                  {group.name}
                </Typography>
                <Stack direction="row" spacing={3}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Users size={16} style={{ color: '#666' }} />
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {group.membersCount} members
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Receipt size={16} style={{ color: '#666' }} />
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {expenses.length} expenses
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Box>
            <Chip 
              label={`Last activity: ${group.lastActivity}`}
              sx={{ 
                bgcolor: '#f5f5f5',
                color: '#666',
                fontWeight: 500
              }}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Stack direction="row" spacing={6}>
            <Box>
              <Typography variant="body2" sx={{ color: '#999', mb: 0.5 }}>
                Total Spent
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#000' }}>
                {formatCurrency(group.totalSpent)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: '#999', mb: 0.5 }}>
                Per Person Average
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#000' }}>
                {formatCurrency(group.totalSpent / group.membersCount)}
              </Typography>
            </Box>
          </Stack>
        </Card>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#000' }}>
                Members
              </Typography>
              <Button
                startIcon={<UserPlus size={18} />}
                onClick={() => setOpenAddMember(true)}
                sx={{
                  color: '#8B9D83',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(139, 157, 131, 0.08)'
                  }
                }}
              >
                Add Member
              </Button>
            </Box>

            <Card
              elevation={0}
              sx={{
                border: '1px solid #e5e5e5',
                borderRadius: 3,
                overflow: 'hidden'
              }}
            >
              {group.members.map((member, index) => (
                <Box key={member.id}>
                  <Box
                    sx={{
                      p: 3,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      '&:hover': {
                        bgcolor: '#fafafa'
                      }
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: '#8B9D83',
                          width: 48,
                          height: 48,
                          fontSize: '1.1rem',
                          fontWeight: 600
                        }}
                      >
                        {member.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#000' }}>
                          {member.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          {member.email}
                        </Typography>
                      </Box>
                    </Stack>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: member.balance >= 0 ? '#4caf50' : '#f44336'
                      }}
                    >
                      {member.balance >= 0 ? '+' : ''}{formatCurrency(member.balance)}
                    </Typography>
                  </Box>
                  {index < group.members.length - 1 && <Divider />}
                </Box>
              ))}
            </Card>
          </Box>

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#000' }}>
                Recent Expenses
              </Typography>
              <Button
                startIcon={<Plus size={18} />}
                onClick={() => navigate(`/add-expense?groupId=${groupId}`)}
                variant="contained"
                sx={{
                  bgcolor: '#8B9D83',
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: '#7a8c72',
                    boxShadow: 'none'
                  }
                }}
              >
                Add Expense
              </Button>
            </Box>

            <Stack spacing={2}>
              {expenses.map((expense) => (
                <Card
                  key={expense.id}
                  elevation={0}
                  onClick={() => navigate(`/expenses/${expense.id}`)}
                  sx={{
                    p: 3,
                    border: '1px solid #e5e5e5',
                    borderRadius: 3,
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: '#8B9D83',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: '#000' }}>
                        {expense.description}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                        Paid by {expense.paidBy.name} · {expense.date}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#999' }}>
                        Split among {expense.splitAmong.length} members
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#8B9D83' }}>
                        {formatCurrency(expense.amount)}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteExpense(expense.id)}
                        sx={{
                          color: '#f44336',
                          '&:hover': {
                            bgcolor: 'rgba(244, 67, 54, 0.08)'
                          }
                        }}
                      >
                        <Trash2 size={18} />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    pt: 2,
                    borderTop: '1px solid #f5f5f5'
                  }}>
                    <DollarSign size={14} style={{ color: '#B8A9D4' }} />
                    <Typography variant="body2" sx={{ color: '#B8A9D4', fontWeight: 600 }}>
                      {formatCurrency(expense.amount / expense.splitAmong.length)} per person
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Stack>
          </Box>
        </Box>

        {/* Settlements Section */}
        {group.settlements && group.settlements.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#000', mb: 3 }}>
              Who Owes Whom
            </Typography>
            <Card
              elevation={0}
              sx={{
                border: '1px solid #e5e5e5',
                borderRadius: 3,
                overflow: 'hidden'
              }}
            >
              {group.settlements.map((settlement, index) => (
                <Box key={`${settlement.from.id}-${settlement.to.id}`}>
                  <Box
                    sx={{
                      p: 3,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      '&:hover': {
                        bgcolor: '#fafafa'
                      }
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          bgcolor: 'rgba(244, 67, 54, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.2rem'
                        }}
                      >
                        →
                      </Box>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#000' }}>
                          <span style={{ color: '#f44336' }}>{settlement.from.name}</span>
                          {' owes '}
                          <span style={{ color: '#4caf50' }}>{settlement.to.name}</span>
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          Settlement required
                        </Typography>
                      </Box>
                    </Stack>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#f44336' }}>
                      {formatCurrency(settlement.amount)}
                    </Typography>
                  </Box>
                  {index < group.settlements!.length - 1 && <Divider />}
                </Box>
              ))}
            </Card>
          </Box>
        )}
      </Container>

      <Dialog 
        open={openAddMember} 
        onClose={() => setOpenAddMember(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
          Add New Member
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Member Email"
            type="email"
            fullWidth
            variant="outlined"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            sx={{ mt: 2 }}
            placeholder="user@example.com"
            helperText="Enter the email address of an existing user"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setOpenAddMember(false)}
            sx={{ 
              textTransform: 'none',
              color: '#666'
            }}
            disabled={addMemberLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddMember}
            variant="contained"
            disabled={addMemberLoading}
            sx={{ 
              bgcolor: '#8B9D83',
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#7a8c72'
              }
            }}
          >
            {addMemberLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Add Member'}
          </Button>
        </DialogActions>
      </Dialog>

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

export default GroupDetailPage;