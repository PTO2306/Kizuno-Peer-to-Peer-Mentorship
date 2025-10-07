import { useLocation } from 'react-router';
import { NotificationProvider } from './components/NotificationContext';
import { AuthProvider } from './Data/AuthContext';
import { ProfileProvider } from './Data/ProfileContext';
import { BrowserRouter, Route, Routes } from 'react-router';
import NavBar from './components/UI components/navbar/NavBar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuthGuard from './Data/AuthGuard';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import OnboardingPage from './pages/OnboardingPage';
import { ListingProvider } from './Data/ListingContext';

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <ProfileProvider>
          <ListingProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </ListingProvider>
        </ProfileProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const navbarRoutes = ['/dashboard', '/profile'];
  const showNavbar = navbarRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <NavBar />}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <AuthGuard requireProfile={true}>
            <DashboardPage />
          </AuthGuard>
        } />

        <Route path="/profile" element={
          <AuthGuard requireProfile={true}>
            <ProfilePage />
          </AuthGuard>
        } />

        <Route
          path="/onboarding"
          element={
            <AuthGuard>
              <OnboardingPage />
            </AuthGuard>
          }
        />
      </Routes>
    </>
  );
}

export default App;
