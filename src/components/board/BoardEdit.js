import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './BoardEdit.module.css';

export default function BoardEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [writer, setWriter] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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
        alert('❌ 게시글 로드 실패');
      });
  }, [id]);

  const handleUpdate = () => {
    if (!title.trim() || !content.trim()) {
      alert('⚠️ 제목과 내용을 모두 입력하세요!');
      return;
    }

    const updatedBoard = { title, content, writer };
    setLoading(true);

    axios.put(`http://localhost:8080/cal/board/update/${id}`, updatedBoard)
      .then(() => {
        alert('✔️ 게시글이 수정되었습니다!');
        navigate(`/board/detail/${id}`, { replace: true });
      })
      .catch(err => {
        console.error(err);
        alert('❌ 수정 실패');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className={styles.container}>
      <h2>게시글 수정</h2>
      {loading && <p>수정 중...</p>}
      {message && <p>{message}</p>}

      <label>제목:
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <br />

      <label>내용:
        <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      </label>
      <br />

      <label>작성자:
        <input value={writer} readOnly />
      </label>
      <br />

      <button className={styles.updateButton} onClick={handleUpdate}>수정하기</button>
    </div>
  );
}
