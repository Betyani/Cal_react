import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NotFound.module.css"

export default function  NotFound() {
    const navigate = useNavigate();
    
    return (
        <div className={styles.wrap}>
            <label className={styles.title}>404 - ページが見つかりません</label>
            <img className={styles.image} src="/goBack.png" />
            <p className={styles.content}>指定されたページは存在しません。ホームにお戻りください。</p>
            <button className={styles.button} onClick={() => navigate("/", {replace: true})}>ホームへ</button>
        </div>
    )
}