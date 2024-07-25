import React, { useState } from 'react';
import { auth, provider } from '../config/firebase';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LoginWrapper = styled.div`
  background: lightgrey;
  padding: 20px;
  width: 400px;
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
  img {
    width: 100px;
  }
  button {
    width: 100%;
    background: darkmagenta;
    padding: 10px 20px;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 5px;
    font-size: 16px;
    border: 0;
    outline: 0;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 20px;
  }
  input {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  a {
    margin-top: 20px;
    text-decoration: none;
    color: darkmagenta;
  }
`;

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      console.log('Logged in:', userCredential.user);
      setUser(userCredential.user);
      navigate('/');
    } catch (error) {
      console.error('Error logging in with email and password:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await auth.signInWithPopup(provider);
      console.log('Logged in with Google:', result.user);
      setUser(result.user);
      navigate('/');
    } catch (error) {
      console.error('Error logging in with Google:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <LoginWrapper>
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Drive_icon_%282020%29.svg/2295px-Google_Drive_icon_%282020%29.svg.png" alt="gdrive" />
      Enter your email ID
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      Enter your password
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleEmailPasswordLogin}>Login with Email</button>
      <button onClick={signInWithGoogle}>Login with Google</button>
      <Link to="/register">Don't have an account? Register</Link>
    </LoginWrapper>
  );
};

export default Login;
