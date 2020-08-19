//jshint esversion:6
const Category=require("../models/category");
const {errorHandler}=require("../helpers/dbErrorHandler");
exports.categoryById=function(req,res,next,id){
  Category.findById(id).exec(function(err,category){
    if(err||!category){
      return res.status(400).json({
        "error":"Category doesnt exist"
      });
    }
    else{
      req.category=category;
      next();
    }
  });
};
//CREATE CATEGORY
exports.create=function(req,res){
  const category=new Category(req.body);
  category.save(function(err,data){
    if(err||!data){
      return res.status(400).json({
        'error':errorHandler(err)
      });
    }
    else{
      res.json({data});
    }
  });
};
//read category
exports.read=function(req,res){
  return res.json(req.category);
};
//update category
exports.update=function(req,res){
  const category=req.category;
  category.name=req.body.name;
  category.save(function(err,data){
    if(err){
      return res.status(400).json({
        "error":errorHandler(err)
      });
    }
    else{
      res.json(data);
    }
  });
};
//delete category
exports.remove=function(req,res){
  const category=req.category;

  category.remove(function(err,data){
    if(err){
      return ress.status(400).json({
        "error":errorHandler(err)
      });
    }
    else{
      res.json({
        message:"Category deleted"
      });
    }
  });
};
//GET ALL ITEMS
exports.list=function(req,res){
  Category.find().exec(function(err,data){
    if(err){
      return res.status(400).json({
        "error":errorHandler(err)
      });
    }
    else{
      res.json(data);
    }
  });
};
