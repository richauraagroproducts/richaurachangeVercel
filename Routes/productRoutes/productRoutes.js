const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getProductsByCategory,
  getProductsBysubCategory
} = require('../../Controller/productControll/productControll');
const multer = require('multer');
const { storage } = require('../../Controller/cloudinary');

const upload = multer({ storage });

// Routes
router.post('/api/products', upload.array('images', 5), createProduct); // Create product with up to 5 images
router.get('/api/products', getProducts); // Get all products

router.get('/api/products/category', getProductsByCategory);
router.get('/api/products/subcategory', getProductsBysubCategory);


router.get('/api/products/single/:id', getProduct); // Get single product
router.put('/api/products/:id', upload.array('images', 5), updateProduct); // Update product
router.delete('/api/products/:id', deleteProduct); // Delete product

router.post('/api/products/:id/reviews', addReview);

module.exports = router;