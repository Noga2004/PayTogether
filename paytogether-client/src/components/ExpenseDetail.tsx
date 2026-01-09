import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  Avatar,
  Stack,
  Divider,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { ArrowLeft, Receipt, User, Users, Calendar, DollarSign } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import TopBar from './Navbar';
import { expensesService, ExpenseDetail as ExpenseDetailType } from '../services/expensesService';

const ExpenseDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { expenseId } = useParams<{ expenseId: string }>();

  const [expense, setExpense] = useState<ExpenseDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (expenseId) {
      fetchExpense();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenseId]);

  const fetchExpense = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await expensesService.getOne(expenseId!);
      setExpense(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load expense');
      console.error('Error fetching expense:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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

  if (error || !expense) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
        <TopBar showAuthButtons={false} showNavigation={true} />
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error || 'Expense not found'}
          </Alert>
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={() => navigate(-1)}
            sx={{
              color: '#666',
              textTransform: 'none',
              '&:hover': {
                bgcolor: 'transparent',
                color: '#000'
              }
            }}
          >
            Back
          </Button>
        </Container>
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

        {/* Expense Header Card */}
        <Card
          elevation={0}
          sx={{
            p: 4,
            border: '1px solid #e5e5e5',
            borderRadius: 3,
            mb: 4
          }}
        >
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', mb: 3 }}>
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: 3,
                bgcolor: 'rgba(139, 157, 131, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Receipt size={36} style={{ color: '#8B9D83' }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: '#000' }}>
                {expense.description}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip
                  label={expense.group.name}
                  onClick={() => navigate(`/groups/${expense.group.id}`)}
                  sx={{
                    bgcolor: '#f5f5f5',
                    color: '#666',
                    fontWeight: 500,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: '#e0e0e0'
                    }
                  }}
                />
                <Stack direction="row" spacing={1} alignItems="center">
                  <Calendar size={16} style={{ color: '#666' }} />
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {expense.date}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body2" sx={{ color: '#999', mb: 0.5 }}>
                Total Amount
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#8B9D83' }}>
                {formatCurrency(expense.amount)}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" sx={{ color: '#999', mb: 0.5 }}>
                Per Person
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#000' }}>
                {formatCurrency(expense.amount / expense.splitAmong.length)}
              </Typography>
            </Box>
          </Box>
        </Card>

        {/* Paid By Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#000', mb: 2 }}>
            Paid By
          </Typography>
          <Card
            elevation={0}
            sx={{
              p: 3,
              border: '1px solid #e5e5e5',
              borderRadius: 3,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: '#8B9D83',
                  width: 56,
                  height: 56,
                  fontSize: '1.5rem',
                  fontWeight: 600
                }}
              >
                {expense.paidBy.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#000' }}>
                  {expense.paidBy.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {expense.paidBy.email}
                </Typography>
              </Box>
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  bgcolor: 'rgba(139, 157, 131, 0.1)',
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <User size={18} style={{ color: '#8B9D83' }} />
                  <Typography variant="body2" sx={{ color: '#8B9D83', fontWeight: 600 }}>
                    Payer
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Card>
        </Box>

        {/* Split Among Section */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#000' }}>
              Split Among
            </Typography>
            <Chip
              icon={<Users size={16} />}
              label={`${expense.splitAmong.length} ${expense.splitAmong.length === 1 ? 'person' : 'people'}`}
              sx={{
                bgcolor: '#f5f5f5',
                color: '#666',
                fontWeight: 500
              }}
            />
          </Box>
          <Card
            elevation={0}
            sx={{
              border: '1px solid #e5e5e5',
              borderRadius: 3,
              overflow: 'hidden'
            }}
          >
            {expense.splitAmong.map((member, index) => (
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
                        bgcolor: member.id === expense.paidBy.id ? '#8B9D83' : '#B8A9D4',
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
                        {member.id === expense.paidBy.id && (
                          <Chip
                            label="Paid"
                            size="small"
                            sx={{
                              ml: 1,
                              height: 20,
                              fontSize: '0.7rem',
                              bgcolor: 'rgba(139, 157, 131, 0.15)',
                              color: '#8B9D83',
                              fontWeight: 600
                            }}
                          />
                        )}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        {member.email}
                      </Typography>
                    </Box>
                  </Stack>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#000' }}>
                      {formatCurrency(member.share)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#999' }}>
                      their share
                    </Typography>
                  </Box>
                </Box>
                {index < expense.splitAmong.length - 1 && <Divider />}
              </Box>
            ))}
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

export default ExpenseDetailPage;
