const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/addProduct', adminController.addProduct);

module.exports = router;