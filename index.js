const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;

const app = express();

// Load environment variables
dotenv.config();


// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow requests with no origin
    return callback(null, origin);
  },
  credentials: true,
}));

// Increase request body size limit to avoid PayloadTooLargeError
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection
require('./Mongodb/config');
require('./Mongodb/controlUsMongo/controlUsMongo');
require('./Mongodb/Allcategory/categoryMongo/categoryMongo');
require('./Mongodb/Allcategory/subcategoryMongo/subcategoryMongo');
require('./Mongodb/productMongo/productMongo');
require('./Mongodb/blogMongo/blogMongo');
require('./Mongodb/adminSignupMongo/adminSignupMongo');
require('./Mongodb/adminOtp/adminOtp')
require('./Mongodb/teaFlushesCategory/categoryMongo/tflushCategoryMongo');
require('./Mongodb/teaFlushesCategory/subcategoryMongo/tflushSubcategoryMongo')
require('./Mongodb/teaFlusheProductMongo/teaFlusheProductMongo');
require('./Mongodb/shippingMongo/shippingMongo');
require('./Mongodb/refundMongo/refundMongo')
require('./Mongodb/teaRegionMongo/teaRegionMongo')


// Routes
const contactRoutes = require('./Routes/controlUsRoutes/controlUsRoute');
const categorySubRoutes = require('./Routes/categorySubRoutes/categorySubRoutes');
const productRoutes = require('./Routes/productRoutes/productRoutes');
const blog = require('./Routes/blog/blogRoutes')
const adminSignup = require('./Routes/adminSignupRoute/adminSignupRoute');
const verifySignup = require('./Routes/adminSignupRoute/verifyRoutes')
const adminLogin = require('./Routes/adminLoginRoutes/adminLoginRoutes')
const adminforgetLoginControll = require('./Routes/adminForgetRoutes/adminForgetRoutes');
const teaFlushes = require('./Routes/t&FlushCategSubManagRoute/t&FlushCategSubManagRoute')
const teaFlushProduct = require('./Routes/teaFlushProductRoute/teaFlushProductRoute');
const shipping = require('./Routes/shippingRoute/shippingRoute');
const refund = require('./Routes/refundRoutes/refundRoutes')
const teaRegion = require('./Routes/teaRegionRoutes/teaRegionRoutes')

app.use('/', contactRoutes);
app.use('/', categorySubRoutes);
app.use('/', productRoutes);
app.use('/api/news' , blog);
app.use('/api/shipping' , shipping);
app.use('/api/refund' , refund);
app.use('/api/tearegion' , teaRegion);

app.use('/', adminSignup);
app.use('/' , verifySignup);
app.use('/' , adminLogin);
app.use('/' , adminforgetLoginControll)

app.use('/' , teaFlushes)
app.use('/' , teaFlushProduct)



// Default route
app.get('/', (req, res) => {
  res.send('🚩 Jai Shree Ram');
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
