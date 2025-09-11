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

        setNickname(data.nickname || data.id);
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
      await axios.post('http://localhost:8080/cal/member/logout', {}, {
        withCredentials: true
      });
      localStorage.removeItem('loggedInUser');
      setLoggedIn(false);
      if (window.location.pathname === "/") {
        // 이미 /라면 강제 새로고침
        window.location.reload();
      } else {
        // 다른 페이지라면 /로 이동
        navigate("/", { replace: true });
      }
      alert('ログアウトしました。');
    } catch (err) {
      console.error('로그아웃 실패', err);
      alert('ログアウトに失敗しました。');
    }
  };

  const handleHome = async () => {
    if (window.location.pathname === "/") {
      // 이미 /라면 강제 새로고침
      window.location.reload();
    } else {
      // 다른 페이지라면 /로 이동
      navigate("/", { replace: true });
    }
  };




  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-left">
          <button onClick={handleHome} className="nav-button">Home</button>
        </div>
        <div className="nav-right">
          {!loggedIn && <Link to="/register" className="nav-button">会員登録</Link>}
          {!loggedIn && <Link to="/login" className="nav-button">ログインへ</Link>}
        </div>
        {loggedIn && (
          <div className="nav-right">
            <span className="user-info">{nickname}様 ようこそ</span>
            <button onClick={() => navigate('/profile/edit')} className="nav-button">マイページ</button>
            <button onClick={handleLogout} className="nav-button logout">ログアウト</button>
          </div>
        )}
      </nav>
    </header>
  );
}
