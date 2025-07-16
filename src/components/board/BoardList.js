import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './BoardList.css';

function BoardList() {
    const [boards, setBoards] = useState([]);

    useEffect(() => {
        fetchBoards();
    }, []);

    const fetchBoards = () => {
        axios.get('http://localhost:8080/cal/board/list')
            .then(response => {
                setBoards(response.data);
            })
            .catch(error => {
                console.error("목록 가져오기 실패:", error);
            });
    };

    const handleDelete = (id) => {
        if (window.confirm(`${id}번 게시글을 삭제하시겠습니까?`)) {
            axios.delete(`http://localhost:8080/cal/board/delete/${id}`)
                .then(() => {
                    alert("삭제 성공!");
                    fetchBoards();
                })
                .catch(error => {
                    console.error("삭제 실패:", error);
                    alert("삭제 실패");
                });
        }
    };

    return (
        <div className="board-list-container">
            <h2>게시판 목록</h2>
            <Link to="/board/form">      {/* HTML의 <a href> 대신 */}
                <button className="board-list-button">게시글 작성</button>
            </Link>
            <table className="board-list-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>작성일</th>
                        <th>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {boards.map(board => (
                        <tr key={board.id}>
                            <td>{board.id}</td>
                            <td>
                                <Link to={`/board/detail/${board.id}`}>{board.title}</Link>
                            </td>
                            <td>{board.writer}</td>
                            <td>{JSON.stringify(board.createTime)}</td>
                            <td>
                                <button onClick={() => handleDelete(board.id)}>삭제</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default BoardList;
