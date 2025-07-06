const mongoose = require('mongoose');


// Define the schema for the contact entity
const contactSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    number: {
      type: String,
      required: true
    },
    
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  

// Create a Mongoose model using the defined schema
const Contact = mongoose.model('ContactU', contactSchema);

// Export the Contact model
module.exports = Contact;
