import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import BoardDetail from './components/board/BoardDetail';
import BoardForm from './components/board/BoardForm';
import BoardList from './components/Board/BoardList';
import ProductDelete from './components/ProductDelete/ProductDelete';
import ProductDetail from './components/ProductDetail/ProductDetail';
import ProductForm from './components/ProductForm/ProductForm';
import ProductList from './components/ProductList/ProductList';
import ProductRegister from './product/ProductRegister';
import Home from './components/Home/Home'; // 접속시 나오는 홈페이지; 이러면 관리가 명확해진하여 도전해봤습니다.
import ProductEdit from './components/ProductEdit';
function App() {
  return (
    <Router>
      <div className="App">
        <Header /> {/*  로그인 상태, 로그아웃 관리 */}
        {/* <h1> 상품 받아라 </h1> */}
        <Routes>
          <Route path="/" element={<Home />} /> {/* 여기를 Home으로 바꿈 */}
          <Route path="/products/list" element={<ProductList />} />
          <Route path="/:id" element={<ProductDetail />} />
          <Route path="/products/new" element={<ProductForm />} />

          <Route path="/board/list" element={<BoardList />} />
          <Route path="/board/detail/:id" element={<BoardDetail />} />
          <Route path="/board/form" element={<BoardForm />} />
          <Route path="/board/form/:id" element={<BoardForm />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* /board/list 를 디폴트로 하는거 */}
          {/* <Route path="*" element={<Navigate replace to="/board/list" />} /> */}
        </Routes>

        {/*특정 경로에서만 보이게 하고 싶다면 Routes 안에서 조건부 렌더링도 가능,,, 여기서는 항상 보이도록 배치 */}
        {/* <div className="componentTachi">
          <ProductRegister />
          <BoardList />
          <ProductDelete />
         <ProductEdit productId={1} />
        </div> */}
      </div>
    </Router>
  );
}

export default App;