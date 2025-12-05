import { read } from "fs";
import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";


const addProduct = asyncHandler(async(req,res) => {
   try {
    const {
      name,
      description,
      price,
      category,
      quantity,
      brand,
      countInStock } = req.fields;
     

    switch(true){
      case !name:
        return res.json({error:"Name is required"});
      case !description:
        return res.json({error: "Description is required"});
      case !price:
          return res.json({error: "price is required"});
      case !category:
          return res.json({error: "category is required"});
      case !quantity:
          return res.json({error: "quantity is required"});
      case !brand:
          return res.json({error: "brand is required"});
      case !countInStock:
          return res.json({error: "Count In Stock is required"});

    }
    
    const product = new Product({...req.fields});
    await product.save();
    res.json(product);



   } catch (error) {

    console.error(error);
    res.status(404).json(error.message);
    


   }
});


const updateProductDetails = asyncHandler(async(req,res) => {
      try {
        const {
          name,
          description,
          price,
          category,
          quantity,
          brand,
          countInStock,
          image
          } = req.fields;
     

    switch(true){
      case !name:
        return res.json({error:"Name is required"});
      case !description:
        return res.json({error: "Description is required"});
      case !price:
          return res.json({error: "price is required"});
      case !category:
          return res.json({error: "category is required"});
      case !quantity:
          return res.json({error: "quantity is required"});
      case !brand:
          return res.json({error: "brand is required"});
       
      case !countInStock:
          return res.json({error: "Count In Stock is required"});
      case !image:
          return res.json({error:'Image is not provided'});
    }
    
    const product = await Product.findByIdAndUpdate(req.params.id, {...req.fields},
      { new : true});

     

    res.json(product);


        
      } catch (error) {
        console.error(error);
        res.status(400).json(error.message);

      }
});

const removeProduct = asyncHandler(async(req,res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json(product);

  } catch (error) {
    console.error(error);
    res.status(500).json({error:"Server Error"});

  }
})

const fetchProducts = asyncHandler(async(req,res) => {
  try {
    const pageSize = 6;
    const keyword = req.query.keyword ? {name: {$regex: req.query.keyword, $options: "i"}} : {} ;
    const count = await Product.countDocuments({...keyword});
    const products = await Product.find({...keyword}).limit(pageSize);

    res.json({
      products,
      page: 1,
      pages: Math.ceil(count/pageSize),
      hasMore: false
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Server error"});

  }
});


const fetchProductById = asyncHandler(async(req,res) => {
  try {
    const product = await Product.findById(req.params.id);

    if(product){
      return res.json(product);

    }else{
      res.status(404);
      throw new Error("Product not found");

    }
  } catch (error) {
    console.error(error);
    res.status(404).json({error: "Product not found"});

  }
});

const getAllProducts = asyncHandler(async(req,res) => {
      try {

        const products = await Product.find({}).populate('category').limit(12).sort({createdAt: -1});

        if (products.length === 0) {
        return res.status(404).json({ error: "No products found" });
        }

        res.json(products);
        


        
      } catch (error) {
        console.error(error);
        res.status(500).json({error: "Server Error"});

      }
})

const addProductReview = asyncHandler(async(req,res) => {
  try {
    const {rating,comment} = req.body;
    const product = await Product.findById(req.params.id);

    if(product){
      const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());

      if(alreadyReviewed){
        res.status(400);
        throw new Error("Product is already reviewed");

      }

      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id
      }
      product.reviews.push(review);
      product.numReview = product.reviews.length;
      const totalRating = product.reviews.reduce((acc,item) => item.rating + acc,0);
      product.rating = product.reviews.length > 0 ? totalRating / product.reviews.length : 0;



      await product.save();
      res.status(201).json({message: "Review Added"});

    }else{
      res.status(404);
      throw new Error("Product not found");

    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);

  }
});

const fetchTopProducts = asyncHandler(async(req,res) => {
  try {
    const products = await Product.find({}).sort({rating: -1}).limit(4);
    res.json(products);


  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
})


const getNewProducts = asyncHandler(async(req,res) => {
  try {
    const products = await Product.find({}).sort({createdAt: -1}).limit(4);
    res.json(products);
  
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
})


export {addProduct, updateProductDetails, removeProduct, fetchProducts,fetchProductById, getAllProducts, addProductReview, fetchTopProducts, getNewProducts};

