import React, { useState } from "react";
import "./NavigationBar.css";
import { styled, alpha } from '@mui/material/styles'
import { AppBar, Typography, Toolbar } from "@material-ui/core";
import Button from '@mui/material/Button'
import InputBase from '@mui/material/InputBase';
import  SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { ButtonGroup } from '@mui/material';
import {Link} from "react-router-dom";


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

function NavigationBar({isLoggedIn, searchValue, setSearchValue, setLogin, isAdmin, setAdmin}){

  const handleChange=(event)=>{
    const {value} = event.target;
    setSearchValue(value);
  }

  const handleLogout=()=>{
    setLogin(false);
    if(isAdmin){
      setAdmin(false);
    }
    localStorage.removeItem('auth');
    localStorage.removeItem('admin');
  }

  return(
  <AppBar position="fixed" color="primary">
    <Toolbar className="toolBar">
      <div id="logo">
        <ShoppingCartIcon />
        <Typography variant="h6">
          upGrad E-Shop
        </Typography>
      </div>
      {isLoggedIn && <Search id="search-bar">
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search' }}
          value={searchValue}
          onChange={handleChange}
        />
      </Search>}
      <ButtonGroup>
        {isLoggedIn && 
          <Link to="/">
            <Button variant="string">
              <Typography className="button-text">
                Home
              </Typography>
            </Button>
          </Link>}
        {(isAdmin && isLoggedIn) && 
          <Link to="/addproduct">
            <Button variant="string">
              <Typography className="button-text">
                  Add Product
              </Typography>
            </Button>
          </Link>}
        {!isLoggedIn && 
          <div>
            <Link to="/login">
              <Button variant="string">
                <Typography className="button-text">
                  Login
                </Typography>
              </Button>
            </Link>
            <Link to="/signup" >
              <Button variant="string">
                <Typography className="button-text">
                  SignUp
                </Typography>
              </Button>
            </Link>
          </div>
        }
        {isLoggedIn && 
        <Button variant="contained" color="error" onClick={handleLogout}>
          <Typography>
            Logout
          </Typography>
        </Button>}
      </ButtonGroup>
    </Toolbar>
  </AppBar>
  )
}

export default NavigationBar;