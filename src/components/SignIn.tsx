import { Box, Button, Card, Stack, Typography } from "@mui/material";
import { ArrowRight } from 'lucide-react';

interface SignInProps {
    setCurrentView: (view: 'landing' | 'signup' | 'signin') => void;
}

const SignIn = ({ setCurrentView }: SignInProps) => {
    return <Box sx={{ 
        minHeight: '100vh', 
        bgcolor: '#fafafa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3
        }}>
        <Box sx={{ width: '100%', maxWidth: 500 }}>
            <Button 
            onClick={() => setCurrentView('landing')}
            startIcon={<ArrowRight size={20} style={{ transform: 'rotate(180deg)' }} />}
            sx={{ color: '#666', textTransform: 'none', mb: 5, fontWeight: 500 }}
            >
            Back to Home
            </Button>

            <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Box sx={{ width: 90, height: 90, position: 'relative', mx: 'auto', mb: 3 }}>
                <Box sx={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                bgcolor: '#8B9D83',
                position: 'absolute',
                left: 0,
                top: 10
                }} />
                <Box sx={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                bgcolor: '#B8A9D4',
                position: 'absolute',
                right: 0,
                top: 0
                }} />
            </Box>

            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1.5 }}>
                Welcome back
            </Typography>
            <Typography variant="h6" sx={{ color: '#666', fontWeight: 400, mb: 2 }}>
                Sign in to access your shared expenses
            </Typography>
            </Box>

            <Card elevation={0} sx={{ p: 5, borderRadius: 3, border: '1px solid #e5e5e5' }}>
            <Stack spacing={3.5}>
                <Box>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 1.5 }}>
                    Email address
                </Typography>
                <Box sx={{
                    border: '2px solid #e5e5e5',
                    borderRadius: 2.5,
                    p: 2.5,
                    '&:focus-within': {
                    borderColor: '#8B9D83',
                    boxShadow: '0 0 0 4px rgba(139, 157, 131, 0.1)'
                    }
                }}>
                    <input
                    type="email"
                    placeholder="you@example.com"
                    style={{
                        border: 'none',
                        outline: 'none',
                        width: '100%',
                        fontSize: '1rem',
                        fontFamily: 'inherit',
                        backgroundColor: 'transparent'
                    }}
                    />
                </Box>
                </Box>

                <Box>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 1.5 }}>
                    Password
                </Typography>
                <Box sx={{
                    border: '2px solid #e5e5e5',
                    borderRadius: 2.5,
                    p: 2.5,
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
                    style={{
                        border: 'none',
                        outline: 'none',
                        width: '100%',
                        fontSize: '1rem',
                        fontFamily: 'inherit',
                        backgroundColor: 'transparent'
                    }}
                    />
                </Box>
                <Box sx={{ textAlign: 'right', mt: 1.5 }}>
                    <Button sx={{ 
                    color: '#666', 
                    textTransform: 'none',
                    p: 0,
                    '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                    }}>
                    Forgot password?
                    </Button>
                </Box>
                </Box>

                <Button
                variant="contained"
                fullWidth
                sx={{
                    bgcolor: '#8B9D83',
                    py: 2,
                    fontSize: '1.05rem',
                    textTransform: 'none',
                    borderRadius: 2.5,
                    fontWeight: 600,
                    mt: 1,
                    '&:hover': { bgcolor: '#7a8c72' }
                }}
                >
                Sign in
                </Button>
            </Stack>
            </Card>

            <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body1" sx={{ color: '#666' }}>
                Don't have an account?{' '}
                <Button 
                onClick={() => setCurrentView('signup')}
                sx={{ 
                    color: '#000', 
                    textTransform: 'none',
                    fontWeight: 600,
                    p: 0,
                    '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                }}
                >
                Sign up
                </Button>
            </Typography>
            </Box>
        </Box>
    </Box>    
};

export default SignIn;