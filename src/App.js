import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './components/ProductList/ProductList';
import ProductDetail from './components/ProductDetail/ProductDetail';
import ProductForm from './components/ProductForm/ProductForm';
import ProductRegister from './prodcut/ProductRegister';

function App() {
    return (
        <Router>
      <div className="App">
        <h1> 상품 받아라 </h1>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/:id" element={<ProductDetail />} />
          <Route path="/products/new" element={<ProductForm />} />
        </Routes>
      </div>
        {<ProductRegister /> }
    </Router>
        
    );
}
export default App;