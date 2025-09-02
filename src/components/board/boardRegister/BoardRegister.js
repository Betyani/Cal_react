import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './boardRegister.module.css';

export default function BoardRegister() {
    const { productId } = useParams();
    const [review, setReview] = useState({
        title: "",
        content: "",
    });
    const [writer, setWriter] = useState("");

    const navigate = useNavigate();
    const maxLength = 500;

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
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2 className={styles.label}>리뷰 등록</h2>
                <div className={styles.section}>
                    <label>제목</label>
                    <input className={styles.title} type="text" name="title" value={review.title} onChange={handleChange} maxLength={100} required />
                </div>
                <div className={styles.section}>
                    <label>내용</label>
                    <textarea className={styles.content} name="content" value={review.content} onChange={handleChange} required rows={5} cols={50} maxLength={maxLength} />
                </div>
                <div className={styles.counter}>
                    {review.content.length} / {maxLength}자
                </div>
                <div className={styles.section}>
                    <label>작성자: {writer}</label>
                </div>
                <div className={styles.section}>
                    <button className={styles.button} type="submit">
                        등록
                    </button>
                </div>
            </form>
        </>
    ) 




}