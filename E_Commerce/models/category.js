//jshint esversion:6
const mongoose = require('mongoose');


//Schemas
const categorySchema=new mongoose.Schema({
  name:{
    type:String,
    trim:true,
    required:true,
    maxlength:32,
    unique: true
  }

},{timestamps:true});

module.exports=mongoose.model("Category",categorySchema);
