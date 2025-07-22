import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function useAuth() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('loggedInUser');
    if (savedUser) {
      setLoggedIn(true);
      setUserId(savedUser);
    }
  }, []);

  const handleLoginSuccess = (id) => {
    localStorage.setItem('loggedInUser', id);
    setLoggedIn(true);
    setUserId(id);
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/member/logout', {}, {
        withCredentials: true
      });
      localStorage.removeItem('loggedInUser');
      setLoggedIn(false);
      setUserId('');
      navigate('/');
      alert('로그아웃 완료');
    } catch (err) {
      console.error(err);
      alert('로그아웃 실패');
    }
  };

  return { loggedIn, userId, handleLoginSuccess, handleLogout };
}
