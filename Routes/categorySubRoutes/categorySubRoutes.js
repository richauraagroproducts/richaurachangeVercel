const express = require('express');
const router = express.Router();
const categoryController = require('../../Controller/categorySubControll/categorySubControll');

// Category Routes
router.post('/api/categories', categoryController.createCategory);
router.get('/api/categories', categoryController.getAllCategories);


router.get('/api/categories/query', categoryController.getDatabyCategory);

router.put('/api/categories/:id', categoryController.updateCategory);
router.delete('/api/categories/:id', categoryController.deleteCategory);

// Subcategory Routes
router.post('/api/subcategories', categoryController.createSubcategory);
router.get('/api/subcategories', categoryController.getAllSubCategorieswithoutCategory);
router.get('/api/subcategories/:categoryId', categoryController.getSubcategoriesByCategory);
router.put('/api/subcategories/:id', categoryController.updateSubcategory);
router.delete('/api/subcategories/:id', categoryController.deleteSubcategory);

router.get('/api/subcategories/query/w', categoryController.getDatabysubCategory);

module.exports = router;