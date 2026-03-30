import { useEffect, useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Home from '../pages/Home';
import Reports from '../pages/Reports';
import About from '../pages/About';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AdminDashboard from '../pages/AdminDashboard';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminRoute from '../components/AdminRoute';
import { useAuth } from '../context/AuthContext';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

function App() {
  const { isAuthenticated, user, logout } = useAuth();
  const online = useNetworkStatus();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installVisible, setInstallVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setInstallVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallVisible(false);
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="app-shell">
      {!online && <div className="offline-banner">You are offline. Cached data may be available.</div>}
      <header className="app-header">
        <div>
          <h1>Public Transit Safety</h1>
          <p className="page-tagline">Report incidents quickly, share exact location details, and keep every journey safer.</p>
          {isAuthenticated && user && <p className="welcome-text">Welcome, {user.name}</p>}
        </div>

        <nav>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Home
          </NavLink>
          <NavLink to="/reports" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Reports
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            About
          </NavLink>
          {isAuthenticated && user?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Admin
            </NavLink>
          )}
          {installVisible && (
            <button type="button" onClick={handleInstallClick} className="install-button">
              Install App
            </button>
          )}
          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Login
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Register
              </NavLink>
            </>
          ) : (
            <button type="button" onClick={logout} className="text-button">
              Logout
            </button>
          )}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
