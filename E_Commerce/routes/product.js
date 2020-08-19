//jshint esversion:6
const express = require("express");
const router = express.Router();
const {
  requireSignin,
  isAuth,
  isAdmin
} = require("../controllers/auth");
const {
  create
} = require("../controllers/product");
const {
  userById
} = require("../controllers/user");
const {
  productById,read,remove,update,list,listRelated,listCategories,listBySearch,photo,listSearch
} = require("../controllers/product");
//CREATE PRODUCT
router.post("/product/create/:userId", requireSignin, isAuth, isAdmin, create);
//GET PRODUCT
router.get("/product/:productId",read);
//DELETE PRODUCT
router.delete("/product/:productId/:userId",requireSignin, isAuth, isAdmin,remove);
//UPDATE PRODUCT
router.put("/product/:productId/:userId",requireSignin, isAuth, isAdmin,update);
router.param("userId", userById);
router.param("productId", productById);
//get all product
router.get("/products",list);
//related products
router.get("/products/related/:productId",listRelated);
//categories
router.get("/products/categories",listCategories);
//Products search
// route - make sure its post
router.post("/products/by/search", listBySearch);
router.get("/products/search", listSearch);
//product PHOTO
router.get("/product/photo/:productId",photo);

module.exports = router;
