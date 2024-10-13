import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SupplierRegForm from './views/SupplierRegForm';
import SupplierProduct from './views/SupplierProduct';
import UpdateUser from './views/UpdateUser';
import Login from './views/Login';
import Home from './views/Home';
import AdminPage from './views/AdminPage';
import AdminAdditem from './views/AdminAdditem';
import Adminproduct from './views/Adminproduct';  
import UpdateItem from './views/UpdateItem';
import GenerateReport from "./views/GenarateReport"; 
import OrderNotification from "./views/OrderNotification"; 
import AcceptAdminOrder from "./views/AcceptAdminOrder"; 
import AddItem from './views/AddItem';
import Inventory from './views/Inventory';
import AdminPlaceOrder from './views/AdminPlaceOrder'; // Added Route
import AdminBuyItem from './views/AdminBuyItem'; // Updated Route
import UpdateAdmin from './views/UpdateAdmin';
import AdminInventory from './views/AdminInventory';
import CustomerSignUp from './views/CustomerSignUp';
import UserHome from './views/UserHome';
import UserProfile from './views/UserProfile';
import ItemPage from './views/ItemPage';
import MyCart from './views/MyCart';
import AdminOrderStatus from './views/AdminOrderStatus';
import Checkout from "./views/CheckoutForm/CheckoutForm";
import PaymentPage from "./views/PaymentPage/PaymentPage";
import CardDetails from "./views/CardDetails/CardDetails";
import Orders from "./views/Orders/Order";


function App() {
  return (
    <Router>
      <Routes>
        {/* User Management Routes */}
        <Route path="/update" element={<UpdateUser />} />
        
        {/* Supplier Management Routes */}
        <Route path="/SupplierRegForm" element={<SupplierRegForm />} />
        <Route path="/SupplierProduct/:userId" element={<SupplierProduct />} />

        {/* Add Item Page */}
        <Route path="/AddItem/:userId" element={<AddItem />} />

        {/* Other Routes */}
        <Route path="/Login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/AdminAdditem" element={<AdminAdditem />} />
        <Route path="/Adminproduct" element={<Adminproduct />} />
        <Route path="/AdminPage" element={<AdminPage />} />
        <Route path="/UpdateItem/:itemId" element={<UpdateItem />} />
        <Route path="/GenerateReport/:userId" element={<GenerateReport />} />
        <Route path="/OrderNotification/:userId" element={<OrderNotification />} />
        <Route path="/AcceptAdminOrder/:orderId/:userId" element={<AcceptAdminOrder />} />
        {/* Update Item Pages */}
        <Route path="/UpdateItem" element={<UpdateItem />} />
      
        {/* Inventory and Purchase Pages */}
        <Route path="/Inventory" element={<Inventory />} />
        <Route path="/AdminPlaceOrder/:itemId" element={<AdminPlaceOrder />} /> {/* Added Route */}
        <Route path="/AdminBuyItem" element={<AdminBuyItem />} />
        <Route path="/UpdateAdmin/:itemId" element={<UpdateAdmin />} />
        <Route path="/AdminInventory" element={<AdminInventory/>} />
        <Route path="/CustomerSignUp" element={<CustomerSignUp />} />
        <Route path="/UserHome/:userId" element={<UserHome />} />
        <Route path="/UserProfile/:userId" element={<UserProfile />} />
        <Route path="/ItemPage/:itemId/:userId" element={<ItemPage />} />
        <Route path="/MyCart/:userId" element={<MyCart />} />
        <Route path="/AdminOrderStatus" element={<AdminOrderStatus />} />


        
				<Route path="/Carddetails" element={<CardDetails />} />
				<Route path="/checkout" element={<Checkout />} />
				<Route path="/payment" element={<PaymentPage />} />
				<Route path="/order" element={<Orders />} />
      </Routes>
    </Router>
  );
}

export default App;
