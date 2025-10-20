import express from 'express';
import {Product} from '../Model/products.js';
const router = express.Router();
import apiKeyAuth from '../Middleware/Authenticator.js';
import pagination from '../Middleware/pagination.js';
import { validateCreateProduct, validateUpdateProduct } from '../Middleware/inputValidation.js';


import 'dotenv/config';

// Apply API key authentication middleware to all routes
router.use(apiKeyAuth);
router.use(pagination);



// Sample route
router.get('/', (req, res) => {
    res.send('Hello World!');
});

//Get a list of all products
router.get('/api/products', async (req, res) => {

    try{
    const products = await Product.find({});
    res.json({ products }); 
    }catch(error){
        res.status(500).json({message: 'Server Error'});
    }
    
});

// Filter via category
router.get('/api/products/category', async (req, res) =>{

    const {category} = req.query;

    if(!category){
        return res.status(400).json({message: 'Category query parameter is required. Use ?category=categoryName' });
    }

    try{
        const products = await Product.find({category});

        if(products.length === 0 ){
            return res.status(404).json({message: 'No products found in this category'});
        }
        
        res.json(products);
      
    }catch(error){

        res.status(500).json({message: 'Server Error'});
    }
})

//Get  product by id
router.get('/api/products/:id', async (req, res) => {

    const { id } = req.params;
    try{

        const product = await Product.findOne({ id});
        // checking if the product exists
        if(product){
            res.json({product});

        }else{
            res.status(404).json({message: 'Product not found'});
        }
        
    }catch(error){
        
        res.status(500).json({message: 'Server Error'});
    }

})

// Create products
router.post('/api/products', validateCreateProduct ,async (req, res) => {

    const {name, description, price, category, inStock} = req.body;

    try{

        //Validate required fields
        if(!name || !description || !price || !category){
            return res.status(400).json({message: 'Please provide all required fields'});
        }

        const newProduct = new Product({
            name,
            description,
            price,
            category,
            inStock

        })
        const savedProduct = await newProduct.save();
        res.status(201).json({savedProduct});
        console.log(savedProduct);

    }catch(error){
        console.error('Error creating product:', error);

        if(error.name === 'ValidationError'){

            return res.status(400).json({message: error.message});
           
        }

        res.status(500).json({message: 'Server Error'});

    }
});

//Update an existing product
router.put('/api/products/:id', validateUpdateProduct,async (req, res) => {
    
    const { id } = req.params;

    try{

        const product = await Product.findOneAndUpdate(
            { id},
            req.body,
            {new : true, runValidators: true}
        );

        if(!product){

            return res.status(404).json({message: 'Product not found'});
        }

        res.json({product});
        console.log(`The product with id ${id} is updated to `);
        
        console.log(product);
        


    }catch(error){

        console.error('Error updating product:', error);
        
        return res.status(500).json({message: 'Server Error'});

    }
});

//Delete a product
router.delete('/api/products/:id', async (req, res) => {

    const {id} = req.params;

    try{

        const deletedProduct =   await Product.findOneAndDelete({id});
        if(!deletedProduct){
            return res.status(404).json({message: 'Product not found'});
        }

      
       
        res.json({message: `Product with id ${id} deleted successfully`});

    }catch(error){

        console.error('Error deleting product:', error);

        return res.status(500).json({message: 'Server Error'});
    }


});

//Export the routers to other files
export default router;
