import { useState } from 'react';
import axios from 'axios';
import styles from './Find.module.css';
import { useNavigate } from 'react-router-dom';

export default function FindPassword() {
  const [form, setForm] = useState({ id: '', email: '' });
  const [notice, setNotice] = useState('');
  const [tempPw, setTempPw] = useState('');
  const [loading, setLoading] = useState(false);
   const [reveal, setReveal] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.id.trim() || !form.email.trim()) return;

    try {
  setLoading(true);

  
  const { data } = await axios.post(
    'http://localhost:8080/cal/member/reset-password-request',
    {
      id: form.id.trim(),
      email: form.email.trim().toLowerCase(),
    }
  );

  setNotice(data.message || '임시 비밀번호가 발급되었습니다.');
  setTempPw(data.tempPassword || '');
  setReveal(false);
} catch (err) {
  setNotice(err.response?.data?.message || '일치하는 계정이 없거나 요청 실패');
  setTempPw('');
} finally {
  setLoading(false);
}
  };



  const copyTempPw = async () => {
    try {
      await navigator.clipboard.writeText(tempPw);
      alert('임시 비밀번호가 복사되었습니다.');
    } catch {
      alert('복사 실패. 수동으로 복사하세요.');
    }
  };



  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <h2 className={styles.title}>비밀번호 찾기</h2>
        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <label className={styles.label}>아이디</label>
            <input className={styles.input} name="id" value={form.id} onChange={onChange} required />
          </div>
          <div className={styles.formRow}>
            <label className={styles.label}>이메일</label>
            <input className={styles.input} type="email" name="email" value={form.email} onChange={onChange} required />
          </div>
          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? '요청 중…' : '임시 비밀번호 발급'}
          </button>
        </form>

        {notice && <p className={styles.result}>{notice}</p>}



{/* 임시 비밀번호 박스 */}
        {tempPw && (
  <div className={styles.tempBox}>
    <div className={styles.tempHint}>
      아래 임시 비밀번호로 로그인한 뒤, 마이페이지에서 꼭 새 비밀번호로 변경하세요.
    </div>

    <div className={styles.tempRow}>
      <input
        className={`${styles.input} ${styles.tempInput}`}
        type={reveal ? 'text' : 'password'}
        value={tempPw}
        readOnly
      />
      <button className={styles.linkBtn} onClick={() => setReveal(!reveal)} type="button">
        {reveal ? '가리기' : '보기'}
      </button>
      <button className={styles.linkBtn} onClick={copyTempPw} type="button">
        복사
      </button>
    </div>

    <div className={styles.tempActions}>
      <button className={styles.linkBtn} onClick={() => navigate('/login')} type="button">
        로그인으로 이동
      </button>
    </div>
  </div>
  )}
 </div>
</div>
 );
}
