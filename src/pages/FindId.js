import { useState,useEffect} from 'react';
import axios from 'axios';
import styles from './Find.module.css';
import { useNavigate } from 'react-router-dom';

const joinFullName = (fam, giv) => {
  const f = (fam ?? '').trim();
  const g = (giv ?? '').trim();
  return f && g ? `${f} ${g}` : (f || g); 
};
export default function FindId() {
  const [form, setForm] = useState({ name: '', email: '' });
  const [firstName, setfirstName] = useState(''); // 姓
  const [lastName, setlastName] = useState('');   // 名
  
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setForm(prev => ({ ...prev, name: joinFullName(firstName, lastName) }));
  }, [firstName, lastName]);

  useEffect(() => {
    setForm(prev => ({ ...prev, name: joinFullName(firstName, lastName) }));
  }, [firstName, lastName]);

  const onChangeEmail = (e) => {
    setForm(prev => ({ ...prev, email: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !form.email.trim()) return;

    try {
    setLoading(true);
    const { data } = await axios.get('http://localhost:8080/cal/member/find-id-by', {
      params: { name: form.name.trim(), email: form.email.trim() },
      withCredentials: true,
    });

      setResult(`ご登録のID: ${data.id}`);
    } catch (err) {
      setResult('該当する情報がありません。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <h2 className={styles.title}>ID確認</h2>
        <form onSubmit={onSubmit} className={styles.form}>
          {/* 姓/名 분리 */}
          <div className={styles.formRow}>
            <label className={styles.label}>姓</label>
            <input
              className={styles.input}
              name="familyName"
              value={firstName}
              onChange={(e) => setfirstName(e.target.value)}
              required
              placeholder="例）坂本"
            />
          </div>
          <div className={styles.formRow}>
            <label className={styles.label}>名</label>
            <input
              className={styles.input}
              name="givenName"
              value={lastName}
              onChange={(e) => setlastName(e.target.value)}
              required
              placeholder="例）太郎"
            />
          </div>

          {/* 이메일 */}
          <div className={styles.formRow}>
            <label className={styles.label}>メールアドレス</label>
            <input
              className={styles.input}
              type="email"
              name="email"
              value={form.email}
              onChange={onChangeEmail}
              required
              placeholder="email@example.com"
            />
          </div>

          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? '確認中' : '確認'}
          </button>
        </form>

        {result && <p className={styles.result}>{result}</p>}

        <div className={styles.subActions}>
          <button className={styles.linkBtn} onClick={() => navigate('/login')}>ログインへ</button>
        </div>
      </div>
    </div>
  );
}