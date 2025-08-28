import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import account from './Account.module.css';

export default function Login() {
  const [form, setForm] = useState({ id: '', pw: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {    //로그인 아이디 비번 입력가능
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8080/cal/member/login',
        { id: form.id, password: form.pw },
        { withCredentials: true }
        
      );
      if (response.status === 200) {
        alert('로그인 성공');
        navigate('/', { replace: true });
        localStorage.setItem('loggedInUser', JSON.stringify(response.data)); //로그인 성공 시 로컬 저장
      }
    } catch {
      alert('로그인 실패');
      localStorage.removeItem('loggedInUser');
    }
    
  };

  return (
    <div className={account.wrap}>
      <div className={account.card}>
        <h2 className={account.title}>로그인</h2>
        <form onSubmit={handleLogin} className={account.form}>
          <div className={account.formRow}>
            <label className={account.label}>아이디</label>
            <input
              type="text"
              name="id"
              value={form.id}
              onChange={handleChange}
              required
              className={account.input}
              placeholder="아이디"
            />
          </div>
          <div className={account.formRow}>
            <label className={account.label}>비밀번호</label>
            <input
              type="password"
              name="pw"
              value={form.pw}
               onChange={ handleChange}
              required
              className={account.input}
              placeholder="비밀번호"
            />
          </div>
          <button type="submit" className={account.button}>
            로그인
          </button>
        </form>


        <div className={account.subActions}>
          <button
            type="button"
            className={account.ghostButton}
            onClick={() => navigate('/find-id')}
          >
            아이디 찾기
          </button>
          <span className={account.divider} />
          <button
            type="button"
            className={account.ghostButton}
            onClick={() => navigate('/find-password')}
          >
            비밀번호 찾기
          </button>
        </div>
      </div>
    </div>
  );
}
