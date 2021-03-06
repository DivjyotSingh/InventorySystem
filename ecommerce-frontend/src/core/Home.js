//jshint esversion:6

import React,{useState,useEffect} from 'react';
import Layout from './Layout';
import {getProducts} from './apiCore';
import Card from './Card';
import Search from './Search';
const Home=()=>{

  const [productBySell,setProductsBySell]=useState([]);
  const [productByArrival,setProductsByArrival]=useState([]);
  const [productByQuantity,setProductsByQuantity]=useState([]);
  const [error,setError]=useState([]);

const loadProductsBySell=()=>{
  getProducts('sold').then(data=>{
    if(data.error){
      setError(data.error);
    }
    else{
      setProductsBySell(data);
    }
  });
};

const loadProductsByArrival=()=>{
  getProducts('createdAt').then(data=>{
    if(data.error){
      setError(data.error);
    }
    else{
      setProductsByArrival(data);
    }
  });
};
const loadProductsByQuantity=()=>{
  getProducts('quantity').then(data=>{
    if(data.error){
      setError(data.error);
    }
    else{
      setProductsByQuantity(data);
    }
  });
};


useEffect(()=>{
  loadProductsByArrival();
  loadProductsBySell();
  loadProductsByQuantity();
},[]);

  return(
  <Layout title="KARTAR VALVES" description="INVENTORY SYSTEM" className="container-fluid">
  <Search />

    <h2 className="mb-4">Best Sellers</h2>
  <div className="row">
  {productBySell.map((product,i)=>
    (<div key={i} className="col-4 mb-3">
    <Card  product={product} />
    </div>
  )
)}
  </div>
  <h2 className="mb-4">Low Stocks</h2>
  <div className="row">
  {productByQuantity.map((product,i)=>
    (<div key={i} className="col-4 mb-3">
    <Card  product={product} />
    </div>
  )
)}
  </div>
<h2 className="mb-4">New Arrivals</h2>
<div className="row">
{productByArrival.map((product,i)=>
  (<div key={i} className="col-4 mb-3">
  <Card  product={product} />
  </div>
)
)}
</div>

  </Layout>
);
};

export default Home;
