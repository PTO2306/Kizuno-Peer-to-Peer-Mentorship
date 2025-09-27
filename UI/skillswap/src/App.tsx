import { Routes, Route, BrowserRouter } from 'react-router';
import { AuthProvider } from './auth/AuthContext';
import AuthGuard from './auth/AuthGuard';
import Notification from './components/Notification';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import { ProfileProvider } from './auth/ProfileContext';

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
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
                <AuthGuard>
                  <OnboardingPage />
                </AuthGuard>
              }
            />
            <Route
              path="/dashboard"
              element={
                <AuthGuard requireProfile={true}>
                  <DashboardPage />
                </AuthGuard>
              }
            />
          </Routes>
          <Notification />
        </BrowserRouter>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;