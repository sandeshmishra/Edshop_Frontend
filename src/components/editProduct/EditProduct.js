import React, {useEffect, useReducer, useState} from "react";
import {TextField, FormControl, Button, Typography, Alert} from '@mui/material';
import "./EditProduct.css";
import {useParams, useNavigate} from "react-router-dom";
import NavigationBar from "../../common/navigationBar/NavigationBar";

const SET_DATA = "SET_DATA";
const EDIT_NAME = "EDIT_NAME";
const EDIT_CATEGORY = "EDIT_CATEGORY";
const EDIT_MANUFACTURER = "EDIT_MANUFACTURER";
const EDIT_AVAILABLE_ITEMS = "EDIT_AVAILABLE_ITEMS";
const EDIT_PRICE = "EDIT_PRICE";
const EDIT_IMAGE_URL = "EDIT_IMAGE_URL";
const EDIT_DESCRIPTION = "EDIT_DESCRIPTION";
const SET_NAME_ERROR = "SET_NAME_ERROR";
const SET_CATEGORY_ERROR = "SET_CATEGORY_ERROR";
const SET_MANUFACTURER_ERROR = "SET_MANUFACTURER_ERROR";
const SET_AVAILABLE_ITEMS_ERROR = "SET_AVAILABLE_ITEMS_ERROR";
const SET_PRICE_ERROR = "SET_PRICE_ERROR";
const SET_IMAGE_URL_ERROR = "SET_IMAGE_URL_ERROR";
const SET_DESCRIPTION_ERROR = "SET_DESCRIPTION_ERROR";

const reducer = (state, action)=>{
  switch(action.type){
    case SET_DATA : return {...state, ...action.setData};
    case EDIT_NAME : return {...state, name : action.value};
    case EDIT_CATEGORY : return {...state, category : action.value};
    case EDIT_MANUFACTURER : return {...state, manufacturer : action.value};
    case EDIT_AVAILABLE_ITEMS : return {...state, availableItems : action.value};
    case EDIT_PRICE : return {...state, price : action.value};
    case EDIT_IMAGE_URL : return {...state, imageURL : action.value};
    case EDIT_DESCRIPTION : return {...state, description : action.value};
    case SET_NAME_ERROR : return {...state, nameError : action.value, nameHelperText : action.text};
    case SET_CATEGORY_ERROR : return {...state, categoryError : action.value, categoryHelperText : action.text};
    case SET_MANUFACTURER_ERROR : return {...state, manufacturerError : action.value, manufacturerHelperText : action.text};
    case SET_AVAILABLE_ITEMS_ERROR : return {...state, availableItemsError : action.value, availableItemsHelperText : action.text};
    case SET_PRICE_ERROR : return {...state, priceError : action.value, priceHelperText : action.text};
    case SET_IMAGE_URL_ERROR : return {...state, imageUrlError : action.value, imageUrlHelperText : action.text};
    case SET_DESCRIPTION_ERROR : return {...state, descriptionError : action.value, descriptionHelperText : action.text};
    default : return state;
  }
}

function EditProduct({isLoggedIn, setLogin, isAdmin, handleAlert}){
  const initialData = {
    name : "",
    category : "",
    manufacturer : '',
    availableItems : "",
    price : "",
    imageURL : '',
    description : "",
    nameError : false,
    categoryError : false,
    manufacturerError : false,
    availableItemsError : false,
    priceError : false,
    imageUrlError : false,
    descriptionError : false,
    nameHelperText : "",
    categoryHelperText : "",
    manufacturerHelperText : '',
    availableItemsHelperText : "",
    priceHelperText : "",
    imageUrlHelperText : '',
    descriptionHelperText : ""
  };
  
  const {id : productId} = useParams();

  useEffect(()=>{
    const url = `http://localhost:8000/api/products/${productId}`;
    const options = {
      method : "GET",
      headers : {
        "Content-Type" : "application/json",
        "x-auth-token" : window.localStorage.getItem('auth')
      }
    }
    fetch(url)
      .then(response=>response.json())
      .then(res=>dispatch({type : "SET_DATA", setData : res}));
  }, [])

  const [editData, dispatch] = useReducer(reducer, initialData);

  const navigate = useNavigate();


  const handleChange=(event)=>{
    const {name, value} = event.target;
    switch(name){
      case "edit-name" : dispatch({type : EDIT_NAME, value});
      break;
      case "edit-category" : dispatch({type : EDIT_CATEGORY, value});
      break;
      case "edit-manufacturer" : dispatch({type : EDIT_MANUFACTURER, value});
      break;
      case "edit-available-items" : dispatch({type : EDIT_AVAILABLE_ITEMS, value});
      break;
      case "edit-price" : dispatch({type : EDIT_PRICE, value});
      break;
      case "edit-image-url" : dispatch({type : EDIT_IMAGE_URL, value});
      break;
      case "edit-description" : dispatch({type : EDIT_DESCRIPTION, value});
      break;
      default : return null;
    }
  }

  const handleClick=(event)=>{
    event.preventDefault();
    //check for name
    if(!editData.name){
      dispatch({type : SET_NAME_ERROR, value : true, text : "Required"});
      return;
    }else{
      dispatch({type : SET_NAME_ERROR, value : false, text : ""});
    }
    //check for category
    if(!editData.category){
      dispatch({type : SET_CATEGORY_ERROR, value : true, text : "Required"});
      return;
    }else{
      dispatch({type : SET_CATEGORY_ERROR, value : false, text : ""});
    }
    //check for manufacturer
    if(!editData.manufacturer){
      dispatch({type : SET_MANUFACTURER_ERROR, value : true, text : "Required"});
      return;
    }else{
      dispatch({type : SET_MANUFACTURER_ERROR, value : false, text : ""});
    }
    //check for availableItems
    const numberRegex = /\d+/;
    if(!editData.availableItems){
      dispatch({type : SET_AVAILABLE_ITEMS_ERROR, value : true, text : "Required"});
      return;
    }else if(!numberRegex.test(editData.availableItems)){
      dispatch({type : SET_AVAILABLE_ITEMS_ERROR, value : true, text : "Invalid entry"});
      return;
    }else{
      dispatch({type : SET_AVAILABLE_ITEMS_ERROR, value : false, text : ""});
    }
    //check for price
    if(!editData.price){
      dispatch({type : SET_PRICE_ERROR, value : true, text : "Required"});
      return;
    }else if(!numberRegex.test(editData.price)){
      dispatch({type : SET_PRICE_ERROR, value : true, text : "Invalid entry"});
      return;
    }else{
      dispatch({type : SET_PRICE_ERROR, value : false, text : ""});
    }
    const data = {
      name : editData.name,
      category : editData.category,
      manufacturer : editData.manufacturer,
      price : editData.price,
      availableItems : editData.availableItems,
      imageURL : editData.imageURL,
      description : editData.description
    }
    const options = {
      method : "PUT",
      headers : {
        "Content-Type" : "application/json",
        'x-auth-token' : window.localStorage.getItem('auth')
      },
      body : JSON.stringify(data)
    }
    const url = `http://localhost:8000/api/products/${productId}`;
    fetch(url, options)
      .then(response=>{
          if(response.status === 201){
            return response.json();
          }
          return null;
        })
      .then(res=>{
        if(res){
          window.sessionStorage.setItem('edit', true);
          window.location.href="/";
        }
      });
  }

  return (
    <>
    <NavigationBar isLoggedIn={isLoggedIn} setLogin={setLogin} isAdmin={isAdmin} />
    <div id="edit-form-container">
      <form id="edit-form" >
        <Typography  variant="h1" sx={{textAlign : 'center', fontSize : "35px", fontWeight : 400, mb : "4%"}}>Modify Product</Typography>
        <FormControl>
          <TextField
            required
            value={editData.name}
            onChange={handleChange}
            name = "edit-name"
            label = "Name"
            error={editData.nameError}
            helperText={editData.nameHelperText}
          />   
        </FormControl>
        <FormControl>
          <TextField
            required
            value={editData.category}
            onChange={handleChange}
            name = "edit-category"
            label = "Category"
            error={editData.categoryError}
            helperText={editData.categoryHelperText}
          />
        </FormControl>
        <FormControl>
          <TextField
            required
            value={editData.manufacturer}
            onChange={handleChange}
            name = "edit-manufacturer"
            label = "Manufacturer"
            error={editData.manufacturerError}
            helperText={editData.manufacturerHelperText}
          />
        </FormControl>
        <FormControl>
          <TextField
            required
            value={editData.availableItems}
            onChange={handleChange}
            name = "edit-available-items"
            label = "Available Items"
            error={editData.availableItemsError}
            helperText={editData.availableItemsHelperText}
          />
        </FormControl>
        <FormControl>
          <TextField
            required
            value={editData.price}
            onChange={handleChange}
            name = "edit-price"
            label = "Price"
            error={editData.priceError}
            helperText={editData.priceHelperText}
          />
        </FormControl>
        <FormControl>
          <TextField
            value={editData.imageURL}
            onChange={handleChange}
            name = "edit-image-url"
            label = "Image URL"
            error={editData.imageUrlError}
            helperText={editData.imageUrlHelperText}
          />
        </FormControl>
        <FormControl>
          <TextField
            value={editData.description}
            onChange={handleChange}
            name = "edit-description"
            label = "Product Description"
            error={editData.descriptionError}
            helperText={editData.descriptionHelperText}
          />
        </FormControl>
        <Button
          type="submit"
          variant='contained'
          fullWidth
          sx={{marginTop : "4%"}}
          onClick={handleClick}
        >MODIFY PRODUCT
        </Button>
      </form>
    </div>
    </>
  )
}

export default EditProduct;