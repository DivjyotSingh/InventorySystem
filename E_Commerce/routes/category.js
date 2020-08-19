//jshint esversion:6
const express = require("express");
const router = express.Router();
const { requireSignin,isAuth,isAdmin } = require("../controllers/auth");
const { create,categoryById,read,update,remove,list } = require("../controllers/category");
const { userById } = require("../controllers/user");
//CREATE CATEGORY
router.post("/category/create/:userId",requireSignin,isAuth,isAdmin,create);
//READ CATEGORY
router.get("/category/:categoryId",read);
//UPDATE CATEGORY
router.put("/category/:categoryId/:userId",requireSignin,isAuth,isAdmin,update);
//DELETE CATEGORY
router.delete("/category/:categoryId/:userId",requireSignin,isAuth,isAdmin,remove);
//LIST
router.get("/categories",list);
router.param("userId", userById);
router.param("categoryId", categoryById);

module.exports = router;
