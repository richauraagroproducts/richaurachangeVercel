const mongoose = require('mongoose');

const otpSave = new mongoose.Schema({

    token: {
        type: String
    },
    otpExpiresAt: {
        type: Date
    },
    otp: {
        type: String,

    },

    

});

const otpSaves = mongoose.model('adminOtpSave', otpSave);

module.exports = otpSaves;
