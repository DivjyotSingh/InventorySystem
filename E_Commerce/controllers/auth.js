//jshint esversion:6
const User=require("../models/user");
const {errorHandler}=require("../helpers/dbErrorHandler");
const jwt = require('jsonwebtoken');//to generate signed token
const expressJwt=require('express-jwt');//to authorize check
exports.signup = (req, res) => {
  console.log("req.body",req.body);
    const user=new User(req.body);
    user.save(function(err,user){
      if(err){
        return(
          res.status(400).json({
            'error':errorHandler(err)
          })
        );
      }
      else{
        user.salt=undefined;
        user.hashed_password=undefined;

        res.json({
          user
        });
      }
    });
};



exports.signin=function(req,res){
//find the user based on Email
const {email,password}=req.body;
User.findOne({email},function(err,user){
  if(err||!user){
    return res.status(400).json({
      'error':"User with that email does not exist.Please signup"
    });
  }
  //if user found make sure email and password match
  //create authenticate method in user model
  else{
    if(!user.authenticate(password)){
      return res.status(401).json({
        'error':"Email and password dont match"
      });
    }
    else {
    const token=jwt.sign({_id:user._id},process.env.JWT_SECRET);
    //persist the token as 't' in cookie with expiry date
    res.cookie('t',token,{expire:new Date()+9999});
    //return response with user and token to frontend client
    const {_id,name,email,role}=user;
        return res.json({token,user:{_id,email,name,role}});
  }
}
});

};

exports.signout=function(req,res){
  res.clearCookie('t');
  res.json({message:"Signout Success"});
};



exports.requireSignin=expressJwt({
  secret:process.env.JWT_SECRET,
  userProperty:"auth",
   algorithms: ['HS256']
});

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) {
        return res.status(403).json({
            "error": "Access denied"
        });
    }
    next();
};

exports.isAdmin=function(req,res,next){
  if(req.profile.role===0){
    return  res.status(403).json({
        'error':"Admin resource!Access Denied"
      });
  }
  next();
};
