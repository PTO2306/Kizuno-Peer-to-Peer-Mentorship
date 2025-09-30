import { Routes, Route, BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import AuthGuard from "./auth/AuthGuard";
import Notification from "./components/Notification";

// Layout
import Layout from './components/Layout';

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import { ProfileProvider } from "./auth/ProfileContext";
import ProfilePage from "./pages/ProfilePage";

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

            {/* Protected routes with layout */}
            <Route
              element={
                <AuthGuard requireProfile={true}>
                  <Layout />
                </AuthGuard>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            <Route
              path="/onboarding"
              element={
                <AuthGuard>
                  <OnboardingPage />
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
