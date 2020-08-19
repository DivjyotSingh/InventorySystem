//jshint esversion:6
const express = require("express");
const router = express.Router();
const{userSignupValidator}=require("../validator");
const { signup,signin,signout,requireSignin } = require("../controllers/auth");
//SIGNUP USER
router.post("/signup",userSignupValidator,signup);
//SIGNIN USER
router.post("/signin",signin);
//SIGNOUT USER
router.get("/signout",signout);


module.exports = router;
