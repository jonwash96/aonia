import { useState, useContext } from 'react';
import { UserContext } from "../../contexts/UserContext";
import { useNavigate, Link } from 'react-router';
import * as authService from '../../services/authService';
import './Auth.css'

export default function SignUpPage() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const user = await authService.signUp({ username, password, displayName });
      setUser(user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Sign up failed');
    }
  };

  return (
    <main id="auth">
      <div className="inner-wrapper">
        <section className="form">
        <Link to="/" className="exit"><div>X</div></Link>
          <div className="logotype">$pend Sense</div>
          <h1>Sign Up</h1>
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <form onSubmit={handleSubmit}>
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <label>Display Name:</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />

              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

            <button type="submit">Sign Up</button>
          </form>

          <p>Already have an account? <a href="/sign-in">Sign In</a></p>
        </section>

        <section className="graphic">
          $
        </section>
      </div>
    </main>
  );
}