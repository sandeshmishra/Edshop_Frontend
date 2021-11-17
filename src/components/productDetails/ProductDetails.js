import { Button, TextField, Typography } from "@mui/material";
import React, {useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ProductDetails.css";
import NavigationBar from "../../common/navigationBar/NavigationBar";


function ProductDetails({isLoggedIn, setLogin, isAdmin, setAdmin}){
  const [product, setProduct] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("");
  const {id} = useParams();
  const navigate = useNavigate();
  
  useEffect(()=>{
    const url = `http://localhost:8000/api/products/${id}`
    fetch(url)
    .then(response=>response.json())
    .then(res=>setProduct(res));
  }, [])
  
  if(!isLoggedIn){
     navigate('/login');
  }
  const handleChange=(event)=>{
    const {name, value} = event.target;
    console.log(value);
    if(name==="product-quantity"){
      setQuantity(value);
    }
  }

  const handleClick=()=>{
    let quantityRegex = /^\d+$/
    if(quantityRegex.test(quantity) && quantity <= product.availableItems && quantity > 0){
      console.log("all well");
      setError(false);
      setHelperText("");
      window.localStorage.setItem('productId', product._id);
      navigate(`/order/${id}?q=${quantity}`)
    }else{
      if(quantity > product.availableItems){
        setError(true);
        setHelperText("Insufficient quantity");
      }else{
        setError(true);
        setHelperText("Invalid Entry");
      }
    }
  }
  return (
    <>
      <NavigationBar isLoggedIn={isLoggedIn} setLogin={setLogin} isAdmin={isAdmin} setAdmin={setAdmin} />
      <div id="product-container">
        <div id="product-image-container">
          <img id="product-image" src={product.imageURL}/>
        </div>
        <div id="product-details">
          <div id="details-header">
            <Typography component="h1" variant="h1" id="product-name">{product.name}</Typography>
            <Button variant="contained">Available Quantity : {product.availableItems}</Button>
          </div>
          <Typography>Category : <b>{product.category}</b></Typography>
          <Typography className="italic">{product.description}</Typography>
          <Typography className="price">{product.price}</Typography>
          <TextField
            label="Enter Quantity"
            required
            type="number"
            name='product-quantity'
            value={quantity}
            onChange={handleChange}
            error={error}
            helperText={helperText}
          />
          <Button id="order-btn" onClick={handleClick} variant="contained" ><Typography>Place Order</Typography></Button>
        </div>
      </div>
    </>
  )
}

export default ProductDetails;