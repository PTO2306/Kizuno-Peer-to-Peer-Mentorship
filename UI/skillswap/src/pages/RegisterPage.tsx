import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router';
import { useAuth } from '../auth/AuthContext';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Alert, Button, CircularProgress, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import Email from '@mui/icons-material/Email';
import Lock from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const registerSchema = z.object({
  email: z
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, loading, error } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const result = await register({
        email: data.email,
        password: data.password,
      });
      if (result.success) {
        navigate('/login');
      }
    } catch (err: unknown) {
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

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
              Create Account
            </Typography>
            <Typography
              variant="body2"
              className="text-gray-600"
            >
              Join us and start your journey today
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

          {/* Register Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

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
                  autoComplete="new-password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  className="bg-white"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {/* <Lock className="text-gray-400" /> */}
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

            {/* Confirm Password Field */}
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
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
                          aria-label="toggle confirm password visibility"
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
              className="py-3 rounded-lg font-semibold text-base normal-case shadow-lg transition-all duration-200 mt-6"
            >
              {loading ? (
                <div className="flex items-center">
                  <CircularProgress size={20} className="mr-2 text-white" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </Button>

            {/* Sign In Link */}
            <div className="text-center mt-6">
              <Typography variant="body2" className="text-gray-600">
                Already have an account?{' '}
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="text"
                  className="font-semibold text-blue-600 hover:text-blue-700 normal-case p-0 min-w-0 hover:bg-transparent underline-offset-2 hover:underline"
                >
                  Sign in
                </Button>
              </Typography>
            </div>
          </form>
        </Paper>
      </div>
    </div>
  );
};

export default Register;
