import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router';
import * as authService from '../../services/authService';
import { UserContext } from "../../contexts/UserContext";
import './Auth.css'

export default function SignInPage() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await authService.signIn({ username, password });
      setUser(user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Sign in failed');
    }
  }

  return (
    <main id="auth">
      <div className="inner-wrapper">
        <section className="graphic">
          $
        </section>

        <section className="form">
          <Link to="/" className="exit"><div>X</div></Link>
          <div className="logotype">$pend Sense</div>
          <h1>Sign In</h1>
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <label>Username:</label>
            <input id="username" 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            autoComplete="username" 
            />

            <label>Password:</label>
            <input id="password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            autoComplete="current-password" 
            />

            <button type="submit">Sign In</button>
          </form>

          <p>Don't have an account? <Link to="/sign-up">Sign Up</Link></p>
        </section>
      </div>
    </main>
  );
}