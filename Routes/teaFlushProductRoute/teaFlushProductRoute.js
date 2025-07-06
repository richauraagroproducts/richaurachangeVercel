const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getProductsByCategory
} = require('../../Controller/teaFlusheProductControl/teaFlusheProductControl');
const multer = require('multer');
const { storage } = require('../../Controller/cloudinary');

const upload = multer({ storage });

// Routes
router.post('/api/tea/season/products', upload.array('images', 5), createProduct); // Create product with up to 5 images
router.get('/api/tea/season/products', getProducts); // Get all products

router.get('/api/tea/season/products/category', getProductsByCategory);

router.get('/api/tea/season/products/single/:id', getProduct); // Get single product
router.put('/api/tea/season/products/:id', upload.array('images', 5), updateProduct); // Update product
router.delete('/api/tea/season/products/:id', deleteProduct); // Delete product

router.post('/api/tea/season/products/:id/reviews', addReview);

module.exports = router;