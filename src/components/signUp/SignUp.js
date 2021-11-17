import React, {useReducer} from "react";
import { FormControl, TextField, Typography } from "@mui/material";
import NavigationBar from "../../common/navigationBar/NavigationBar"
import { Button } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Footer from "../../common/footer/Footer";
import "./SignUp.css";
import {Link, useNavigate} from "react-router-dom";

const SET_FIRSTNAME = "SET_FIRSTNAME";
const SET_LASTNAME = "SET_LASTNAME";
const SET_EMAIL = "SET_EMAIL";
const SET_PASSWORD = "SET_PASSWORD";
const SET_CONFIRM_PASSWORD = "SET_CONFIRM_PASSWORD";
const SET_CONTACT = "SET_CONTACT";
const SET_FIRSTNAME_ERROR = "SET_FIRSTNAME_ERROR";
const SET_LASTNAME_ERROR = "SET_LASTNAME_ERROR";
const SET_EMAIL_ERROR = "SET_EMAIL_ERROR";
const SET_PASSWORD_ERROR = "SET_PASSWORD_ERROR";
const SET_CONFIRM_PASSWORD_ERROR = "SET_CONFIRM_PASSWORD_ERROR";
const SET_CONTACT_ERROR = "SET_CONTACT_ERROR";

const initialState ={
  firstName : "",
  lastName : "",
  email : "",
  password : "",
  confirmPassword : "",
  contactNumber : "",
  firstNameError: false,
  lastNameError : false,
  emailError : false,
  passwordError : false,
  comfirmPasswordError : false,
  contactNumberError : false,
  firstNameHelperText : "",
  lastNameHelperText : "",
  emailHelperText : "",
  passwordHelperText : "",
  contactNumberHelperText : "",
  confirmPasswordHelperText : ""
}

const reducer = (state, action)=>{
  switch(action.type){
    case SET_FIRSTNAME : return  {...state, firstName : action.value};
    case SET_LASTNAME : return  {...state, lastName : action.value};
    case SET_EMAIL : return  {...state, email : action.value};
    case SET_PASSWORD : return  {...state, password : action.value};
    case SET_CONFIRM_PASSWORD : return  {...state, confirmPassword : action.value};
    case SET_CONTACT : return  {...state, contactNumber : action.value};
    case SET_FIRSTNAME_ERROR : return {...state, firstNameError : action.value, firstNameHelperText : action.text};
    case SET_LASTNAME_ERROR : return {...state, lastNameError : action.value, lastNameHelperText : action.text};
    case SET_EMAIL_ERROR : return {...state, emailError : action.value, emailHelperText : action.text};
    case SET_PASSWORD_ERROR : return {...state, passwordError : action.value, passwordHelperText : action.text};
    case SET_CONFIRM_PASSWORD_ERROR : return {...state, confirmPasswordError : action.value, confirmPasswordHelperText : action.text};
    case SET_CONTACT_ERROR : return {...state, contactNumberError : action.value, contactNumberHelperText : action.text};
    default : return state;
  }
}

function SignUp({isLoggedIn}){

  const navigate = useNavigate();
  const [formData, dispatch] = useReducer(reducer, initialState);

  const requiredActionCreator=(type, isFilled)=>{
    return isFilled ? dispatch({type, value : false, text : ""}) : dispatch({type, value: true, text : "Required"})
  }

  const invalidActionCreator=(type, value, text)=>{
    return dispatch({type, value, text})
  }

  const handleChange=(event)=>{
    const {name, value} = event.target;
    switch(name){
      case "firstname-signup" : return dispatch({type : SET_FIRSTNAME, value : value.trim()});
      case "lastname-signup" : return dispatch({type : SET_LASTNAME, value : value.trim()});
      case "email-signup" : return dispatch({type : SET_EMAIL, value : value.trim()});
      case "password-signup" : return dispatch({type : SET_PASSWORD, value});
      case "confirm-password-signup" : return dispatch({type : SET_CONFIRM_PASSWORD, value});
      case "contact-number-signup" : return dispatch({type : SET_CONTACT, value : value.trim()});
      default : return null;
    }
  }

  const handleClick= async (event)=>{
    event.preventDefault();
    //test for empty fields
    if(!formData.firstName){
      requiredActionCreator(SET_FIRSTNAME_ERROR, false);
    }else{
      requiredActionCreator(SET_FIRSTNAME_ERROR, true);
    }
    if(!formData.lastName){
      requiredActionCreator(SET_LASTNAME_ERROR, false);
    }else{
      requiredActionCreator(SET_LASTNAME_ERROR, true);
    }
    if(!formData.email){
      requiredActionCreator(SET_EMAIL_ERROR, false);
    }else{
      requiredActionCreator(SET_EMAIL_ERROR, true);
    }
    if(!formData.password){
      requiredActionCreator(SET_PASSWORD_ERROR, false);
    }else{
      requiredActionCreator(SET_PASSWORD_ERROR, true);
    }
    if(!formData.confirmPassword){
      requiredActionCreator(SET_CONFIRM_PASSWORD_ERROR, false);
    }else{
      requiredActionCreator(SET_CONFIRM_PASSWORD_ERROR, true);
    }
    if(!formData.contactNumber){
      requiredActionCreator(SET_CONTACT_ERROR, false);
    }else{
      requiredActionCreator(SET_CONTACT_ERROR, true);
    }
    // test for valid name
    const nameRegex = /^\w+$/;
    if(!nameRegex.test(formData.firstName)){
      invalidActionCreator(SET_FIRSTNAME_ERROR, true, "Please check the spelling");
    }else{
      invalidActionCreator(SET_FIRSTNAME_ERROR, false, "");
    }
    if(!nameRegex.test(formData.lastName)){
      invalidActionCreator(SET_LASTNAME_ERROR, true, "Please check the spelling");
    }else{
      invalidActionCreator(SET_LASTNAME_ERROR, false, "");
    }
    // test for valid email
    const emailRegex = /^[A-Za-z0-9\._\-]{1,}@[A-Za-z0-9\._\-]{1,}\.[a-z]{2,6}$/;
    if(!emailRegex.test(formData.email)){
      invalidActionCreator(SET_EMAIL_ERROR, true, "Please enter a valid email address");
    }else{
      invalidActionCreator(SET_EMAIL_ERROR, false, "");
    }
    // test for valid contact number
    const contactRegex = /^(\+91 ?)?\d{10}$/
    if(!contactRegex.test(formData.contactNumber)){
      invalidActionCreator(SET_CONTACT_ERROR, true, "Please enter your 10 digit contact number");
    }else{
      invalidActionCreator(SET_CONTACT_ERROR, false, "");
    }
    // test for password matching
    if(!(formData.password === formData.confirmPassword)){
      invalidActionCreator(SET_CONFIRM_PASSWORD_ERROR, true, "Passwords doesn't match");
    }else{
      invalidActionCreator(SET_CONFIRM_PASSWORD_ERROR, false, "");
    }
    const error = formData.firstNameHelperText + formData.lastNameHelperText + formData.emailHelperText +
                    formData.passwordHelperText + formData.confirmPasswordHelperText + formData.contactNumberHelperText ==="";
    const initial = formData.firstName + formData.lastName + formData.email + formData.password +
                      formData.confirmPassword + formData.contactNumber === "";
    if(!error && !initial){
      const data = {
        firstName : formData.firstName,
        lastName : formData.lastName,
        email : formData.email,
        password : formData.password,
        contactNumber : formData.contactNumber
      }
      const options = {
        method : "POST",
        headers : {
          "Content-Type" : "application/json"
        },
        body : JSON.stringify(data)
      }
      try{
        fetch('http://localhost:8000/api/auth/signup', options)
          .then(response=>response.json())
          .then(result=>{
            console.log(result)
            alert("Please login");
            navigate('/login');
          });
      } catch(err){
        console.log(err);
        return;
      }
    }
  }

  return (
    <>
      <NavigationBar isLoggedIn={isLoggedIn} />
      <div className="form-container">
        <div id="signup-header">
          <LockOutlinedIcon className="lock-logo" fontSize="large" />
          <Typography component="h4" variant="h4">Sign up</Typography>
        </div>
        <form id="signup-form">
        <FormControl>
            <TextField
              required
              type="text"
              name="firstname-signup"
              onChange={handleChange}
              value={formData.firstName}
              error={formData.firstNameError}
              helperText={formData.firstNameHelperText}
              label="First Name"
              // InputLabelProps={{ shrink: true }}
            />
          </FormControl>
          <FormControl>
            <TextField
              required
              type="text"
              name="lastname-signup"
              onChange={handleChange}
              value={formData.lastName}
              error={formData.lastNameError}
              helperText={formData.lastNameHelperText}
              label="Last Name"
              // InputLabelProps={{ shrink: true }}
            />
          </FormControl>
          <FormControl>
            <TextField
              required
              type="email"
              name="email-signup"
              onChange={handleChange}
              value={formData.email}
              error={formData.emailError}
              helperText={formData.emailHelperText}
              label="Email Address"
              // InputLabelProps={{ shrink: true }}
            />
          </FormControl>
          <FormControl>
            <TextField
              required
              type="password"
              name="password-signup"
              onChange={handleChange}
              value={formData.password}
              error={formData.passwordError}
              helperText={formData.passwordHelperText}
              label="Password"
              // InputLabelProps={{ shrink: true }}
            />
          </FormControl>
          <FormControl>
            <TextField
              required
              type="password"
              name="confirm-password-signup"
              onChange={handleChange}
              value={formData.confirmPassword}
              error={formData.confirmPasswordError}
              helperText={formData.confirmPasswordHelperText}
              label="Confirm Password"
              // InputLabelProps={{ shrink: true }}
            />
          </FormControl>
          <FormControl>
            <TextField
              required
              type="text"
              name="contact-number-signup"
              onChange={handleChange}
              value={formData.contactNumber}
              error={formData.contactNumberError}
              helperText={formData.contactNumberHelperText}
              label="Contact Number"
              // InputLabelProps={{ shrink: true }}
            />
          </FormControl>
          <Button variant="contained" fullWidth={true} type="submit" onClick={handleClick}>
            <Typography>SIGN UP</Typography>
          </Button>
          <Link to="/login">
            <Typography component="p" style={{textAlign : "right"}}>Already have an account? Sign In</Typography>
          </Link>
        </form>
        <div className="signup-footer">
          <Footer />
        </div>
      </div>
    </>
  ) 
}

export default SignUp;
