// src/BoardItem.js
import React from 'react';
import axios from 'axios';

const BoardItem = ({ board, onDeleteSuccess }) => {
  const handleDelete = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await axios.delete('http://localhost:8080/cal/board/delete', {
          params: { id: board.id },
        });
        alert('삭제 성공!');
        onDeleteSuccess(); // 삭제 후 목록 갱신
      } catch (err) {
        alert('삭제 실패!');
        console.error(err);
      }
    }  
  };

  return (
    <div style={{ border: '1px solid #ddd', marginBottom: '10px', padding: '10px' }}>
      <h3>{board.title}</h3>
      <p>{board.content}</p>
      <p><strong>작성자:</strong> {board.writer}</p>
      <button onClick={handleDelete}>삭제</button>
    </div>
  );
};

export default BoardItem;
