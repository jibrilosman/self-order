const express = require('express');
const router = express.Router();
const Product = require('../database/collections/products');
const multer = require('multer');


// Multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});


const upload = multer({
     storage: storage,
    });

//upload image
router.post('/upload-files', upload.single('file'), async (req, res) => {
    const name = req.body.name;
    const category = req.body.category;
    const description = req.body.description;
    const price = req.body.price;
    const addons = req.body.addons;
    const filename = req.file.filename;

    try {
        const newProduct = new Product({
            name,
            category,
            description,
            price,
            addons,
            image: filename
        });
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

    
});


router.get('/images/:filename', (req, res) => {
    res.sendFile(`${__dirname}/images/${req.params.filename}`);
});

// Get all categories
router.get('/products', async (req, res) => {
    const category = req.query.category;
    try {
        const products = await Product.find(category ? { category: category } : {});
        res.status(200).json(products);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Get one product
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});



// Update one product
router.put('/products/:id', upload.single('file'), async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if(!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        //check if you are updating the name
        if(req.body.name) {
            product.name = req.body.name;
        }

        //check if you are updating the category
        if(req.body.category) {
            product.category = req.body.category;
        }

        //check if you are updating the description
        if(req.body.description) {
            product.description = req.body.description;
        }

        //check if you are updating the price
        if(req.body.price) {
            product.price = req.body.price;
        }

        //check if you are updating the addons
        if(req.body.addons) {
            product.addons = req.body.addons;
        }

        //check if you are updating the image
        if(req.file) {
            product.image = req.file.path;
        }

        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

});

// Delete one category
router.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        const deletedProduct = await product.remove();
        res.status(200).json(deletedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//delete all categories
router.delete('/products', async (req, res) => {
    try {
        const products = await Product.deleteMany();
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//export router
module.exports = router;