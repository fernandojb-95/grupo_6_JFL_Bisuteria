//Requerimos path, express y router para configurar las rutas
const express = require('express');
const router = express.Router();
const path = require('path');
const adminMiddleware = require('../middlewares/adminMiddleware');
const logMiddleware = require('../middlewares/logMiddleware');
const db = require('../database/models')
const { body, check, validationResult } = require('express-validator');
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
            productMaterial = req.body.material;
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

const validateRegister =[
    check('name')
        .notEmpty().withMessage('El nombre del producto no puede quedar vacío').bail().isLength({min: 2}).withMessage('Debes colocar un nombre válido'),
    check('description')
        .notEmpty().withMessage('La descripción del producto no puede quedar vacía').bail().isLength({min: 2}).withMessage('Debes colocar una descripción válida'),
    check('price')
        .notEmpty().withMessage('Debes colocar un precio').isNumeric().withMessage('Debes colocar un formato de precio correcto'),
    check('discount')
        .notEmpty().withMessage('El campo descuento no puede quedar vacío').bail().isNumeric().withMessage('El formato de descuento no es correcto'),
    check('category')
        .notEmpty().withMessage('Debes elegir una categoría').bail().isNumeric().withMessage('El formato no es correcto'),
    check('material')
        .notEmpty().withMessage('Debes elegir un material').bail().isNumeric().withMessage('El formato no es correcto'),
    check('quantityS')
        .notEmpty().withMessage('El campo S no puede quedar vacío').bail().isNumeric().withMessage('El formato de talla S no es correcto'),
    check('quantityM')
        .notEmpty().withMessage('El campo M no puede quedar vacío').bail().isNumeric().withMessage('El formato de talla M no es correcto'),
    check('quantityL')
        .notEmpty().withMessage('El campo L no puede quedar vacío').bail().isNumeric().withMessage('El formato de talla L no es correcto')
]

const validateQuantity = [
    check('quantity')
        .notEmpty().withMessage('El campo no puede ir vacío').bail().isInt().withMessage('El valor debe ser numérico')
]
//Validación de que el archivo recibido es una imagen
const fileUpload = multer({
    storage: multerDiskStorage,
    fileFilter: function (req, file, callback) {
        const errors = validationResult(req).array()
        const ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            req.fileValidationError = {
                msg: 'Debes subir un formato de archivos permitido (.png, .jpg, .jpeg)',
                param: 'file'
            }
            return callback(null, false, new Error('goes wrong on the mimetype'));
        } else {
            callback(null, true)
        }
    }
})

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
router.post('/', fileUpload.any(), validateRegister, productController.store);

/*----Rutas para edición de producto----*/
router.get('/:id/edit', logMiddleware, adminMiddleware, productController.edit);
router.patch('/:id', fileUpload.any(), validateRegister, productController.update);

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