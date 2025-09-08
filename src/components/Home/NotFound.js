import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NotFound.module.css"

export default function  NotFound() {
    const navigate = useNavigate();
    
    return (
        <div className={styles.wrap}>
            <label className={styles.title}>404 - 페이지를 찾을 수 없습니다</label>
            <img className={styles.image} src="/goBack.png" />
            <p className={styles.content}>잘못된 주소로 접근하셨습니다! 홈으로 돌아가 주세요</p>
            <button className={styles.button} onClick={() => navigate("/", {replace: true})}>홈으로</button>
        </div>
    )
}