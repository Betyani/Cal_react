// src/components/board/boardList/BoardItemRow.js
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const BoardItemRow = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // 🔹 URL에서 id 추출 (/board/delete/:id)
  const run = useRef(false); // 🔹 실행 여부 체크 (StrictMode에서도 안전)

  useEffect(() => {
    if (run.current) return; // 이미 실행했다면 중단
    run.current = true;

    const deleteBoard = async () => {
      if (window.confirm('정말 삭제하시겠습니까?')) {
        try {
          await axios.delete('http://localhost:8080/cal/board/delete', {
            params: { id },
          });
          alert('삭제 성공!');
          navigate('/'); // 🔹 삭제 후 홈으로 이동
        } catch (err) {
          alert('삭제 실패!');
          console.error(err);
          navigate('/'); // 실패 시 다시 리스트로
        }
      } else {
        navigate('/'); // 취소 시 홈으로
      }
    };

    deleteBoard();
  }, [id]);

  return <p>삭제 중입니다...</p>; // 삭제 처리 중에 보여줄 임시 메시지
};

export default BoardItemRow;
