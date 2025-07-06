const express = require('express');
const router = express.Router();
const newsController = require('../../Controller/teaRegionControll/teaRegionControll');


router.post('/create', newsController.createNews);
router.put('/update/:id', newsController.updateNews);

router.get('/get', newsController.getAllNews);
router.get('/single/:id', newsController.getNewsById);
router.delete('/delete/:id', newsController.deleteNews)

module.exports = router;