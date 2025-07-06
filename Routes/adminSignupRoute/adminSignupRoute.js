const express = require("express");

const router = express.Router();

const {adminsignup}= require('../../Controller/adminsingupControll/adminsingupControll');

router.route('/api/admin/register').post(adminsignup);


module.exports = router;