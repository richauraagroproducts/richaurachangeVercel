const express = require('express');

const router = express.Router();

const {adminverifyOTP} = require('../../Controller/adminsingupControll/verify');

router.route('/api/verify/admin/signup').post(adminverifyOTP);


module.exports = router;