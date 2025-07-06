const express = require('express');
const router = express.Router();
const contactController = require('../../Controller/contactUsControl/contactUsControl'); // adjust the path if needed

// Route to handle contact form submissions
router.post('/api/create/contact', contactController.createContact);

module.exports = router;
