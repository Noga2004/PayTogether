import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Card,
  Stack,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Filter, Download, Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TopBar from './Navbar';
import { expensesService, MonthGroup } from '../services/expensesService';

const ExpensesPage: React.FC = () => {
  const navigate = useNavigate();
  const [monthGroups, setMonthGroups] = useState<MonthGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await expensesService.getAll();
      setMonthGroups(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load expenses');
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
      <TopBar showAuthButtons={false} showNavigation={true} />

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 5 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: '#000' }}>
              Recent Expenses
            </Typography>
            <Typography variant="h6" sx={{ color: '#666', fontWeight: 400 }}>
              Track all shared spending across your groups.
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button
              startIcon={<Filter size={18} />}
              variant="outlined"
              sx={{
                color: '#666',
                borderColor: '#e0e0e0',
                textTransform: 'none',
                fontWeight: 500,
                px: 3,
                py: 1,
                borderRadius: 2,
                '&:hover': {
                  borderColor: '#8B9D83',
                  bgcolor: 'rgba(139, 157, 131, 0.04)'
                }
              }}
            >
              Filter
            </Button>
            <Button
              startIcon={<Download size={18} />}
              variant="outlined"
              sx={{
                color: '#666',
                borderColor: '#e0e0e0',
                textTransform: 'none',
                fontWeight: 500,
                px: 3,
                py: 1,
                borderRadius: 2,
                '&:hover': {
                  borderColor: '#8B9D83',
                  bgcolor: 'rgba(139, 157, 131, 0.04)'
                }
              }}
            >
              Export
            </Button>
          </Stack>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
            <CircularProgress sx={{ color: '#8B9D83' }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : monthGroups.length === 0 ? (
          <Card
            elevation={0}
            sx={{
              p: 8,
              border: '1px solid #e5e5e5',
              borderRadius: 3,
              textAlign: 'center'
            }}
          >
            <Receipt size={64} style={{ color: '#ccc', marginBottom: 16 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: '#666' }}>
              No expenses yet
            </Typography>
            <Typography variant="body1" sx={{ color: '#999' }}>
              Start tracking expenses in your groups
            </Typography>
          </Card>
        ) : (
          <Stack spacing={4}>
            {monthGroups.map((monthGroup) => (
            <Box key={monthGroup.month}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 3
              }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#000' }}>
                  {monthGroup.month}
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', fontWeight: 500 }}>
                  Total: {formatCurrency(monthGroup.total)}
                </Typography>
              </Box>

              <Card
                elevation={0}
                sx={{
                  border: '1px solid #e5e5e5',
                  borderRadius: 3,
                  overflow: 'hidden'
                }}
              >
                {monthGroup.expenses.map((expense, index) => (
                  <Box key={expense.id}>
                    <Box
                      onClick={() => navigate(`/expenses/${expense.id}`)}
                      sx={{
                        p: 3,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'background-color 0.2s',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: '#fafafa'
                        }
                      }}
                    >
                      <Stack direction="row" spacing={3} alignItems="center" sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            bgcolor: '#f5f5f5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Receipt size={24} style={{ color: '#999' }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: '#000' }}>
                            {expense.description}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            {expense.paidBy} paid · {expense.date}
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={3} alignItems="center">
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: '#000' }}>
                            {formatCurrency(expense.amount)}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#999', fontSize: '0.875rem' }}>
                            {expense.group}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                    {index < monthGroup.expenses.length - 1 && <Divider />}
                  </Box>
                ))}
              </Card>
            </Box>
          ))}
          </Stack>
        )}

        {!loading && !error && monthGroups.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Button
              sx={{
                color: '#666',
                textTransform: 'none',
                fontWeight: 500,
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                '&:hover': {
                  bgcolor: '#f5f5f5'
                }
              }}
            >
              Load more expenses
            </Button>
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
    </Box>
  );
};

export default ExpensesPage;