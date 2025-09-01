import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function BoardRegister() {
    const { productId } = useParams();
    const [review, setReview] = useState({
        title: "",
        content: "",
    });
    const [writer, setWriter] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        
        const status = async () => {
            try {
                const response = await axios.get("http://localhost:8080/cal/member/status", { withCredentials: true })
                console.log("서버 확인값:", response.data);
                setWriter(response.data.nickname);

            } catch (error) {
                console.log("에러:", error);
            }
        } 

        status();

    }, [])
    

//등록버튼을 눌렀을 경우 실행
    const handleSubmit = async (e) => {
        e.preventDefault(); //제출 시 페이지 새로고침 방지
        const finalReview = { ...review, productId: Number(productId), writer };
        
        try {
            console.log("보낼 값:", finalReview);
            const response = await axios.post('http://localhost:8080/cal/board/register', finalReview);
            console.log("등록 성공");
            alert("등록 성공");
            navigate("/", { replace: true });

        } catch (error) {
            console.error('오류남: ', error);
            alert("등록 실패");
        }
    };

    //입력값 실시간 반영
    const handleChange = (e) => {
        const { name, value } = e.target;
        setReview({ ...review, [name]: value });  //입력값만 덮어쓰기
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h2>리뷰 등록</h2>
                <div>
                    <label>제목: </label>
                    <input type="text" name="title" value={review.title} onChange={handleChange} required />
                </div>
                <div>
                    <label>내용: </label>
                    <textarea name="content" value={review.content} onChange={handleChange} required rows={5} cols={50} />
                </div>
                <div>
                    <label>작성자: {writer}</label>
                </div>
                <div>
                    <button type="submit">
                        등록
                    </button>
                </div>
            </form>
        </>
    ) 




}