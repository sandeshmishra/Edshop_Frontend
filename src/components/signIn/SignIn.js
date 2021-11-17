import React, {useReducer} from "react";
import { FormControl, TextField, Typography } from "@mui/material";
import NavigationBar from "../../common/navigationBar/NavigationBar"
import { Button } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import "./SignIn.css";
import Footer from "../../common/footer/Footer";
import { useNavigate, Link } from "react-router-dom";


const SET_EMAIL = "SET_EMAIL";
const SET_PASSWORD = "SET_PASSWORD";
const SET_EMAIL_ERROR = "SET_EMAIL_ERROR";
const SET_PASSWORD_ERROR = "SET_PASSWORD_ERROR";

const initialState ={
  email : "",
  password : "",
  emailError : false,
  passwordError : false,
  emailHelperText : "",
  passwordHelperText : ""
}

const reducer = (state, action)=>{
  switch(action.type){
    case SET_EMAIL : return  {...state, email : action.value};
    case SET_PASSWORD : return  {...state, password : action.value};
    case SET_EMAIL_ERROR : return {...state, emailError : action.value, emailHelperText : action.text};
    case SET_PASSWORD_ERROR : return {...state, passwordError : action.value, passwordHelperText : action.text};
    default : return state;
  }
}

function SignIn({isLoggedIn, setLogin, isAdmin, setAdmin}){

  const [formData, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const handleChange=(event)=>{
    const {name, value} = event.target;
    if(name === "email-signin"){
      dispatch({type : SET_EMAIL, value});
    }else{
      dispatch({type : SET_PASSWORD, value});
    }
  }

  const handleClick=(event)=>{
    event.preventDefault();
    if(formData.email.length === 0){
      dispatch({type : SET_EMAIL_ERROR, value : true, text : "Required"});
      return;
    }
    if(formData.password.length === 0){
      dispatch({type : SET_PASSWORD_ERROR, value : true, text : "Required"});
      return;
    }
    const emailRegex = /^[A-Za-z0-9\._\-]{1,}@[A-Za-z0-9\._\-]{1,}\.[a-z]{2,6}$/;
    if(!emailRegex.test(formData.email)){
      dispatch({type : SET_EMAIL_ERROR, value : true, text : "Please enter a valid email address"});
      return;
    }
    dispatch({type : SET_EMAIL_ERROR, value : false, text : ""});
    dispatch({type : SET_PASSWORD_ERROR, value : false, text : ""});
    const data = {
      email : formData.email,
      password : formData.password
    }
    const options = {
      method : "POST",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify(data)
    }
    try{
      fetch('http://localhost:8000/api/auth/login', options)
        .then(response=>{
          window.localStorage.setItem('auth', response.headers.get('x-auth-token'));
          return response.json()
        })
        .then(res=>{
          console.log(res)
          if(res.isAuthenticated){
            setLogin(true);
            setAdmin(res.isAdmin);
            window.localStorage.setItem('admin', res.isAdmin);
            navigate('/');
          }else{
            setLogin(false);
          }
        });
    } catch(err){
      console.log(err);
      return;
    }
  }

  return (
    <>
      <NavigationBar isLoggedIn={isLoggedIn} setLogin={setLogin} isAdmin={isAdmin} />
      <div className="signin-form-container">
        <div id="signin-header">
          <LockOutlinedIcon className="lock-logo" fontSize="large" />
          <Typography component="h4" variant="h4">Sign in</Typography>
        </div>
        <form id="signin-form">
          <FormControl>
            <TextField
              required
              type="email"
              name="email-signin"
              onChange={handleChange}
              value={formData.email}
              error={formData.emailError}
              helperText={formData.emailHelperText}
              label="Email Address"
            />
          </FormControl>
          <FormControl>
            <TextField
              required
              type="password"
              name="password-signin"
              onChange={handleChange}
              value={formData.password}
              error={formData.passwordError}
              helperText={formData.passwordHelperText}
              label="Password"
            />
          </FormControl>
          <Button variant="contained" fullWidth type="submit" onClick={handleClick}>
            <Typography>SIGN IN</Typography>
          </Button>
          <Link to="/signup">
            <Typography component="p">Don't have an account? Sign Up</Typography>
          </Link>
        </form>
        <div className="signin-footer">
          <Footer />
        </div>
      </div>
    </>
  ) 
}

export default SignIn;
