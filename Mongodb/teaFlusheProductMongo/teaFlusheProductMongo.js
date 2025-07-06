const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  comment: { type: String, required: true },
  deviceId: String,
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'], 
    trim: true 
  },
  price: { 
    type: Number, 
    min: [0, 'Price cannot be negative'],
    required: false 
  },
  range: {
    type: {
      minPrice: { 
        type: Number, 
        min: [0, 'Minimum price cannot be negative'],
        required: function() { return !this.price; } 
      },
      maxPrice: { 
        type: Number, 
        min: [0, 'Maximum price cannot be negative'],
        required: function() { return !this.price; }, 
        validate: {
          validator: function(value) {
            // Only validate if range exists and minPrice is defined
            return !this.price && this.range && this.range.minPrice !== undefined 
              ? value >= this.range.minPrice 
              : true;
          },
          message: 'Maximum price must be greater than or equal to minimum price'
        }
      }
    },
    required: false // Make range optional
  },
  discount: { 
    type: Number, 
    default: 0, 
    min: [0, 'Discount cannot be negative'], 
    max: [100, 'Discount cannot exceed 100%'] 
  },
  category: { 
    type: String, 
    required: [true, 'Category is required'], 
    trim: true 
  },
  subcategory: { 
    type: String, 
    trim: true 
  },
  images: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
  ],
  description: { 
    type: String, 
    required: [true, 'Description is required'], 
    trim: true 
  },
  reviews: [reviewSchema],
  numReviews: { 
    type: Number, 
    default: 0 
  },
  rating: { 
    type: Number, 
    default: 0 
  },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Validation: Ensure either price or range is provided, but not both
productSchema.pre('validate', function(next) {
  if (!this.price && (!this.range || !this.range.minPrice || !this.range.maxPrice)) {
    next(new Error('Either price or range (minPrice and maxPrice) must be provided'));
  } else if (this.price && this.range && (this.range.minPrice || this.range.maxPrice)) {
    next(new Error('Cannot provide both price and range'));
  }
  next();
});

// Virtual field for priceDisplay
productSchema.virtual('priceDisplay').get(function() {
  if (this.price !== undefined && this.price !== null) {
    return this.price.toString();
  }
  if (this.range && this.range.minPrice !== undefined && this.range.maxPrice !== undefined) {
    return `${this.range.minPrice} - ${this.range.maxPrice}`;
  }
  return 'N/A';
});

module.exports = mongoose.model('TeaFlushProduct', productSchema);