//jshint esversion:6

import React from'react';

import {BrowserRouter,Switch,Route} from 'react-router-dom';
import Register from './user/Register';
import Login from './user/Login';
import Home from './core/Home';
import Dashboard from './user/UserDashboard';
import AdminDashboard from './user/AdminDashboard';
import PrivateRoute from './auth/PrivateRoute';
import AdminRoute from './auth/AdminRoute';
import AddCategory from './admin/AddCategory';
import AddProduct from './admin/AddProduct';
import UpdateProduct from './admin/UpdateProduct';
import Shop from './core/Shop';
import Product from './core/Product';
import Cart from './core/Cart';
import Orders from './admin/Orders';
import ManageProducts from './admin/ManageProducts';

import Profile from './user/Profile';
const Routes=()=>{
  return(
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home}/>
        <Route path="/login" exact component={Login}/>
        <Route path="/register" exact component={Register}/>
        <Route path="/shop" exact component={Shop}/>
        <PrivateRoute path="/user/dashboard" exact component={Dashboard}/>
        <AdminRoute path="/admin/dashboard" exact component={AdminDashboard}/>
        <AdminRoute path="/create/category" exact component={AddCategory}/>
        <AdminRoute path="/create/product" exact component={AddProduct}/>
          <Route path="/product/:productId" exact component={Product}/>
          <Route path="/cart" exact component={Cart}/>
            <AdminRoute path="/admin/orders" exact component={Orders}/>
            <PrivateRoute path="/profile/:userId" exact component={Profile}/>
            <AdminRoute path="/admin/products" exact component={ManageProducts}/>
            <AdminRoute path="/admin/product/update/:productId" exact component={UpdateProduct}/>

        </Switch>
    </BrowserRouter>

  );
};

export default Routes;
