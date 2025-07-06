const asyncHandler = require('express-async-handler');
const Product = require('../../Mongodb/teaFlusheProductMongo/teaFlusheProductMongo');
const { cloudinary } = require('../cloudinary');
const streamifier = require('streamifier');

// Helper function to upload a single image to Cloudinary
const uploadToCloudinary = (file) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'Tea_flushproducts', allowed_formats: ['jpg', 'png', 'jpeg'] },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });

// Create a product
const createProduct = asyncHandler(async (req, res) => {
  const { title, price, minPrice, maxPrice, discount, category, subcategory, description } = req.body;
  const files = req.files;

  if (!files || files.length === 0) {
    res.status(400);
    throw new Error('At least one image is required');
  }

  // Validate price input
  if (price !== undefined && (minPrice || maxPrice)) {
    res.status(400);
    throw new Error('Provide either a single price or a price range, not both');
  }
  if (price === undefined && (!minPrice || !maxPrice)) {
    res.status(400);
    throw new Error('Either a single price or both minPrice and maxPrice are required');
  }

  // Upload all images to Cloudinary
  const images = await Promise.all(files.map(uploadToCloudinary));

  const productData = {
    title,
    discount,
    category,
    subcategory,
    images,
    description,
  };

  if (price !== undefined) {
    productData.price = Number(price);
  } else {
    productData.range = { minPrice: Number(minPrice), maxPrice: Number(maxPrice) };
  }

  const product = await Product.create(productData);

  res.status(201).json(product);
});

// Get all products
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.status(200).json(products);
});

// Get a single product
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.status(200).json(product);
});

// Get products by category
const getProductsByCategory = asyncHandler(async (req, res) => {
  let { category } = req.query;

  if (!category) {
    res.status(400);
    throw new Error('Category is required');
  }

  // Decode URL-encoded characters and normalize
  category = decodeURIComponent(category).trim();

  // Find products with case-insensitive category match
  const products = await Product.find({ 
    category: { $regex: new RegExp(`^${category}$`, 'i') }
  }).sort({ createdAt: -1 });

  if (products.length === 0) {
    res.status(404);
  
  }

  res.status(200).json(products);
});

// Update 
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const { title, price, minPrice, maxPrice, discount, category, subcategory, description, retainedImages } = req.body;

  // Parse retainedImages from JSON string to array
  let parsedRetainedImages = [];
  try {
    parsedRetainedImages = JSON.parse(retainedImages || '[]');
    if (!Array.isArray(parsedRetainedImages)) throw new Error();
  } catch {
    res.status(400);
    throw new Error('Invalid retainedImages format');
  }

  // Filter images that should be retained
  const imagesToKeep = product.images.filter(img => parsedRetainedImages.includes(img.public_id));

  // Delete images that are not in retained list
  const imagesToDelete = product.images.filter(img => !parsedRetainedImages.includes(img.public_id));
  await Promise.all(imagesToDelete.map(img => cloudinary.uploader.destroy(img.public_id)));

  // Upload new images if any
  let newImages = [];
  if (req.files && req.files.length > 0) {
    const remainingSlots = 5 - imagesToKeep.length;
    if (req.files.length > remainingSlots) {
      res.status(400);
      throw new Error(`You can only upload ${remainingSlots} more image(s)`);
    }

    newImages = await Promise.all(req.files.map(uploadToCloudinary));
  }

  const finalImages = [...imagesToKeep, ...newImages];

  // Prepare update object
  const updateData = {
    title,
    discount: Number(discount) || 0,
    category,
    subcategory,
    description,
    images: finalImages,
  };

  // Handle price or range
  if (price) {
    updateData.price = Number(price);
    updateData.range = null; // Explicitly clear range if price is provided
  } else if (minPrice && maxPrice) {
    updateData.price = null; // Explicitly clear price if range is provided
    updateData.range = { minPrice: Number(minPrice), maxPrice: Number(maxPrice) };
  } else {
    res.status(400);
    throw new Error('Either price or range (minPrice and maxPrice) must be provided');
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  res.status(200).json(updatedProduct);
});


// Delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Delete images from Cloudinary
  await Promise.all(product.images.map((image) =>
    cloudinary.uploader.destroy(image.public_id)
  ));

  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'Product deleted successfully' });
});

// Add a review to a product
const addReview = asyncHandler(async (req, res) => {
  const { name, rating, comment, deviceId } = req.body;
  const { id } = req.params;

  if (!name || !rating || !comment || !deviceId) {
    return res.status(400).json({ message: 'All fields including deviceId are required.' });
  }

  const product = await Product.findById(id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const alreadyReviewed = product.reviews.some(review => review.deviceId === deviceId);
  if (alreadyReviewed) {
    return res.status(403).json({ message: 'You have already reviewed this product.' });
  }

  product.reviews.push({ name, rating, comment, deviceId });
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;

  await product.save();

  res.status(201).json({ message: 'Review submitted successfully' });
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getProductsByCategory
};