import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './BoardDetail.css';

function BoardDetail() {
  const { id } = useParams();
  console.log(id);
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/cal/board/detail/${id}`)
      .then(response => {
        setBoard(response.data);
      })
      .catch(error => {
        console.error("상세 조회 실패:", error);
      });
  }, [id]); {/* 컴포넌트가 처음 나타나거나, id 가 바뀔 때 실행되는 코드 */ }

  if (!board) return <div>로딩중...</div>;

  return (
    <div className="board-detail-container">
      <h2>게시글 상세보기</h2>
      <p><strong>ID:</strong> {board.id}</p>
      <p><strong>제목:</strong> {board.title}</p>
      <p><strong>내용:</strong> {board.content}</p>
      <p><strong>작성자:</strong> {board.writer}</p>
      <p>
        {/* <strong>작성일:</strong>
        {board.createTime && `${board.createTime.date} ${board.createTime.time}`} */}
        <strong>작성일:</strong> {board.createTime}
      </p>
      <button onClick={() => navigate(`/board/form/${id}`)}>수정하기</button>
      <button onClick={() => navigate(-1)}>뒤로가기</button>
      {/* history.back() 비슷함! 그리고, navigate(1)は	앞으로 가기 (history forward) */}
    </div>
  );
}

export default BoardDetail;