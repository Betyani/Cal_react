import React, { useState } from "react";
import "./frame.css"
import ProductList from "../../product/productList/ProductList";
import BoardList from "../board/boardList/BoardList";



export default function Frame() {
    const [selectProduct, setSelectProduct] = useState(null);



    return (
        <div className="page">
            <main className="container main">
                <section className="section">
                    <ProductList onSelect={setSelectProduct}/>
                </section>

                <section className="section">
                    <h2 className="section-title">리뷰 리스트 {selectProduct && `- ${selectProduct.name}`}</h2>
                    <BoardList productId={selectProduct?.id} />
                </section>
            </main>

            <footer className="footer">
                <div className="container">© 2025 Cal Project</div>
            </footer>

        </div>

    )
}