const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController')

router.get('/', mainController.index);
router.get('/about-us', mainController.aboutUs);
router.get('/contact',mainController.contact);
router.get('/suscribe', mainController.suscribe);
router.get('/service', mainController.service);
router.get('/privacy',mainController.privacy);
router.get('/help',mainController.help);

module.exports = router;