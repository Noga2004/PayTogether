import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LandingPage from './components/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import GroupsPage from './components/Groups';
import GroupDetailPage from './components/Group';
import ExpensesPage from './components/Expenses';
import AddExpensePage from './components/AddExpense';
import ExpenseDetailPage from './components/ExpenseDetail';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8B9D83',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/groups/:groupId" element={<GroupDetailPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/expenses/:expenseId" element={<ExpenseDetailPage />} />
          <Route path="/add-expense" element={<AddExpensePage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;