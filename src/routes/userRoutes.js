const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const path = require('path');

//Requerimos multer para traer archivos
const multer = require('multer');

//Configuramos destino y nombre de archivos
const multerDiskStorage = multer.diskStorage({
    destination: (req, file, callback) =>{
        // let folder = path.join(__dirname, `../../public/img/profileImages`);
        // callback(null,folder);
    },
    filename: (req, file, callback) => {
        const imageName = '';
        callback(null,imageName);
    }
})
const fileUpload = multer({storage: multerDiskStorage});

/*----Rutas paravista de formulario de login----*/
router.get('/login', userController.login);

/*----Rutas para vista de formulario de registro----*/
router.get('/register', userController.register);
router.post('/', fileUpload.single('imagenUsuario'), userController.procesarRegistro);

module.exports = router;