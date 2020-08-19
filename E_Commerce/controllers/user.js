//jshint esversion:6
const User = require("../models/user");
const {Order} = require('../models/order');
const {errorHandler}=require("../helpers/dbErrorHandler");

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User not found"
            });
        }
        req.profile = user;
        next();
    });
};
//See profile
exports.read=function(req,res){
  req.profile.hashed_password=undefined;
  req.profile.salt=undefined;
  return res.json(req.profile);
};
//UPDATE profile
exports.update=function(req,res){
  User.findOneAndUpdate({_id:req.profile._id},{$set:req.body},{new:true},function(err,user){
    if(err||!user){
      return res.status(400).json({
        "error":"You are not authorised to perform this action"
      });
    }
    else{
      req.profile.hashed_password=undefined;
      req.profile.salt=undefined;
      res.json(user);
    }
  });
};

exports.addOrderToUserHistory=(req,res,next)=>{
  let history=[];
  req.body.order.products.forEach((item)=>{
    history.push({
      _id: item._id,
      id:item.id,
      name:item.name,
      description:item.description,
      category:item.category,
      quantity:item.count,
      amount:req.body.order.amount,
      weight:req.body.order.weight
    });
  });
  User.findOneAndUpdate({_id:req.profile._id},{$push:{history:history}},{new:true},(err,data)=>{if(err){
    return res.status(400).json({
      error:"Could not update User order history"
    });

  }
  next();
}
);
};

exports.purchaseHistory = (req, res) => {
    Order.find({ user: req.profile._id })
        .populate("user", "_id name")
        .sort("-created")
        .exec((err, orders) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(orders);
        });
};
