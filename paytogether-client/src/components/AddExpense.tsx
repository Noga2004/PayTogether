import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Stack,
  Alert,
  Snackbar,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { ArrowLeft, DollarSign } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TopBar from './Navbar';
import { groupsService } from '../services/groupsService';
import { expensesService } from '../services/expensesService';

interface Group {
  id: string;
  name: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
}

const AddExpensePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const groupIdParam = searchParams.get('groupId');

  const [groups, setGroups] = useState<Group[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState(groupIdParam || '');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  });

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const data = await groupsService.getAll();
      setGroups(data);
      
      if (groupIdParam && data.some(g => g.id === groupIdParam)) {
        setSelectedGroupId(groupIdParam);
      }
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to load groups',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroupId) {
      fetchGroupMembers(selectedGroupId);
    } else {
      setMembers([]);
      setSelectedMembers([]);
    }
  }, [selectedGroupId]);

  const fetchGroupMembers = async (groupId: string) => {
    try {
      const groupData = await groupsService.getOne(groupId);
      setMembers(groupData.members);
      setSelectedMembers(groupData.members.map(m => m.id));
      setSelectAll(true);
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to load group members',
        severity: 'error'
      });
    }
  };

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers(prev => {
      if (prev.includes(memberId)) {
        const newSelection = prev.filter(id => id !== memberId);
        setSelectAll(newSelection.length === members.length);
        return newSelection;
      } else {
        const newSelection = [...prev, memberId];
        setSelectAll(newSelection.length === members.length);
        return newSelection;
      }
    });
  };

  const handleSelectAllToggle = () => {
    if (selectAll) {
      setSelectedMembers([]);
      setSelectAll(false);
    } else {
      setSelectedMembers(members.map(m => m.id));
      setSelectAll(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      setSnackbar({
        open: true,
        message: 'Please enter a description',
        severity: 'error'
      });
      return;
    }

    const amountNum = parseFloat(amount);
    if (!amount || amountNum <= 0) {
      setSnackbar({
        open: true,
        message: 'Please enter a valid amount',
        severity: 'error'
      });
      return;
    }

    if (!selectedGroupId) {
      setSnackbar({
        open: true,
        message: 'Please select a group',
        severity: 'error'
      });
      return;
    }

    if (selectedMembers.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please select at least one member to split with',
        severity: 'error'
      });
      return;
    }

    try {
      setSubmitting(true);
      await expensesService.create({
        description: description.trim(),
        amount: amountNum,
        groupId: selectedGroupId,
        splitAmongIds: selectedMembers,
      });

      setSnackbar({
        open: true,
        message: 'Expense added successfully!',
        severity: 'success'
      });

      setTimeout(() => {
        navigate(`/groups/${selectedGroupId}`);
      }, 1500);
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to add expense',
        severity: 'error'
      });
      setSubmitting(false);
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

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
      <TopBar showAuthButtons={false} showNavigation={true} />

      <Container maxWidth="md" sx={{ py: 6 }}>
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => navigate(-1)}
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
          Back
        </Button>

        <Card
          elevation={0}
          sx={{
            p: 4,
            border: '1px solid #e5e5e5',
            borderRadius: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                bgcolor: 'rgba(139, 157, 131, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <DollarSign size={28} style={{ color: '#8B9D83' }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#000' }}>
                Add New Expense
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', mt: 0.5 }}>
                Split costs fairly with your group
              </Typography>
            </Box>
          </Box>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Description"
                fullWidth
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Dinner at restaurant"
                variant="outlined"
                disabled={submitting}
              />

              <TextField
                label="Amount"
                fullWidth
                required
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                variant="outlined"
                disabled={submitting}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DollarSign size={18} style={{ color: '#666' }} />
                    </InputAdornment>
                  ),
                  inputProps: { 
                    min: 0.01, 
                    step: 0.01 
                  }
                }}
              />

              <FormControl fullWidth required disabled={submitting}>
                <InputLabel>Group</InputLabel>
                <Select
                  value={selectedGroupId}
                  label="Group"
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                >
                  {groups.map((group) => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedGroupId && members.length > 0 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#000' }}>
                    Split with
                  </Typography>
                  
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectAll}
                        onChange={handleSelectAllToggle}
                        disabled={submitting}
                        sx={{
                          color: '#8B9D83',
                          '&.Mui-checked': {
                            color: '#8B9D83',
                          },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontWeight: 600, color: '#000' }}>
                        Select All ({members.length} members)
                      </Typography>
                    }
                    sx={{ mb: 1 }}
                  />

                  <Stack spacing={1} sx={{ pl: 2 }}>
                    {members.map((member) => (
                      <FormControlLabel
                        key={member.id}
                        control={
                          <Checkbox
                            checked={selectedMembers.includes(member.id)}
                            onChange={() => handleMemberToggle(member.id)}
                            disabled={submitting}
                            sx={{
                              color: '#8B9D83',
                              '&.Mui-checked': {
                                color: '#8B9D83',
                              },
                            }}
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body1" sx={{ color: '#000' }}>
                              {member.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#666' }}>
                              {member.email}
                            </Typography>
                          </Box>
                        }
                      />
                    ))}
                  </Stack>

                  {selectedMembers.length > 0 && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                        Split Amount
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#8B9D83' }}>
                        ${amount && parseFloat(amount) > 0 
                          ? (parseFloat(amount) / selectedMembers.length).toFixed(2) 
                          : '0.00'} per person
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate(-1)}
                  disabled={submitting}
                  sx={{
                    color: '#666',
                    borderColor: '#e0e0e0',
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.5,
                    '&:hover': {
                      borderColor: '#666',
                      bgcolor: 'transparent'
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={submitting}
                  sx={{
                    bgcolor: '#8B9D83',
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.5,
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: '#7a8c72',
                      boxShadow: 'none'
                    }
                  }}
                >
                  {submitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Add Expense'}
                </Button>
              </Stack>
            </Stack>
          </form>
        </Card>
      </Container>

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

export default AddExpensePage;
