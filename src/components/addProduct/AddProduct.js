import React, {useEffect, useReducer, useState} from "react";
import {TextField, FormControl, Button, Typography} from '@mui/material';
import "./AddProduct.css";
import NavigationBar from "../../common/navigationBar/NavigationBar";
import SelectCategory from "./SelectCategory";
import {useNavigate} from "react-router-dom";

const SET_DATA = "SET_DATA";
const ADD_NAME = "ADD_NAME";
const ADD_CATEGORY = "ADD_CATEGORY";
const ADD_MANUFACTURER = "ADD_MANUFACTURER";
const ADD_AVAILABLE_ITEMS = "ADD_AVAILABLE_ITEMS";
const ADD_PRICE = "ADD_PRICE";
const ADD_IMAGE_URL = "ADD_IMAGE_URL";
const ADD_DESCRIPTION = "ADD_DESCRIPTION";
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
    case ADD_NAME : return {...state, name : action.value};
    case ADD_CATEGORY : return {...state, category : action.value};
    case ADD_MANUFACTURER : return {...state, manufacturer : action.value};
    case ADD_AVAILABLE_ITEMS : return {...state, availableItems : action.value};
    case ADD_PRICE : return {...state, price : action.value};
    case ADD_IMAGE_URL : return {...state, imageURL : action.value};
    case ADD_DESCRIPTION : return {...state, description : action.value};
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

const createOption = (label) => ({
  label,
  value: label.trim(),
});


function AddProduct({isLoggedIn, setLogin, isAdmin}){
  const [options, setOptions] = useState([]);
  const initialData = {
    name : "",
    category : null,
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

  
  useEffect(()=>{
    const url = `http://localhost:8000/api/products/categories`;
    fetch(url)
      .then(response=>response.json())
      .then(res=>setOptions(setInitialOptions(res)));
  }, [])

  const [addData, dispatch] = useReducer(reducer, initialData);

  const setInitialOptions=(data)=>data.map(item=>createOption(item));

  const handleChange=(event)=>{
    const {name, value} = event.target;
    switch(name){
      case "add-name" : dispatch({type : ADD_NAME, value});
      break;
      case "add-category" : dispatch({type : ADD_CATEGORY, value});
      break;
      case "add-manufacturer" : dispatch({type : ADD_MANUFACTURER, value});
      break;
      case "add-available-items" : dispatch({type : ADD_AVAILABLE_ITEMS, value});
      break;
      case "add-price" : dispatch({type : ADD_PRICE, value});
      break;
      case "add-image-url" : dispatch({type : ADD_IMAGE_URL, value});
      break;
      case "add-description" : dispatch({type : ADD_DESCRIPTION, value});
      break;
      default : return null;
    }
  }

  const handleClick=(event)=>{
    event.preventDefault();
    //check for name
    if(!addData.name){
      dispatch({type : SET_NAME_ERROR, value : true, text : "Required"});
      return;
    }else{
      dispatch({type : SET_NAME_ERROR, value : false, text : ""});
    }
    //check for category
    if(!addData.category){
      console.log("wrong")
      alert("Please select the category");
      return;
    }
    //check for manufacturer
    if(!addData.manufacturer){
      dispatch({type : SET_MANUFACTURER_ERROR, value : true, text : "Required"});
      return;
    }else{
      dispatch({type : SET_MANUFACTURER_ERROR, value : false, text : ""});
    }
    //check for availableItems
    const numberRegex = /\d+/;
    if(!addData.availableItems){
      dispatch({type : SET_AVAILABLE_ITEMS_ERROR, value : true, text : "Required"});
      return;
    }else if(!numberRegex.test(addData.availableItems)){
      dispatch({type : SET_AVAILABLE_ITEMS_ERROR, value : true, text : "Invalid entry"});
      return;
    }else{
      dispatch({type : SET_AVAILABLE_ITEMS_ERROR, value : false, text : ""});
    }
    //check for price
    if(!addData.price){
      dispatch({type : SET_PRICE_ERROR, value : true, text : "Required"});
      return;
    }else if(!numberRegex.test(addData.price)){
      dispatch({type : SET_PRICE_ERROR, value : true, text : "Invalid entry"});
      return;
    }else{
      dispatch({type : SET_PRICE_ERROR, value : false, text : ""});
    }
    const data = {
      name : addData.name,
      category : addData.category.value,
      manufacturer : addData.manufacturer,
      price : addData.price,
      availableItems : addData.availableItems,
      imageURL : addData.imageURL,
      description : addData.description
    }
    const options = {
      method : "POST",
      headers : {
        "Content-Type" : "application/json",
        'x-auth-token' : window.localStorage.getItem('auth')
      },
      body : JSON.stringify(data)
    }
    const url = `http://localhost:8000/api/products`;
    fetch(url, options)
      .then(response=>{
        if(response.status === 201){
          return response.json();
        }
        return null;
      })
      .then(res=>{
        if(res){
          window.sessionStorage.setItem('add', true);
          window.location.href="/";
        }else{
          alert("Unsuccessful");
        }
      });
  }

  return (
    <>
    <NavigationBar isLoggedIn={isLoggedIn} setLogin={setLogin} isAdmin={isAdmin} />
    <div id="add-form-container">
      <form id="add-form" >
        <Typography  variant="h1" sx={{textAlign : 'center', fontSize : "35px", fontWeight : 400, mb : "4%"}}>Add Product</Typography>
        <FormControl>
          <TextField
            required
            value={addData.name}
            onChange={handleChange}
            name = "add-name"
            label = "Name"
            error={addData.nameError}
            helperText={addData.nameHelperText}
          />   
        </FormControl>
        <FormControl>
          <SelectCategory options={options} setOptions={setOptions} value={addData.category} setValue={(value)=>dispatch({type : ADD_CATEGORY, value})} />
        </FormControl>
        <FormControl>
          <TextField
            required
            value={addData.manufacturer}
            onChange={handleChange}
            name = "add-manufacturer"
            label = "Manufacturer"
            error={addData.manufacturerError}
            helperText={addData.manufacturerHelperText}
          />
        </FormControl>
        <FormControl>
          <TextField
            required
            value={addData.availableItems}
            onChange={handleChange}
            name = "add-available-items"
            label = "Available Items"
            error={addData.availableItemsError}
            helperText={addData.availableItemsHelperText}
          />
        </FormControl>
        <FormControl>
          <TextField
            required
            value={addData.price}
            onChange={handleChange}
            name = "add-price"
            label = "Price"
            error={addData.priceError}
            helperText={addData.priceHelperText}
          />
        </FormControl>
        <FormControl>
          <TextField
            value={addData.imageURL}
            onChange={handleChange}
            name = "add-image-url"
            label = "Image URL"
            error={addData.imageUrlError}
            helperText={addData.imageUrlHelperText}
          />
        </FormControl>
        <FormControl>
          <TextField
            value={addData.description}
            onChange={handleChange}
            name = "add-description"
            label = "Product Description"
            error={addData.descriptionError}
            helperText={addData.descriptionHelperText}
          />
        </FormControl>
        <Button
          type="submit"
          variant='contained'
          fullWidth
          sx={{marginTop : "4%"}}
          onClick={handleClick}
        >SAVE PRODUCT
        </Button>
      </form>
    </div>
    </>
  )
}

export default AddProduct;