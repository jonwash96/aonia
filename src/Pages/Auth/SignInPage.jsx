import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import * as authService from '../../services/authService';
import useUser from '../../contexts/userContext'
import './Auth.css'



export default function SignInPage() {
  const navigate = useNavigate();
  const { uid, user, setUser, destroyUID } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await authService.login({ username, password });
      setUser(user);
      navigate('/');
      console.log("@signin: user", user)
    } catch (err) {
      setError(err.error || 'Sign in failed');
    }
  }



  return (
    <main id="auth">
      <div className="inner-wrapper">

        <section className="form">
          <Link to="/" className="exit"><div>X</div></Link>
          <div className="logotype">A O N I A</div>
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