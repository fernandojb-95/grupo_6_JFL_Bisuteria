//Requerimos path, express y router para configurar las rutas
const express = require('express');
const router = express.Router();
const path = require('path');
const adminMiddleware = require('../middlewares/adminMiddleware');
const logMiddleware = require('../middlewares/logMiddleware');
const db = require('../database/models')
//Requerimos multer para traer archivos
const multer = require('multer');

//Configuramos destino y nombre de archivos
const multerDiskStorage = multer.diskStorage({
    destination: (req, file, callback) =>{
        let productCategory = parseInt(req.body.category);
         db.Category.findByPk(productCategory)
        .then(category => {
            const filePath = path.join(__dirname, `../../public/img/${category.name}`)
            callback(null, filePath);
        })

    },
    filename: (req, file, callback) => {
        let productCategory = req.body.category,
            productMaterial = req.body.materials;
        const category = db.Category.findByPk(productCategory);
        const material = db.Material.findByPk(productMaterial);
        Promise
            .all([category, material])
            .then(([category,material]) => {
                const imgName = `img-${category.name.toLowerCase().replace(/ /g, '-')}-${Date.now().toString().slice(8)}-${material.name}${path.extname(file.originalname)}`;
                callback(null, imgName);
            })
            .catch(error => console.log(error))
    }
})

const fileUpload = multer({storage: multerDiskStorage})

//Requerimos el controlador para llamar a las funciones
const productController = require('../controllers/productController');

/*----Rutas para vista de productos----*/
router.get('/all/:page?', productController.productos);

/*----Rutas para vista de anillos----*/
router.get('/anillos/:page?',productController.anillos);

/*----Rutas para vista de brazaletes----*/
router.get('/brazaletes/:page?',productController.brazaletes);

/*----Rutas para vista de collares----*/
router.get('/collares/:page?',productController.collares);

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
router.get('/detail/:id', productController.productDetail);

/*----Rutas para borrar producto----*/
router.delete('/:id', productController.delete);

/*----Rutas para postear comentario----*/
router.post('/comment/:id', productController.postComment);



module.exports = router;