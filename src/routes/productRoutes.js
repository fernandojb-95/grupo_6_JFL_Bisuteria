const { Router } = require('express');
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController')

/*----Rutas para vista de productos----*/
router.get('/', productController.productos);

/*----Rutas para vista de anillos----*/
router.get('/anillos',productController.anillos);

/*----Rutas para vista de brazaletes----*/
router.get('/brazaletes',productController.brazaletes);

/*----Rutas para vista de collares----*/
router.get('/collares',productController.collares);

/*----Rutas para creación de producto----*/
router.get('/create', productController.create);
router.post('/', productController.store);

/*----Rutas para edición de producto----*/
router.get('/:id/edit', productController.edit);
router.patch('/:id', productController.update);

/*----Rutas para vista de detalle de producto----*/
router.get('/:id', productController.productDetail);

/*----Rutas para borrar producto----*/
router.delete('/:id', productController.delete);

/*----Rutas para vista de carrito de compras----*/
router.get('/productCart', productController.productCart);

/*----Rutas para vista de finalizar compra----*/
router.get('/finalizaCompra',productController.finalizaCompra);


module.exports = router;