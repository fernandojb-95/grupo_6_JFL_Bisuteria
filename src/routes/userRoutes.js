const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const path = require('path');

//Requerimos multer para traer archivos
const multer = require('multer');

//Configuramos destino y nombre de archivos
const multerDiskStorage = multer.diskStorage({
    destination: (req, file, callback) =>{
        let folder = path.join(__dirname, `../../public/img/users`);
        callback(null,folder);
    },
    filename: (req, file, callback) => {
        let userName = req.body.user;
        const imageName = `img-${userName.toLowerCase().replace(/ /g, '-')}-${Date.now().toString().slice(8)}${path.extname(file.originalname)}`;
        callback(null,imageName);
    }
})
const fileUpload = multer({storage: multerDiskStorage});

/*----Rutas para vista de formulario de login----*/
router.get('/login', userController.login);
router.post('/', userController.logUser);

/*----Rutas para vista de formulario de registro----*/
router.get('/register', userController.register);
router.post('/', fileUpload.single('imagenUsuario'), userController.procesarRegistro);

/*----Ruta para info de perfil de usuario-----*/
router.get('/:id/profile',userController.profile)

module.exports = router;