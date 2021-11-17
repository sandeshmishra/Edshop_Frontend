import React, {useState, useEffect} from "react";
import SignIn from "./components/signIn/SignIn";
import SignUp from "./components/signUp/SignUp";
import ProductPage from "./components/productsPage/ProductsPage";
import ProductDetails from "./components/productDetails/ProductDetails";
import OrderPage from "./components/orderPage/OrderPage";
import EditProduct from "./components/editProduct/EditProduct";
import AddProduct from "./components/addProduct/AddProduct";
import {BrowserRouter, Routes, Route} from "react-router-dom"

function App(){
  const [login, setLogin] = useState(Boolean(localStorage.getItem("auth")));
  const [admin, setAdmin] = useState(Boolean(localStorage.getItem("admin")));

  const [addAlert, setAddAlert] = useState(Boolean(sessionStorage.getItem("add")));
  const [editAlert, setEditAlert] = useState(Boolean(sessionStorage.getItem("edit")));
  const [deleteAlert, setDeleteAlert] = useState(Boolean(sessionStorage.getItem("delete")));
  const [orderAlert, setOrderAlert] = useState(Boolean(sessionStorage.getItem("order")));

  const handleLogin=(value)=>{
    setLogin(value);
    console.log("login set");
  }

  const handleAdmin=(value)=>{
    setAdmin(value);
    console.log("admin set");
  }

  useEffect(()=>{
    if(addAlert){
      setTimeout(()=>handleAlert("add", false), 3000);
    }
    if(editAlert){
      setTimeout(()=>handleAlert("edit", false), 3000);
    }
    if(deleteAlert){
      setTimeout(()=>handleAlert("delete", false), 3000);
    }
  }, [addAlert, editAlert, deleteAlert]);

  const handleAlert=(type, value)=>{
    switch(type){
      case "add" : {
        window.sessionStorage.removeItem('add');
        setAddAlert(value);
      }
      break;
      case "edit" : {
        window.sessionStorage.removeItem('edit');
        setEditAlert(value);
      }
      break;
      case "delete" : {
        window.sessionStorage.removeItem('delete');
        setDeleteAlert(value);
      }
      break;
      case "order" : {
        window.sessionStorage.removeItem('order');
        setOrderAlert(value);
      }
      break;
      default : return null;
    }
  }

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<ProductPage isLoggedIn={login} setLogin={handleLogin} isAdmin={admin} setAdmin={handleAdmin} addAlert={addAlert} editAlert={editAlert} deleteAlert={orderAlert} orderAlert={orderAlert} handleAlert={handleAlert} />} />
      <Route path="/login" element={<SignIn isLoggedIn={login} setLogin={handleLogin} isAdmin={admin} setAdmin={handleAdmin} />} />
      <Route path="/signup" element={<SignUp isLoggedIn={login} isAdmin={admin} />} />
      <Route path="/product/:id" element={<ProductDetails isLoggedIn={login} setLogin={handleLogin} isAdmin={admin} setAdmin={handleAdmin} />} />
      <Route path="/order/:id" element={<OrderPage isLoggedIn={login} setLogin={handleLogin} isAdmin={admin} setAdmin={handleAdmin} handleAlert={handleAlert} />} />
      <Route path="/editProduct/:id" element={<EditProduct isLoggedIn={login} setLogin={handleLogin} isAdmin={admin} handleAlert={handleAlert} />} />
      <Route path="/addProduct" element={<AddProduct isLoggedIn={login} setLogin={handleLogin} isAdmin={admin} handleAlert={handleAlert} />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App;