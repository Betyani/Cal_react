import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './BoardForm.css';

function BoardForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [board, setBoard] = useState({
        title: '',
        content: '',
        writer: '',
        productId: ''
    });

    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:8080/cal/board/detail/${id}`)
                .then(response => {
                    setBoard(response.data);
                })
                .catch(error => {
                    console.error("기존 게시글 불러오기 실패:", error);
                });
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target; {/* <input ...> 태그 자체 */ }
        {/* 즉, const name = e.target.name; 이거랑 const value = e.target.value; */ }
        {/* 대괄호 [] 를 쓰면 객체의 키를 변수로 사용 */ }
        setBoard({
            ...board,
            [name]: value
        });
};

const handleSubmit = (e) => {
    e.preventDefault(); {/* 새로고침 방지라고 */ }
    if (id) {
        axios.put('http://localhost:8080/cal/board/update', board)
            .then(() => {
                alert("수정 성공!");
                navigate('/board/list');
            })
            .catch(error => {
                console.error("수정 실패:", error);
                alert("수정 실패");
            });
    } else {
        axios.post('http://localhost:8080/cal/board/register', board)
            .then(() => {
                alert("등록 성공!");
                navigate('/board/list');
            })
            .catch(error => {
                console.error("등록 실패:", error);
                alert("등록 실패");
            });
    }
};

return (
    <div className="board-form-container">
        <h2>{id ? "게시글 수정" : "게시글 등록"}</h2>
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="title"
                placeholder="제목"
                value={board.title}
                onChange={handleChange}
                required
            />
            <textarea
                name="content"
                placeholder="내용"
                value={board.content}
                onChange={handleChange}
                required
                rows="5"
            />
            <input
                type="text"
                name="writer"
                placeholder="작성자"
                value={board.writer}
                onChange={handleChange}
                required
            />
            <input
                type="number"
                name="productId"
                placeholder="상품 ID"
                value={board.productId}
                onChange={handleChange}
            />
            <button type="submit">{id ? "수정" : "등록"}</button>
        </form>
    </div>
);
}

export default BoardForm;