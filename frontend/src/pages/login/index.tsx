import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Tab,
  Tabs,
  Avatar,
  Alert,
  InputAdornment,
  IconButton,
  Fade,
  useTheme,
  alpha,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Login,
  PersonAdd,
  Google,
  GitHub,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

interface FormData {
  email: string;
  password: string;
  confirmPassword?: string;
  fullName?: string;
}

const LoginPage: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const { login, loginWithProvider, isAuthenticated, isLoading, error, clearError } = useAuth();
  
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Redirect if already authenticated
  const from = (location.state as any)?.from?.pathname || '/tickets';
  
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  // Clear auth errors when component mounts or tab changes
  useEffect(() => {
    if (error) {
      setAlert({ type: 'error', message: error });
      clearError();
    }
  }, [error, clearError]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setErrors({});
    setAlert(null);
    clearError();
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
    });
  };

  const handleInputChange = (field: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (tabValue === 1) { // Sign up
      if (!formData.fullName) {
        newErrors.fullName = 'Full name is required';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setAlert(null);
    
    if (!validateForm()) {
      return;
    }

    try {
      if (tabValue === 0) {
        // Sign In
        await login(formData.email, formData.password);
        // Success will be handled by redirect via isAuthenticated check
      } else {
        // Sign Up - You'll need to implement this in your apiService
        // For now, we'll show a message to implement backend registration
        setAlert({ 
          type: 'error', 
          message: 'Registration not implemented yet. Please implement signup endpoint in your backend.' 
        });
        
        // Example of how you might call a registration endpoint:
        // await apiService.register({
        //   email: formData.email,
        //   password: formData.password,
        //   fullName: formData.fullName
        // });
        // setAlert({ type: 'success', message: 'Account created successfully! Please sign in.' });
        // setTabValue(0); // Switch to sign in tab
      }
    } catch (error: any) {
      // Error is handled by the auth context and will show via the error state
      console.error('Authentication error:', error);
    }
  };

  const handleOAuthLogin = async (provider: string) => {
    try {
      setAlert(null);
      clearError();
      await loginWithProvider(provider);
    } catch (error) {
      console.error('OAuth error:', error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Fade in timeout={800}>
        <Card
          sx={{
            maxWidth: 450,
            width: '100%',
            background: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Logo and Title */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  margin: '0 auto',
                  mb: 2,
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                }}
              >
                PA
              </Avatar>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 1,
                }}
              >
                Portal Assistance
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                }}
              >
                {tabValue === 0 ? 'Welcome back! Please sign in to continue' : 'Create your account to get started'}
              </Typography>
            </Box>

            {/* Alert */}
            {alert && (
              <Fade in>
                <Alert 
                  severity={alert.type} 
                  sx={{ mb: 2 }}
                  onClose={() => setAlert(null)}
                >
                  {alert.message}
                </Alert>
              </Fade>
            )}

            {/* Auth Tabs */}
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                mb: 2,
                '& .MuiTabs-indicator': {
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                },
                '& .MuiTab-root': {
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                },
              }}
            >
              <Tab 
                icon={<Login />} 
                iconPosition="start"
                label="Sign In" 
                id="auth-tab-0"
                aria-controls="auth-tabpanel-0"
              />
              <Tab 
                icon={<PersonAdd />} 
                iconPosition="start"
                label="Sign Up" 
                id="auth-tab-1"
                aria-controls="auth-tabpanel-1"
              />
            </Tabs>

            {/* Sign In Form */}
            <TabPanel value={tabValue} index={0}>
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                  fullWidth
                  id="signin-email"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  error={!!errors.email}
                  helperText={errors.email}
                  margin="normal"
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color={errors.email ? 'error' : 'action'} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  id="signin-password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  error={!!errors.password}
                  helperText={errors.password}
                  margin="normal"
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color={errors.password ? 'error' : 'action'} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          disabled={isLoading}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} /> : <Login />}
                  sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    mb: 2,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5855eb 0%, #7c3aed 100%)',
                      boxShadow: '0 6px 20px rgba(99, 102, 241, 0.6)',
                    },
                    '&:disabled': {
                      background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                    },
                  }}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>

                {/* OAuth Buttons */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Google />}
                    disabled={isLoading}
                    onClick={() => handleOAuthLogin('google')}
                    sx={{
                      textTransform: 'none',
                      borderColor: alpha(theme.palette.divider, 0.3),
                      color: 'text.secondary',
                      '&:hover': {
                        borderColor: '#db4437',
                        color: '#db4437',
                      },
                    }}
                  >
                    Google
                  </Button>
                </Box>
              </Box>
            </TabPanel>

            {/* Sign Up Form */}
            <TabPanel value={tabValue} index={1}>
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                  fullWidth
                  id="signup-fullname"
                  label="Full Name"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange('fullName')}
                  error={!!errors.fullName}
                  helperText={errors.fullName}
                  margin="normal"
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color={errors.fullName ? 'error' : 'action'} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  id="signup-email"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  error={!!errors.email}
                  helperText={errors.email}
                  margin="normal"
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color={errors.email ? 'error' : 'action'} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  id="signup-password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  error={!!errors.password}
                  helperText={errors.password}
                  margin="normal"
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color={errors.password ? 'error' : 'action'} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          disabled={isLoading}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  id="signup-confirm-password"
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  margin="normal"
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color={errors.confirmPassword ? 'error' : 'action'} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} /> : <PersonAdd />}
                  sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5855eb 0%, #7c3aed 100%)',
                      boxShadow: '0 6px 20px rgba(99, 102, 241, 0.6)',
                    },
                    '&:disabled': {
                      background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                    },
                  }}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </Box>
            </TabPanel>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
};

export default LoginPage;