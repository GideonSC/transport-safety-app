import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);

    try {
      await register(form);
      navigate('/reports');
    } catch (err) {
      const message = err?.response?.data?.message || err.message || 'Registration failed';
      setStatus(message);
    }
  };

  return (
    <section className="card">
      <h2>Create your account</h2>
      {status && <p>{status}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" type="text" value={form.name} onChange={handleChange} required />
        </label>

        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>

        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={handleChange} required minLength={8} />
        </label>

        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </section>
  );
}
