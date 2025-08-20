import React from "react";
import "./frame.css"
import ProductList from "../../product/productList/ProductList";
import BoardList from "../board/boardList/BoardList";
import Header from "../Header/Header";


export default function Frame() {
    return (
        <div className="page">
            <main className="container main">
                <section className="section">
                    <h2 className="section-title">상품 리스트</h2>
                    <ProductList />
                </section>

                <section className="section">
                    <h2 className="section-title">리뷰 리스트</h2>
                    <BoardList productId={1}/>
                </section>
            </main>

            <footer className="footer">
                <div className="container">© 2025 Team Project</div>
            </footer>

        </div>

    )
}