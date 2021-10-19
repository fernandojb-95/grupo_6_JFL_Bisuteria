const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const path = require('path');
const {check, body} = require('express-validator');

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

//Campos a validar en el formulario de registro
const validateRegister = [
    body('user')
        .isLength({min: 4}).withMessage('Debes colocar un nombre válido'),
    body('lastname')
        .isLength({min: 4}).withMessage('Debes colocar un apellido válido'), 
    body('email')
        .isEmail().withMessage('Debes colocar email válido'),    
    body('password')
        .isStrongPassword({minSymbols: 0, minLength: 8}).withMessage('Escribe un formato de contraseña válido')    
];
//Validar que la contraseña y la confirmacion de la contraseña coincidan
 const validatePassword = [ 
     body('passwordConfirm').custom(( value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Las contraseñas introducidas no coinciden');
    }
    return true;
  })];


/*----Rutas para vista de formulario de login----*/
router.get('/login', userController.login);
router.post('/', userController.logUser);

/*----Rutas para vista de formulario de registro----*/
router.get('/register', userController.register);
//router.post('/', fileUpload.any(''), validateRegister, validatePassword, userController.procesarRegistro);

/*----Ruta para info de perfil de usuario-----*/
router.get('/:id/profile',userController.profile)

module.exports = router;