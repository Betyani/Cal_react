import { useState } from 'react';
import axios from 'axios';
import styles from './Find.module.css';
import { useNavigate } from 'react-router-dom';

export default function FindId() {
  const [form, setForm] = useState({ name: '', email: '' });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;

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
          <div className={styles.formRow}>
            <label className={styles.label}>名前</label>
            <input className={styles.input} name="name" value={form.name} onChange={onChange} required />
          </div>
          <div className={styles.formRow}>
            <label className={styles.label}>メールアドレス</label>
            <input className={styles.input} type="email" name="email" value={form.email} onChange={onChange} required />
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