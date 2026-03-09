import { useState, useContext } from 'react';
import useUser from "../../contexts/userContext";
import { useNavigate, Link } from 'react-router';
import * as authService from '../../services/authService';
import './Auth.css'



export default function SignUpPage() {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayname, setDisplayname] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username) return setError("Username is required.");
    if (!username > 5) return setError("Username must be at least 6 characters.");
    if (!password) return setError("Password is required.");
    if (!/[\?\!\.\,\{\}&\*\@\$\%\d]/g.test(password)) return setError("Password Must include at least one of the following symbols: ? ! . , { } * @ $ %  and at least 1 digit.");
    if (!password.length > 7) return setError("Password must be at least 8 characters.");
    if (username === password) return setError("Username cannot match password");

    try {
      const user = await authService.register({ username, password, displayname });
      setUser(user);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Sign up failed');
    }
  };



  return (
    <main id="auth">
      <div className="inner-wrapper">
        <section className="form">
        <Link to="/" className="exit"><div>X</div></Link>
          <div className="logotype">AONIA</div>
          <h1>Sign Up</h1>
          {error && <p style={{ color: '#f44', width: '520px', textAlign: 'center' }}>{error}</p>}

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
                value={displayname}
                onChange={(e) => setDisplayname(e.target.value)}
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

          <p>Already have an account? <a href="/login">Sign In</a></p>
        </section>
      </div>
    </main>
  );
}