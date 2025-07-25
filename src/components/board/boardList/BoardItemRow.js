// src/BoardItemRow.js
import React from 'react';
import axios from 'axios';

const BoardItemRow = ({ board, onDeleteSuccess, onDetail }) => {
  const handleDelete = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await axios.delete('http://localhost:8080/cal/board/delete', {
          params: { id: board.id },
        });
        alert('삭제 성공!');
        onDeleteSuccess();
      } catch (err) {
        alert('삭제 실패!');
        console.error(err);
      }
    }
  };

  return (
    <tr>
      <td>{board.id}</td>
      <td>
        {/* 👇 제목 버튼 스타일과 기능 그대로 적용 */}
        <button
          onClick={() => onDetail(board.id)}
          style={{
            all: 'unset',
            cursor: 'pointer',
            color: 'blue',
            textDecoration: 'underline',
          }}
        >
          {board.title}
        </button>
      </td>
      <td>{board.writer}</td>
      <td>{JSON.stringify(board.createTime)}</td>
      <td>
        <button onClick={handleDelete}>삭제</button>
      </td>
    </tr>
  );
};

export default BoardItemRow;
