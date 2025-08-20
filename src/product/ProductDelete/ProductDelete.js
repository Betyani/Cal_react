import React, { useEffect } from "react";
import axios from "axios";

export default function ProductDelete({ id }) {

    useEffect(() => {
        if (!id) return;

        const connect = async () => {
            try {
                const response = await axios.delete("http://localhost:8080/cal/product/delete", 
                {
                    params: { id }
                });
                console.log("삭제 성공");
            } catch (error) {
                console.log("실패", error);
            }
        };

        connect();

    }, [id]);

    return null;

}