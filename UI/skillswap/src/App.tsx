import { Routes, Route, BrowserRouter } from 'react-router';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './components/ProtectedRoutes';
import Notification from './components/Notification';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';

function App() {
    return (
        <AuthProvider>
          <BrowserRouter>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    
                    {/* Protected routes */}
                    <Route 
                        path="/onboarding" 
                        element={
                            <ProtectedRoute>
                                <OnboardingPage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/dashboard" 
                        element={
                            <ProtectedRoute requireProfile={true}>
                                <DashboardPage />
                            </ProtectedRoute>
                        } 
                    />
                </Routes>
                <Notification />
         </BrowserRouter>
        </AuthProvider>
    );
}

export default App;