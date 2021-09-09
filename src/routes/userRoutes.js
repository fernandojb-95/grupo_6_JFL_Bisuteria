const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/*----Rutas paravista de formulario de login----*/
router.get('/login', userController.login);

/*----Rutas paravista de formulario de registro----*/
router.get('/register', userController.register);

module.exports = router;