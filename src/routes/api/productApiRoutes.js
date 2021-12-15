const express = require('express');
const router = express.Router();
const productApiController = require('../../controllers/api/productApiController');

/*---- Rutas para vista de productos ----*/
router.get('/', productApiController.list);

/*---- Rutas para vista de productos con paginado ----*/
router.get('/all/:page?', productApiController.products);

/*---- Rutas para vista de categorias ----*/
router.get('/categories', productApiController.categories)

/*---- Rutas para vista de detalle de producto ----*/
router.get('/:id', productApiController.detail)

module.exports = router