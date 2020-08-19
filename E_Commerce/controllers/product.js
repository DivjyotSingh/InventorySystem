//jshint esversion:6
const formidable = require('formidable');
const _=require('lodash');
const fs = require('fs');
const Product=require("../models/product");
const {errorHandler}=require("../helpers/dbErrorHandler");
exports.productById=function(req,res,next,id){
  Product.findById(id)
  .populate('category')
  .exec(function(err,product){

    if(err||!product){
      res.status(400).json({
        "error":"Product not found"
      });
    }
    else{
      req.product=product;
      next();
    }
  });
};
//READ PRODUCT
exports.read = (req, res) => {
    req.product.photo=undefined;

    return res.json(req.product);
};
//CREATE PRODUCT
exports.create=function(req,res){
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
      if (err) {
          return res.status(400).json({
              error: "Image could not be uploaded"
          });
      }
      // check for all fields
      const {
          id,
          name,
          description,
          price,
          category,
          quantity,
          rack,weight
      } = fields;


      if (!id||
          !name ||
          !description ||
          !price ||
          !category ||
          !quantity||!rack||!weight
      ) {

          return res.status(400).json({
              error: "All fields are required"
          });
      }
      console.log(fields);
      let product=new Product(fields);
      if(files.photo){

        if(files.photo.size>1000000){
          res.status(400).json({
            'error':'File size must be less than 1 mb'
          });
        }
        product.photo.data=fs.readFileSync(files.photo.path);
        product.photo.contentType=files.photo.type;
      }
      product.save(function(err,result){
        if(err){
          res.status(400).json({
            'error':errorHandler(err)
          });
        }
        else{
          res.json(result);
        }
      });
    }
  );

};
//REMOVE PRODUCT
exports.remove=function(req,res){
  let product=req.product;
  product.remove(function(err,deletedProduct){
      if(err){
        return res.status(400).json({
          "error":errorHandler(err)
        });
      }
      else{
        res.json({
          "message":"product deleted successfully"
        });
      }
});
};

//UPDATE Product
exports.update=function(req,res){
  let form=new formidable.IncomingForm();
  form.keepExtensions=true;
  form.parse(req,function(err,fields,files){
    if(err){
      res.status(400).json({
        'error':'Image could not be uploaded'
      });
    }
    else{
    
      let product=req.product;
      product=_.extend(product,fields);
      if(files.photo){

        if(files.photo.size>1000000){
          res.status(400).json({
            'error':'File size must be less than 1 mb'
          });
        }
        product.photo.data=fs.readFileSync(files.photo.path);
        product.photo.contentType=files.photo.type;
      }
      product.save(function(err,result){
        if(err){
          res.status(400).json({
            'error':errorHandler(err)
          });
        }
        else{
          res.json(result);
        }
      });
    }
  });

};


//PRODUCTS ON BASIS OF SELL AND ARRIVAL AND LOW STOCKS
//by sell - /products?sortBy=sold&order=desc&limit=4
//by arrival - /products?sortBy=createdAt&order=desc&limit=4
//by arrival - /products?sortBy=quantity&order=asc&limit=5
//if no params are sent then all products are returned

exports.list=function(req,res){
  let order=req.query.order?req.query.order:'asc';
  let sortBy=req.query.sortBy?req.query.sortBy:'_id';
  let limit=req.query.limit?parseInt(req.query.limit):6;

  Product.find()
  .select("-photo")
  .populate('category')
  .sort([[sortBy,order]])
  .limit(limit)
  .exec(function(err,data){
    if(err){
      return res.status(400).json({
        "error":"Products not Found"
      });
    }
    else{
      res.send(data);
    }
  });
};

//Related Products
//it will find based on the req product category
//other products that has the same category will be returned
exports.listRelated=function(req,res){
  let limit=req.query.limit?parseInt(req.query.limit):6;
  Product.find({_id:{$ne:req.product},category:req.product.category})
  .limit(limit)
  .populate('category','_id name')
  .exec(function(err,products){
    if(err){
      return res.status(400).json({
        "error":"Products not found"
      });
    }
    else{
      res.json(products);
    }
  });
};

//get categories based on product
exports.listCategories=function(req,res){
  Product.distinct("category",{},function(err,categories){
    if(err){
      return res.status(400).json({
        "error":"Categories not Found"
      });
    }
    else{
      res.json(categories);
    }
  });
};
//Products by search

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */



exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};
//product photo
exports.photo=function(req,res,next){
  if(req.product.photo.data){
    res.set('Content-Type',req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();

};

exports.listSearch = (req, res) => {
    // create query object to hold search value and category value
    const query = {};
    // assign search value to query.name
    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: "i" };
        // assigne category value to query.category
        if (req.query.category && req.query.category != "All") {
            query.category = req.query.category;
        }
        // find the product based on query object with 2 properties
        // search and category
        Product.find(query, (err, products) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(products);
        }).select("-photo");
    }
};

exports.decreaseQuantity=(req,res,next)=>{
  let bulkOps=req.body.order.products.map((item)=>{
    return{
      updateOne:{
        filter:{_id:item._id},
        update:{$inc:{quantity:-item.count,sold: +item.count}}
      }
    };
  });
  Product.bulkWrite(bulkOps,{},(error,products)=>{
    if(error){
      return res.status(400).json({
        error:"Could not update the product"
      });
    }
    next();
  });
};
