// src/components/board/boardList/BoardItemRow.js
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const BoardDelete = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // 🔹 URL에서 id 추출 (/board/delete/:id)
  const run = useRef(false); // 🔹 실행 여부 체크 (StrictMode에서도 안전)

  useEffect(() => {
    if (run.current) return; // 이미 실행했다면 중단
    run.current = true;

    const deleteBoard = async () => {
      if (window.confirm('もう一度確認、削除しますか？')) {
        try {
          await axios.delete('http://localhost:8080/cal/board/delete', {
            params: { id },
          });
          alert('削除　成功!');
          navigate('/', {replace: true}); // 🔹 삭제 후 홈으로 이동
        } catch (err) {
          alert('削除　失敗！');
          console.error(err);
          navigate('/', {replace: true}); // 실패 시 다시 리스트로
        }
      } else {
        navigate('/'); // 취소 시 홈으로
      }
    };

    deleteBoard();
  }, [id]);

  return <p>削除中...</p>; // 삭제 처리 중에 보여줄 임시 메시지
};

export default BoardDelete;
