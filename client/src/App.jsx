import { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
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
          {isAuthenticated && user && <p>Welcome, {user.name}</p>}
        </div>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/reports">Reports</Link>
          <Link to="/about">About</Link>
          {isAuthenticated && user?.role === 'admin' && <Link to="/admin">Admin</Link>}
          {installVisible && (
            <button type="button" onClick={handleInstallClick} className="install-button">
              Install App
            </button>
          )}
          {!isAuthenticated ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <button type="button" onClick={logout} style={{ background: 'none', border: 'none', color: '#0b4f6c', cursor: 'pointer' }}>
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
