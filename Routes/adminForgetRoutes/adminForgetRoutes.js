const express = require('express');
const router = express.Router();
const { forgotPassword, resetPassword } = require('../../Controller/adminforgetLoginControll/adminforgetLoginControll');

router.post('/api/admin/forgot/password', forgotPassword);
router.post('/api/admin/reset/password', resetPassword);

module.exports = router;