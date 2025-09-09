import React, { useEffect, useRef } from "react";
import axios from "axios";
import { Navigate, useNavigate, useParams } from "react-router-dom";

export default function ProductDelete() {
    const { id } = useParams();
    const navigate = useNavigate();
    const run = useRef(false);

    useEffect(() => {
        if (!id) return;

        if(run.current) return;
        run.current = true;

        const connect = async () => {
            try {
                await axios.delete("http://localhost:8080/cal/product/delete", 
                {
                    params: { id }
                });
                console.log("삭제 성공");
                alert("삭제 성공");
                navigate("/", { replace: true });
            } catch (error) {
                console.log("실패", error);
                alert("삭제 실패");
                navigate("/", { replace: true });
            }
        };

        connect();

    }, [id]);

    return null;

}