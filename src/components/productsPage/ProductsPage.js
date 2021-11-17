import React, { useEffect, useState } from "react";
import NavigationBar from "../../common/navigationBar/NavigationBar";
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import "./ProductsPage.css";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {Select, MenuItem, InputLabel, Alert} from "@mui/material"
import { Link, Routes, Route, useNavigate} from "react-router-dom";
import DeleteDialog from "../deleteDialog/DeleteDialog";

function ProductsPage({isLoggedIn, isAdmin, setLogin, setAdmin, addAlert, editAlert, deleteAlert, orderAlert, handleAlert}){
  const [toggleValue, setToggleValue] = useState('All');
  const [selectValue, setSelectValue] = useState('default');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [name, setName] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);

  const navigate = useNavigate();
  
  useEffect(()=>{
    if(!isLoggedIn){
      navigate('/login');
    }
    const url = "http://localhost:8000/api/products/categories";
    fetch(url)
      .then(response=>response.json())
      .then(res=>setCategories([...categories, ...res]));
  }, [])

  useEffect(()=>{
    switch(selectValue){
      case "price-ltoh" : handleSortFetch("price", "ASC", toggleValue, name);
      break;
      case "price-htol" : handleSortFetch("price", "DESC", toggleValue, name);
      break;
      case "default" : handleSortFetch(null, null, toggleValue, name);
      break;
      case "newest" : handleSortFetch("createdAt", "DESC", toggleValue, name);
      break;
      default : return null;
    }
  },[selectValue, toggleValue, name]);

  if(!isLoggedIn){
    navigate('/login');
  }

  const handleSortFetch=(type, value, category, name)=>{
    let url = `http://localhost:8000/api/products?`;
    if(name){
      url += `&name=${name}`;
    }
    if(type){
      url += `&sortBy=${type}&direction=${value}`
    }
    if(category){
      if(category !== 'All'){
        url += `&category=${toggleValue}`;
      }
    }
    console.log(url);
    fetch(url)
      .then(response=>response.json())
      .then(res=>setProducts(res.content));
  }

  const handleChange=(event, type)=>{
    const {value} = event.target;
    type === "toggle" ? setToggleValue(value) : setSelectValue(value);
  }

  const handleDeleteOpen = (id) => {
    sessionStorage.setItem('product', id);
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };




  return(
    <>
      <NavigationBar isLoggedIn={isLoggedIn} setSearchValue={setName} searchValue={name} setLogin={setLogin} isAdmin={isAdmin} setAdmin={setAdmin} />
        <div id="toggle-btn-container">
          {addAlert && <Alert id="add-alert" onClose={() => handleAlert("add", false)}>Succesfully added the product !</Alert>}
          {editAlert && <Alert id="edit-alert" onClose={() => handleAlert("edit", false)}>Succesfully edited the product !</Alert>}
          {deleteAlert && <Alert id="delete-alert" onClose={() => handleAlert("delete", false)}>Succesfully deleted the product !</Alert>}
          {orderAlert && <Alert id="order-alert" onClose={() => handleAlert("order", false)}>Succesfully ordered the product !</Alert>}
          <ToggleButtonGroup exclusive={true} value={toggleValue} onChange={e=>handleChange(e,"toggle")}>
            {categories.map(item=>(
              <ToggleButton key={item} value={item}>{item}</ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>
        <div id="select-container">
          <InputLabel htmlFor="select-input" sx={{fontWeight : 500}}>Sort By : </InputLabel>
          <Select
            sx={{width : "20%"}}
            onChange={e=>handleChange(e,"select")}
            value={selectValue}
            inputProps={{
              'id' : "select-input"
            }}
          >
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="price-htol">Price : High to Low</MenuItem>
            <MenuItem value="price-ltoh">Price : Low to High</MenuItem>
            <MenuItem value="newest">Price : Newest</MenuItem>
          </Select>
        </div>
        <Grid id="grid-container" container columns={8} columnSpacing={5} rowSpacing={5}>
          {products.map(item=>(
            <Grid key={item.productId} item lg={2} md={2} xs={2} sx={{display : "flex"}} >
                <Card sx={{display: 'flex', flexDirection: 'column'}}>
                  <div>
                  <CardMedia
                    component="img"
                    height="240"
                    image={item.imageURL}
                    alt={item.name}
                  />
                  </div>
                  <CardContent>
                    <div className="card-header">
                      <Typography gutterBottom variant="h5" component="div">
                        {item.name}
                      </Typography>
                      <Typography gutterBottom variant="h5" component="div">
                        <>&#8377;</>{`${item.price}`}
                      </Typography>
                    </div>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{marginTop : "auto"}}>
                      <div className="btns-container">
                        <Link to={`/product/${item.productId}`}>
                          <Button
                            variant="contained"
                            size="small"
                          >Buy
                          </Button>
                        </Link>
                        {isAdmin && 
                        <ButtonGroup variant="string">
                          <Link to={`/editProduct/${item.productId}`}>
                            <Button size="small"><EditIcon /></Button>
                          </Link>
                            <Button size="small" onClick={(e)=>handleDeleteOpen(item.productId)}><DeleteIcon /></Button>
                        </ButtonGroup>}
                      </div>
                  </CardActions>
                </Card>
            </Grid>
          ))}
        </Grid>
        <DeleteDialog open={deleteOpen} close={handleDeleteClose} />
    </>
  )
}

export default ProductsPage;