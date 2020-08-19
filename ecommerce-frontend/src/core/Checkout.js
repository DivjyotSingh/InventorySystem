//jshint esversion:6

import React,{useState,useEffect} from 'react';
import Layout from './Layout';
import {getProducts,createOrder} from './apiCore';
import Card from './Card';
import {isAuthenticated} from '../auth';
import {Link } from 'react-router-dom';
import {emptyCart} from './cartHelpers';
const Checkout = ({ products, setRun = f => f, run = undefined }) => {
const userId=isAuthenticated() && isAuthenticated().user._id;
const token=isAuthenticated() && isAuthenticated().token;
const [data,setData]=useState({
  loading:false,
  success: false,
  error:"",
  address:""
});
const getTotal=()=>{
  return products.reduce((currentValue,nextValue)=>{
    return currentValue+nextValue.count * nextValue.price;
  },0);
};
const getTotalWeight=()=>{
  return products.reduce((currentValue,nextValue)=>{
    return currentValue+nextValue.count * nextValue.weight;
  },0);
};


const showError=error=>(
  <div
    className="alert alert-danger" style={{display: error ?"":"none"}}>
    Error
    </div>
);
const buy=()=>{
      setData({...data});
    const  createOrderData={
      products:products,
      amount:getTotal(),
      weight:getTotalWeight(),
      address: data.address
    }
        createOrder(userId,token,createOrderData)
        .then(response=>{
          emptyCart(()=>{
            console.log("Payment Success");
            setData({
              loading:false,
              success:true
            });
          });
        })
        .catch(error=>{
          setData({loading:false});
        });
}
const showSuccess=success=>(
  <div
    className="alert alert-info" style={{display: success ?"":"none"}}>
    Thanks! Order placed Successfully
    </div>
);
const handleAddress=event=>{
  setData({...data,address:event.target.value});
}

const showCheckout=()=>{
return(
  isAuthenticated()?(
    <button onClick={buy} className="btn btn-success">Checkout</button>
  ):(
    <Link to="/login">
    <button className="btn btn-primary">Sign in to Checkout</button>
    </Link>
  )
);
};

  return (<div>
    <h3>Total Cost: Rs {getTotal()}</h3>
    <hr />
    <h3>Total Weight: {getTotalWeight()} Kg</h3>
    <hr />
    <div className="gorm-group mb-3">
      <label className="text-muted">Delivery  Address:</label>
        <textarea
          onChange={handleAddress}
          className="form-control"
          value={data.address}
          placeholder="Type your delivery address here ..."/>
          </div>
    {showSuccess(data.success)}
    {showCheckout()}
    </div>);

};
export default Checkout;
