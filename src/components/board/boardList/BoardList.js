import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Link 대신 useNavigate으로 변경했습니다
import './BoardList.css';

function BoardList() {
    const [boards, setBoards] = useState([]);
    const navigate = useNavigate();

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
            axios.delete(`http://localhost:8080/cal/board/delete1/${id}`)
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

    const handleGoToForm = () => {
        navigate("/board/form");
    };

    const handleGoToDetail = (id) => {
        navigate(`/board/detail/${id}`);
    };

    return (
        <div className="board-list-container">
            <h2>게시판 목록</h2>
            <button className="board-list-button" onClick={handleGoToForm}>
                게시글 작성
            </button>
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
                    {Array.isArray(boards) && boards.length > 0 ? (
                        boards.map(board => (
                            <tr key={board.id}>
                                <td>{board.id}</td>
                                <td>
                                    <button
                                        onClick={() => handleGoToDetail(board.id)}
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
                                    <button onClick={() => handleDelete(board.id)}>삭제</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center' }}>게시글이 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
export default BoardList;