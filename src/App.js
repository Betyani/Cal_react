import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Login from './pages/Login';
import Register from './pages/Register';

// 1차
import ProductList from './product/productList/ProductList';
import ProductRegister from './product/productRegister/ProductRegister';
import ProductDelete from './product/productDelete/ProductDelete';
import ProductEdit from './product/productEdit/ProductEdit'; 

// 2차
import BoardList from './components/board/boardList/BoardList';
import BoardDetail from './components/board/boardDetail/BoardDetail';
import BoardEdit from './components/board/boardEdit/BoardEdit';
import Home from './components/Home/Home';// 접속시 나오는 홈페이지; 이러면 관리가 명확해진하여 도전해봤습니다.

function App() {
  return (
    <Router>
      <Header /> {/*  로그인 상태, 로그아웃 관리 */}
      <div className="App">
        <Routes>
          {/* 홈 */}
          <Route path="/" element={<Home />} />{/* 여기를 Home으로 바꿈 */}


          {/* 회원 */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 상품 */}
         
          <Route path="/products/list" element={<ProductList />} />
          <Route path="/products/new" element={<ProductRegister />} />
          <Route path="/products/delete" element={<ProductDelete />} />
          <Route path="/product/edit/:productId" element={<ProductEdit />} />
    

          {/* 게시판 */}
          <Route path="/board/list" element={<BoardList />} />
          <Route path="/board/detail/:id" element={<BoardDetail />} />
          <Route path="/board/edit/:id" element={<BoardEdit />} />
        </Routes>
      
      {/* /board/list 를 디폴트로 하는거 */}
          {/* <Route path="*" element={<Navigate replace to="/board/list" />} /> */}
       
   
     

        {/*특정 경로에서만 보이게 하고 싶다면 Routes 안에서 조건부 렌더링도 가능,,, 여기서는 항상 보이도록 배치 */}
        {/* <div className="componentTachi">
          <ProductRegister />
          <BoardList />
          <ProductDelete />
        </div> */}
      
        </div>
         </Router>
  );
}

export default App;
