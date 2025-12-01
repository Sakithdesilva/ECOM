import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";


const addProduct = asyncHandler(async(req,res) => {
   try {
    const {name, description, price, category, quantity, brand} = req.fields;
     

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
    }
    
    const product = new Product({...req.fields});
    await product.save();
    res.json(product);



   } catch (error) {

    console.error(error);
    res.status(404).json(error.message);
    


   }
});


export {addProduct};

