import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; //useLocation 바로바로 업데이트
import axios from 'axios';
import './Header.css';  // 별도 스타일 파일로 분리 추천

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // 로그인 상태 초기화
  useEffect(() => {
    const savedUser = localStorage.getItem('loggedInUser');
    setLoggedIn(!!savedUser);
    setUserId(savedUser || '');
  }, [location]);  // location 변화에 반응 → 로그인/로그아웃 직후에도 상태 업데이트

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/cal/member/logout', {}, {
        withCredentials: true
      });
      localStorage.removeItem('loggedInUser');
      setLoggedIn(false);
      setUserId('');
      navigate('/');
      alert('로그아웃 완료');
    } catch (err) {
      console.error('로그아웃 실패', err);
      alert('로그아웃 실패');
    }
  };

  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-left">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/register" className="nav-link">회원가입</Link>
          {!loggedIn && <Link to="/login" className="nav-link">로그인</Link>}
        </div>
        {loggedIn && (
          <div className="nav-right">
            <span className="user-info">환영합니다, {userId}</span>
            <button onClick={handleLogout} className="logout-button">로그아웃</button>
          </div>
        )}
      </nav>
    </header>
  );
}
