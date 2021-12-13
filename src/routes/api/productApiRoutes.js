const express = require('express');
const router = express.Router();
const productApiController = require('../../controllers/api/productApiController');

router.get('/', productApiController.list);

/*---- Rutas para vista de productos con paginado ----*/
router.get('/all/:page?', productApiController.products);

router.get('/:id', productApiController.detail)

module.exports = router