const express = require('express');
const router = express.Router();
const categoryController = require('../../Controller/t&FlushCategSubManagControl/t&FlushCategSubManagControl');

// Category Routes
router.post('/api/tea/season/categories', categoryController.createCategory);
router.get('/api/tea/season/categories', categoryController.getAllCategories);


router.get('/api/tea/season/categories/query', categoryController.getDatabyCategory);

router.put('/api/tea/season/categories/:id', categoryController.updateCategory);


router.delete('/api/tea/season/categories/:id', categoryController.deleteCategory);

// Subcategory Routes
router.post('/api/tea/season/subcategories', categoryController.createSubcategory);
router.get('/api/tea/season/subcategories/:categoryId', categoryController.getSubcategoriesByCategory);
router.put('/api/tea/season/subcategories/:id', categoryController.updateSubcategory);
router.delete('/api/tea/season/subcategories/:id', categoryController.deleteSubcategory);



module.exports = router;