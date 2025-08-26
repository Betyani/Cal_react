import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; //useLocation 바로바로 업데이트
import axios from 'axios';
import './Header.css';  // 별도 스타일 파일로 분리 추천

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();
  const location = useLocation();


  // 로그인 상태 초기화
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/cal/member/status", { withCredentials: true });
        console.log("서버 확인값:", data);

        setNickname(data.nickname);
        setLoggedIn(true);
      }

      catch {
        setNickname('');
        setLoggedIn(false);
      }
    })();

  }, [location.pathname]);  // location 변화에 반응 → 로그인/로그아웃 직후에도 상태 업데이트

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/cal/member/logout', {
        withCredentials: true
      });
      localStorage.removeItem('loggedInUser');
      setLoggedIn(false);
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
          <Link to="/" className="nav-link nav-button">Home</Link>
        </div>
        <div className="nav-right">
          {!loggedIn && <Link to="/register" className="nav-link nav-button">회원가입</Link>}
          {!loggedIn && <Link to="/login" className="nav-link nav-button">로그인</Link>}
        </div>
        {loggedIn && (<div className="nav-right">
          <span className="user-info">{nickname}님 환영합니다</span>
          <button onClick={() => navigate('/profile/edit')} className="nav-button info">정보수정</button>
          <button onClick={handleLogout} className="nav-button logout">로그아웃</button>
        </div>
        )}
      </nav>
    </header>
  );
}
