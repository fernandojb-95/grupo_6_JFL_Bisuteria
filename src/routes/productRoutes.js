//Requerimos path, express y router para configurar las rutas
const express = require('express');
const router = express.Router();
const path = require('path');
const adminMiddleware = require('../middlewares/adminMiddleware');
const logMiddleware = require('../middlewares/logMiddleware');

//Requerimos multer para traer archivos
const multer = require('multer');

//Configuramos destino y nombre de archivos
const multerDiskStorage = multer.diskStorage({
    destination: (req, file, callback) =>{
        let productCategory = req.body.category;
        const filePath = path.join(__dirname, `../../public/img/${productCategory}`)
        callback(null, filePath);
    },
    filename: (req, file, callback) => {
        let productCategory = req.body.category,
            productMaterial = req.body.materials
        const imgName = `img-${productCategory.toLowerCase().replace(/ /g, '-')}-${Date.now().toString().slice(8)}-${productMaterial}${path.extname(file.originalname)}`;
        callback(null, imgName);
    }
})

const fileUpload = multer({storage: multerDiskStorage})

//Requerimos el controlador para llamar a las funciones
const productController = require('../controllers/productController');

/*----Rutas para vista de productos----*/
router.get('/', productController.productos);

/*----Rutas para vista de anillos----*/
router.get('/anillos',productController.anillos);

/*----Rutas para vista de brazaletes----*/
router.get('/brazaletes',productController.brazaletes);

/*----Rutas para vista de collares----*/
router.get('/collares',productController.collares);

/*----Rutas para creación de producto----*/
router.get('/product/create',logMiddleware, adminMiddleware, productController.create);
router.post('/', fileUpload.any(), productController.store);

/*----Rutas para edición de producto----*/
router.get('/:id/edit', logMiddleware, adminMiddleware, productController.edit);
router.patch('/:id', fileUpload.any(), productController.update);

/*----Rutas para vista de carrito de compras----*/
router.get('/productCart', logMiddleware, productController.productCart);

/*----Rutas para vista de finalizar compra----*/
router.get('/finalizaCompra',logMiddleware, productController.finalizaCompra);

/*----Rutas para buscar producto----*/
router.get('/search', productController.search);

/*----Rutas para vista de detalle de producto----*/
router.get('/:id', productController.productDetail);

/*----Rutas para borrar producto----*/
router.delete('/:id', productController.delete);




module.exports = router;