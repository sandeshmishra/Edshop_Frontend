import React, {useState, useReducer, useEffect} from "react";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {InputLabel, MenuItem, Select, OutlinedInput, FormControl, TextField} from '@mui/material';
import ConfirmPage from "../confirmPage/ConfirmPage";
import "./OrderPage.css"
import {useParams, useLocation, useNavigate} from 'react-router-dom';
import NavigationBar from "../../common/navigationBar/NavigationBar";


const ADD_NAME = "ADD_NAME";
const ADD_CONTACT_NUMBER = "ADD_CONTACT_NUMBER";
const ADD_STREET = "ADD_STREET";
const ADD_CITY = "ADD_CITY";
const ADD_STATE = "ADD_STATE";
const ADD_LANDMARK = "ADD_LANDMARK";
const ADD_ZIPCODE = "ADD_ZIPCODE";
const SET_NAME_ERROR = "SET_NAME_ERROR";
const SET_CONTACT_NUMBER_ERROR = "SET_CONTACT_NUMBER_ERROR";
const SET_STREET_ERROR = "SET_STREET_ERROR";
const SET_CITY_ERROR = "SET_CITY_ERROR";
const SET_STATE_ERROR = "SET_STATE_ERROR";
const SET_LANDMARK_ERROR = "SET_LANDMARK_ERROR";
const SET_ZIPCODE_ERROR = "SET_ZIPCODE_ERROR";

const steps = ['Items', 'Select Address', 'Confirm Order'];

const initialAddress = {
  name : "",
  contactNumber : "",
  street : "",
  city : "",
  state : "",
  landmark : "",
  zipcode : "",
  nameError : false,
  contactNumberError : false,
  streetError : false,
  cityError : false,
  stateError : false,
  landmarkError : false,
  zipcodeError : false,
  nameHelperText : "",
  contactNumberHelperText : "",
  streetHelperText : "",
  cityHelperText : "",
  stateHelperText : "",
  landmarkHelperText : "",
  zipcodeHelperText : ""
}

const reducer = (state, action)=>{
  switch(action.type){
    case ADD_NAME : return {...state, name : action.value};
    case ADD_CONTACT_NUMBER : return {...state, contactNumber : action.value};
    case ADD_STREET : return {...state, street : action.value};
    case ADD_CITY : return {...state, city : action.value};
    case ADD_STATE : return {...state, state : action.value};
    case ADD_LANDMARK : return {...state, landmark : action.value};
    case ADD_ZIPCODE : return {...state, zipcode : action.value};
    case SET_NAME_ERROR : return {...state, nameError : action.value, nameHelperText : action.text};
    case SET_CONTACT_NUMBER_ERROR : return {...state, contactNumberError : action.value, contactNumberHelperText : action.text};
    case SET_STREET_ERROR : return {...state, streetError : action.value, streetHelperText : action.text};
    case SET_CITY_ERROR : return {...state, cityError : action.value, cityHelperText : action.text};
    case SET_STATE_ERROR : return {...state, stateError : action.value, stateHelperText : action.text};
    case SET_LANDMARK_ERROR : return {...state, landmarkError : action.value, landmarkHelperText : action.text};
    case SET_ZIPCODE_ERROR : return {...state, zipcodeError : action.value, zipcodeHelperText : action.text};
    default : return state;
  }
}

function OrderPage({isLoggedIn, setLogin, isAdmin, setAdmin, handleAlert}){
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [address, setAddress] = useState("");
  const [addressData, dispatch] = useReducer(reducer, initialAddress);
  const [product, setProduct] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [addressId, setAddressId] = useState("");
  const [userId, setUserId] = useState("");
  
  const {id} = useParams();
  const location = useLocation();
  const quantity = parseInt(location.search.split("=")[1]);

  const navigate = useNavigate();
  
  useEffect(()=>{
    const url = `http://localhost:8000/api/products/${id}`;
    fetch(url)
    .then(response=>response.json())
    .then(res=>setProduct(res));
  }, [])
  
  
  if(!isLoggedIn){
    navigate('/login')
  }
  
  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    if(activeStep === 1){
      if(!address){
        alert("PLease select address");
        return;
      }
    }
    if(activeStep === steps.length -1){
      const url = 'http://localhost:8000/api/orders';
      const data = {
        productId : localStorage.getItem('productId'),
        addressId : address.id,
        quantity
      }
      const options = {
        method : 'POST',
        headers : {
          'Content-Type' : "application/json",
          'x-auth-token' : window.localStorage.getItem('auth')
        },
        body : JSON.stringify(data)
      }
      fetch(url, options)
        .then(response=>{
          if(response.status === 201){
            return response.json();
          }
          return null;
        })
        .then(res=>{
          if(res){
            handleAlert('order', true);
            console.log("all fine with res");
          }
        });
        
    }
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (event) => {
    const {name, value} = event.target;
    switch(name){
      case "address-select" : setAddress(value);
      break;
      case "address-name" : dispatch({type : ADD_NAME, value})
      break;
      case "address-contact-number" : dispatch({type : ADD_CONTACT_NUMBER, value})
      break;
      case "address-street" : dispatch({type : ADD_STREET, value})
      break;
      case "address-city" : dispatch({type : ADD_CITY, value})
      break;
      case "address-state" : dispatch({type : ADD_STATE, value})
      break;
      case "address-landmark" : dispatch({type : ADD_LANDMARK, value})
      break;
      case "address-zipcode" : dispatch({type : ADD_ZIPCODE, value})
      break;
      default : return null;
    }

  };

  const handleClick=async (event)=>{
    event.preventDefault();
    //check for name
    const nameRegex = /^[^\d]+$/;
    if(!addressData.name){
      dispatch({type : SET_NAME_ERROR, value : true, text : "Please enter your name"});
      return;
    }
    else if(!nameRegex.test(addressData.name)){
      dispatch({type : SET_NAME_ERROR, value : true, text : "Invalid Entry"});
      return;
    }else {
      dispatch({type : SET_NAME_ERROR, value : false, text : ""});
    }
    //check for contact number
    const contactRegex = /^(\+91 ?)?\d{10}$/;
    if(!addressData.contactNumber){
      dispatch({type : SET_CONTACT_NUMBER_ERROR, value : true, text : "Please enter your contact number"});
      return;
    }
    else if(!contactRegex.test(addressData.contactNumber)){
      dispatch({type : SET_CONTACT_NUMBER_ERROR, value : true, text : "Invalid Entry"});
      return;
    }else {
      dispatch({type : SET_CONTACT_NUMBER_ERROR, value : false, text : ""});
    }
    //check for street
    if(!addressData.street){
      dispatch({type : SET_STREET_ERROR, value : true, text : "Please enter your street"});
      return;
    } else{
      dispatch({type : SET_STREET_ERROR, value : false, text : ""});
    }
    //check for city
    if(!addressData.city){
      dispatch({type : SET_CITY_ERROR, value : true, text : "Please enter your city"});
      return;
    } else{
      dispatch({type : SET_CITY_ERROR, value : false, text : ""});
    }
    //check for state
    if(!addressData.state){
      dispatch({type : SET_STATE_ERROR, value : true, text : "Please enter your state"});
      return;
    } else{
      dispatch({type : SET_STATE_ERROR, value : false, text : ""});
    }
    //check for zipcode
    if(!addressData.zipcode){
      dispatch({type : SET_ZIPCODE_ERROR, value : true, text : "Please enter your zipcode"});
      return;
    } else{
      dispatch({type : SET_ZIPCODE_ERROR, value : false, text : ""});
    }
    const url = "http://localhost:8000/api/addresses"
    const data = {
      name : addressData.name,
      contactNumber : addressData.contactNumber,
      street : addressData.street,
      city : addressData.city,
      state : addressData.state,
      landmark : addressData.landmark,
      zipcode : addressData.zipcode
    };
    const options = {
      method : "POST",
      headers : {
        "Content-Type" : "application/json",
        'x-auth-token' : window.localStorage.getItem('auth')
      },
      body : JSON.stringify(data)
    };
    
    const newAddress = {...data};
    
    await fetch(url, options)
      .then(response=>response.json())
      .then(res=>{
        console.log("res ",res);
        console.log("res._id ",res.address._id);
        // setAddressId(res._id);
        newAddress.id = res.address._id;
      });
      debugger;
    console.log("new address : ", newAddress);
    setSavedAddresses([...savedAddresses, newAddress]);
  }

  return (
    <>
    <NavigationBar isLoggedIn={isLoggedIn} setLogin={setLogin} isAdmin={isAdmin} setAdmin={setAdmin} />
    <Box sx={{ width: '100%' }} id="order-container">
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <>
          {navigate('/')}
        </>
      ) : (
        <>
          {activeStep === 0 &&
          <div id="order-product-container">
            <div id="order-product-image-container">
              <img id="order-product-image" src={product.imageURL}/>
            </div>
            <div id="order-product-details">
              <div id="order-details-header">
                <Typography component="h1" variant="h1" id="order-product-name">{product.name}</Typography>
              </div>
              <Typography>Quantity : <b>{quantity}</b></Typography>
              <Typography>Category : <b>{product.category}</b></Typography>
              <Typography className="italic">{product.description}</Typography>
              <Typography className="price">{product.price * quantity}</Typography>
            </div>
          </div>}
          {activeStep === 1 &&
          <div>
            <div id="address-container">
              <div id="address-select-container">
                <InputLabel htmlFor="address-input" sx={{fontWeight : 500}}>Select Address : </InputLabel>
                <Select
                  sx={{width : "40%"}}
                  onChange={handleChange}
                  value={address}
                  inputProps={{
                    'id' : "address-input",
                    'name' : "address-select"
                  }}
                >
                  {savedAddresses.map((item, index)=>{
                    return <MenuItem key={item+index} value={item}>{`${item.name}...${item.city} -> ${item.state}`}</MenuItem>
                  })}
                </Select>
              </div>
              <Typography>-- OR --</Typography>
              <form id="address-form">
                <Typography>Add Address</Typography>
                <FormControl>
                  <TextField
                    required
                    type="text"
                    name="address-name"
                    label='Name'
                    value={addressData.name}
                    error={addressData.nameError}
                    helperText={addressData.nameHelperText}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <TextField
                    required
                    type="text"
                    name="address-contact-number"
                    label='Contact Number'
                    value={addressData.contactNumber}
                    error={addressData.contactNumberError}
                    helperText={addressData.contactNumberHelperText}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <TextField
                    required
                    type="text"
                    name="address-street"
                    label='Street'
                    value={addressData.street}
                    error={addressData.streetError}
                    helperText={addressData.streetHelperText}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <TextField
                    required
                    type="text"
                    name="address-city"
                    label='City'
                    value={addressData.city}
                    error={addressData.cityError}
                    helperText={addressData.cityHelperText}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <TextField
                    required
                    type="text"
                    name="address-state"
                    label='State'
                    value={addressData.state}
                    error={addressData.stateError}
                    helperText={addressData.stateHelperText}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <TextField
                    type="text"
                    name="address-landmark"
                    label='Landmark'
                    value={addressData.landmark}
                    error={addressData.landmarkError}
                    helperText={addressData.landmarkHelperText}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <TextField
                    required
                    type="text"
                    name="address-zipcode"
                    label='Zip Code'
                    value={addressData.zipcode}
                    error={addressData.zipcodeError}
                    helperText={addressData.zipcodeHelperText}
                    onChange={handleChange}
                  />
                </FormControl>
                <Button type="submit" onClick={handleClick} fullWidth variant="contained">SAVE ADDRESS</Button>
              </form>
            </div>
          </div>}
          {activeStep === 2 && <ConfirmPage product={product} quantity={quantity} address={JSON.stringify(address)} />}
          <Box id="stepper-btns" sx={{ display: 'flex', flexDirection: 'row' }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Button variant="contained" onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
            </Button>
          </Box>
        </>
      )}
    </Box>
    </>
  );
}

export default OrderPage;