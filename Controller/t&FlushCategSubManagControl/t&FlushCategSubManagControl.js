const Category = require('../../Mongodb/teaFlushesCategory/categoryMongo/tflushCategoryMongo');
const Subcategory = require('../../Mongodb/teaFlushesCategory/subcategoryMongo/tflushSubcategoryMongo');

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = new Category({ name, description });
    await category.save();
    res.status(201).json({ message: 'Category created', category });
  } catch (error) {
    res.status(400).json({ message: 'Error creating category', error: error.message });
  }
};

// Get All Categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

exports.getDatabyCategory = async (req, res) => {
   try {
    const { category } = req.query; // Extract category from query parameters
    const query = category ? { name: new RegExp(decodeURIComponent(category), 'i') } : {};
    const categories = await Category.find(query);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};



// Create Subcategory
exports.createSubcategory = async (req, res) => {
  try {
    const { name, categoryId, description } = req.body;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const subcategory = new Subcategory({ name, category: categoryId, description });
    await subcategory.save();
    res.status(201).json({ message: 'Subcategory created', subcategory });
  } catch (error) {
    res.status(400).json({ message: 'Error creating subcategory', error: error.message });
  }
};



// Get Subcategories by Category
exports.getSubcategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subcategories = await Subcategory.find({ category: categoryId }).populate('category');
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subcategories', error: error.message });
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const category = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category updated', category });
  } catch (error) {
    res.status(400).json({ message: 'Error updating category', error: error.message });
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Subcategory.deleteMany({ category: id });
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category and related subcategories deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};


// Update Subcategory
exports.updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const subcategory = await Subcategory.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    res.status(200).json({ message: 'Subcategory updated', subcategory });
  } catch (error) {
    res.status(400).json({ message: 'Error updating subcategory', error: error.message });
  }
};

// Delete Subcategory
exports.deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategory = await Subcategory.findByIdAndDelete(id);
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    res.status(200).json({ message: 'Subcategory deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting subcategory', error: error.message });
  }
};