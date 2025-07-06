
const express = require('express');
const router = express.Router();
const authController = require('../../Controller/adminloginControll/adminloginControll');



router.post('/api/admin/login', authController.login);

module.exports = router;