import React from "react";
import {Typography, Link} from "@mui/material";
import "./Footer.css";

function Footer(){
  return (
    <Typography id="copyright" >
      Copyright &copy; <Link href="https://www.upgrad.com/" target="_blank" underline="always" rel="noopener">upGrad</Link> 2021
    </Typography>
  )
}

export default Footer;