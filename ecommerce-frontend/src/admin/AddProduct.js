//jshint esversion:6
import React,{useState,useEffect} from 'react';
import Layout from '../core/Layout';
import {isAuthenticated} from '../auth';
import {Link} from 'react-router-dom';
import{createProduct, getCategories} from './apiAdmin';

const AddProduct=()=>{

const {user,token}=isAuthenticated();

const [values,setValues]=useState({
  id:'',
  name:'',
  description:'',
  price:'',
  categories:[],
  category:'',
  quantity:'',
  rack:'',
  photo:'',
  weight:'',
  loading:false,
  error:'',
  createdProduct:'',
  redirectToProfile:false,
  formData:''

});

const {
  id,name,description,price,category,categories,rack,weight,loading,error,createdProduct,redirectToProfile,formData,quantity
}=values;

//load categories and set form FormData
const init=()=>{
  getCategories().then(data=>{
    if(data.error){
      setValues({...values,error:data.error});
    }
    else{
      setValues({...values,categories:data,formData:new FormData});
    }
  });
};

useEffect(()=>{
  init();
},[]);
const handleChange=name=> event=>{
  const value= name ==="photo"?event.target.files[0] :event.target.value;
    formData.set(name,value);
    setValues({...values,[name]:value});


};
const clickSubmit=(event)=>{
  event.preventDefault();
  setValues({...values,error:'',loading:true});
  createProduct(user._id,token,formData)
  .then(data=>{
    if(data.error){
        setValues({...values,error:data.error});
    }
    else{
      setValues({
        ...values,id:'',
        name:'',
        description:'',
        price:'',
        category:'',
        quantity:'',
        rack:'',
        photo:'',
        weight:'',
        loading:false,
        createdProduct: data.name
      });
    }
  });
};
const newPostForm =()=>(
  <form className="mb-3" onSubmit={clickSubmit}>
    <h4> Post Photo </h4>
    <div className="form-group">
      <label className="btn btn-secondary" >
      <input onChange={handleChange("photo")} type="file" name="photo" accept="image/*"/>
      </label>
      </div>
      <div className="form-group">
        <label className="text-muted" >Product Name</label>
        <input onChange={handleChange("id")}type="text" className="form-control" value={id} />
      </div>
      <div className="form-group">
        <label className="text-muted" >Product Id</label>
        <input onChange={handleChange("name")}type="text" className="form-control" value={name} />
      </div>
      <div className="form-group">
        <label className="text-muted" >Description</label>
        <textarea onChange={handleChange("description")}type="text" className="form-control" value={description} />
      </div>
      <div className="form-group">
        <label className="text-muted" >Price</label>
        <input onChange={handleChange("price")}type="Number"  className="form-control" value={price} />
      </div>
      <div className="form-group">
        <label className="text-muted" >Category</label>
        <select onChange={handleChange("category")} className="form-control">
          <option>Please Select a Category</option>
            {categories && categories.map((c,i)=>(
              <option key={i} value={c._id}>{c.name}</option>)
            )
          }
        </select>
      </div>
      <div className="form-group">
        <label className="text-muted" >Quantity</label>
        <input onChange={handleChange("quantity")}type="Number"  className="form-control" value={quantity} />
      </div>
      <div className="form-group">
        <label className="text-muted" >Weight</label>
        <input onChange={handleChange("weight")}type="number"  className="form-control" value={weight} />
      </div>
      <div className="form-group">
        <label className="text-muted" >Rack</label>
        <input onChange={handleChange("rack")}type="text"  className="form-control" value={rack} />
      </div>

    <button className="btn btn-outline-primary">Create Product</button>

    </form>
);

const showError=()=>(
  <div className="alert alert-danger" style={{display:error?'':'none'}}>
      {error}
  </div>
);
const showSuccess=()=>(
  <div className="alert alert-info" style={{display:createdProduct?'':'none'}}>
      <h2>{`${createdProduct} is created!`}</h2>
  </div>
);

const showLoading=()=>(
  loading && (<div className="alert alert-success">
  <h2>Loading..</h2>
</div>
)

);


  return (
    <Layout title="Add a new Product" description={`Good Day ${user.name}! Ready to add a new product?`}>
        <div className="row">

          <div className="col-md-8 offset-md-2">
          {showLoading()}
          {showError()}
          {showSuccess()}
          {newPostForm()}
          </div>
        </div>
    </Layout>
  )
};

export default AddProduct;
