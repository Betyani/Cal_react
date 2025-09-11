import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './BoardEdit.module.css';

export default function BoardEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [writer, setWriter] = useState('');
  const [loading, setLoading] = useState(false);// 로딩 표시용임
  const maxLength = 500;


  useEffect(() => {
    axios.get(`http://localhost:8080/cal/board/detail/${id}`)
      .then(res => {
        const data = res.data;
        setTitle(data.title);
        setContent(data.content);
        setWriter(data.writer);
      })
      .catch(err => {
        console.error(err);
        alert('❌ 掲示板のロード失敗');
      });
  }, [id]);

  //수정 부탁 형식
  const handleUpdate = () => {
    if (!title.trim() || !content.trim()) {
      alert('⚠️ タイトルとコンテンツを入力してください!');
      return;
    }

    const updatedBoard = { title, content, writer };
    setLoading(true);   //버튼 중복 방지

    axios.put(`http://localhost:8080/cal/board/update/${id}`, updatedBoard)
      .then(() => {
        alert('✔️ 変更しました。');
        navigate("/", { replace: true });
      })
      .catch(err => {
        console.error(err);
        alert('❌ 変更に失敗しました。');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className={styles.form}>
      <h2 className={styles.label}>レビュー編集</h2>
      {loading && <p>ローディング…</p>}

      <div className={styles.section}>
        <label>タイトル</label>
        <input className={styles.title} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} required />
      </div>

      <div className={styles.section}>
        <label>コンテンツ</label>
        <textarea className={styles.content} value={content} onChange={(e) => setContent(e.target.value)} maxLength={maxLength} required />
      </div>

      <div className={styles.counter}>
        {content.length} / {maxLength} 文字
      </div>

      <div className={styles.section}>
        <label>作成者: {writer}</label>
      </div>

      <div className={styles.section}>
        <button className={styles.button} onClick={handleUpdate}>編集する</button>
      </div>
    </div>
  );
}
