const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '../data/products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
const mainController = {
    index: (req, res) => {
        let catProducts =[];
        for(let i = 0; i<=3; i++){
            catProducts[i]= products[i]
        }
        res.render('index', {products: catProducts});
   },
    aboutUs: (req, res) => {
        res.render('about-us');
    },
    contact: (req, res) => {
        res.render('contact');
    },
    suscribe: (req, res) => {
        res.render('suscribe');
   },
    service: (req, res) => {
        res.render('service');
    },
    privacy: (req, res) => {
        res.render('privacy');
    },
    help: (req, res) => {
        res.render('help');
    }
}

module.exports = mainController;