import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {useNavigate} from "react-router-dom";

function DeleteDialog({open, close}) {

  const navigate = useNavigate();

  const handleDelete = async ()=>{
    const id = sessionStorage.getItem('product');
    const url = `http://localhost:8000/api/products/${id}`;
    const options = {
      method : 'DELETE',
      headers : {
        'Content-Type' : 'application/json',
        'x-auth-token' : window.localStorage.getItem('auth')
      }
    };
    await fetch(url, options)
    .then(response=>{
      if(response.status === 200){
        return response.json();
      }
      return null;
    })
  .then(res=>{
    if(res){
      window.sessionStorage.setItem('delete', true);
      window.location.href='/';
    }else{
      alert("Unsuccessful");
    }
  });
    close();
  }
  return (
    <div>
      <Dialog
        open={open}
        onClose={close}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Deletion of product ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this product ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} variant="contained">OK</Button>
          <Button onClick={close} variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DeleteDialog;