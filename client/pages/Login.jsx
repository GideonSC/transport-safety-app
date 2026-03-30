import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);

    try {
      await login(form);
      navigate('/reports');
    } catch (err) {
      const message = err?.response?.data?.message || err.message || 'Login failed';
      setStatus(message);
    }
  };

  return (
    <section className="card">
      <h2>Sign in to your account</h2>
      {status && <p>{status}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>

        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </label>

        <button type="submit">Login</button>
      </form>
      <p>
        Need an account? <Link to="/register">Register</Link>
      </p>
    </section>
  );
}
