const express = require('express');
const router = express.Router();
const Category = require('../database/collections/categories');
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
router.put('/upload-files', upload.single('file'), async (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const filename = req.file.filename;

    try {
        const newCategory = new Category({
            name,
            description,
            image: filename
        });
        const savedCategory = await newCategory.save();
        res.status(200).json(savedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

    
});


router.get('/images/:filename', (req, res) => {
    res.sendFile(`${__dirname}/images/${req.params.filename}`);
});
// Get all categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get one category
router.get('/categories/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        res.status(200).json(category);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});



// Update one category
router.put('/categories/:id', upload.single('file'), async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if(!category) {
            return res.status(404).json({ message: 'category not found' });
        }

        //check if you are updating the name
        if(req.body.name) {
            category.name = req.body.name;
        }

       
        //check if you are updating the description
        if(req.body.description) {
            category.description = req.body.description;
        }

        

        //check if you are updating the image
        if(req.file) {
            category.image = req.file.path;
        }

        const updatedCategory = await category.save();
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

});

// Delete one category
router.delete('/categories/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        const deletedCategory = await category.remove();
        res.status(200).json(deletedCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//delete all categories
router.delete('/categories', async (req, res) => {
    try {
        const categories = await Category.deleteMany();
        res.status(200).json(categories);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//export router
module.exports = router;