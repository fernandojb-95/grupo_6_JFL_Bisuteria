const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController')

router.get('/productDetail', productController.productDetail);
router.get('/productCart', productController.productCart);
router.get('/editProduct', productController.editProduct);
router.get('/anillos',productController.anillos);
router.get('/brazaletes',productController.brazaletes);
router.get('/collares',productController.collares);

module.exports = router;