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

      setNotice(data.message || '仮パスワードが発行されました。');
      setTempPw(data.tempPassword || '');
      setReveal(false);
    } catch (err) {
      setNotice(err.response?.data?.message || '該当するアカウントがないか、リクエストが失敗しました。');
      setTempPw('');
    } finally {
      setLoading(false);
    }
  };



  const copyTempPw = async () => {
    try {
      await navigator.clipboard.writeText(tempPw);
      alert('仮パスワードがコピーされました');
    } catch {
      alert('コピーできませんでした。');
    }
  };



  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <h2 className={styles.title}>パスワード再設定</h2>
        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <label className={styles.label}>ユーザーID</label>
            <input className={styles.input} name="id" value={form.id} onChange={onChange} required />
          </div>
          <div className={styles.formRow}>
            <label className={styles.label}>メールアドレス</label>
            <input className={styles.input} type="email" name="email" value={form.email} onChange={onChange} required />
          </div>
          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? '処理中…' : '仮パスワード発行'}
          </button>
        </form>

        {notice && <p className={styles.result}>{notice}</p>}



        {/* 임시 비밀번호 박스 */}
        {tempPw && (
          <div className={styles.tempBox}>
            <div className={styles.tempHint}>
              以下の仮パスワードでログイン後、マイページにてパスワードの変更をお願いいたします。
            </div>

            <div className={styles.tempRow}>
              <input
                className={`${styles.input} ${styles.tempInput}`}
                type={reveal ? 'text' : 'password'}
                value={tempPw}
                readOnly
              />
              <button className={styles.linkBtn} onClick={() => setReveal(!reveal)} type="button">
                {reveal ? '非表示' : '表示'}
              </button>
              <button className={styles.linkBtn} onClick={copyTempPw} type="button">
                コピー
              </button>
            </div>

            <div className={styles.tempActions}>
              <button className={styles.linkBtn} onClick={() => navigate('/login')} type="button">
                ログインへ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
