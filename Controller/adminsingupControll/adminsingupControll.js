const OtpServer = require("../../Mongodb/adminOtp/adminOtp");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const Signup = require("../../Mongodb/adminSignupMongo/adminSignupMongo");
require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;

// Function to generate a random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to send OTP email
const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.in",
    port: 465, // Use 587 for TLS if preferred
    secure: true, // Use false if port is 587
    tls: {
      rejectUnauthorized: true,
    },
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: "Email Verification OTP",
    text: `Dear User,

Welcom to Admin of RichAura Agro Products.

Your One-Time Password (OTP) for email verification is: ${otp}

This OTP is valid for 10 minutes. Please do not share it with anyone for security reasons.

If you did not request this verification, please ignore this email.

Best regards,  
RichAura Agro Products  
Empowering Wellness with Nature`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("OTP Email sent:", info.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

const adminsignup = async (req, res) => {
  try {
    const existingUser = await Signup.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const otp = generateOTP();

    const emailSent = await sendOTPEmail(req.body.email, otp);
    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    const expirationTime = new Date(Date.now() + 10 * 60 * 1000);

    await storeOTPAndExpiration(otp, expirationTime, req.body.email);

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error generating and sending OTP:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const storeOTPAndExpiration = async (otp, expirationTime, token) => {
  const otpSave = new OtpServer({
    otp,
    otpExpiresAt: expirationTime,
    token,
  });

  await otpSave.save();
};

module.exports = { adminsignup };
