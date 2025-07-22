// src/BoardList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BoardItem from './BoardItem';

const BoardList1 = () => {
  const [boards, setBoards] = useState([]);

  const fetchBoards = async () => {
    try {
      const res = await axios.get('http://localhost:8080/cal/board/list'); // 예시 API
      setBoards(res.data);
    } catch (err) {
      console.error('게시글 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <div>
      {boards.map((board) => (
        <BoardItem key={board.id} board={board} onDeleteSuccess={fetchBoards} />
      ))}
    </div>
  );
};

export default BoardList1;
