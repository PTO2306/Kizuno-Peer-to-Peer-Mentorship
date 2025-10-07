import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Link as RouterLink } from 'react-router';
import { useAuth } from '../Data/AuthContext';
import z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, CircularProgress, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import Email from '@mui/icons-material/Email';
import Lock from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const loginSchema = z.object({
  email: z
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(1, 'Password is required')
  // .min(6, 'Password must be at least 6 characters'),
});
type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data);
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError('root', {
        type: 'manual',
        message: 'An unexpected error occurred. Please try again.',
      });
      console.error(err);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Paper
          elevation={3}
          className="p-8 rounded-xl shadow-xl bg-white"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Typography
              component="h1"
              variant="h4"
              className="font-bold text-gray-900 mb-2"
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body2"
              className="text-gray-600"
            >
              Sign in to your account to continue
            </Typography>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              className="w-full mb-6 rounded-lg"
            >
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email Address"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  className="bg-white"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email className="text-gray-400" />
                      </InputAdornment>
                    ),
                    className: "rounded-lg",
                  }}
                />
              )}
            />

            {/* Password Field */}
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  className="bg-white"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock className="text-gray-400" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    className: "rounded-lg",
                  }}
                />
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              className="py-3 rounded-lg font-semibold text-base normal-case shadow-lg transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center">
                  <CircularProgress size={20} className="mr-2 text-white" />
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </Button>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <Typography variant="body2" className="text-gray-600">
                Don't have an account?{' '}
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="text"
                  className="font-semibold text-blue-600 hover:text-blue-700 normal-case p-0 min-w-0 hover:bg-transparent underline-offset-2 hover:underline"
                >
                  Sign up
                </Button>
              </Typography>
            </div>
          </form>
        </Paper>
      </div>
    </div>
  );
};

export default LoginPage;
