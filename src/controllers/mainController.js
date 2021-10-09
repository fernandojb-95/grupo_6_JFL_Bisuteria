const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '../data/products.json');

const mainController = {
    index: (req, res) => {
        const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
        let catProducts =[];
        for(let i = 0; i<=3; i++){
            catProducts[i]= products[i]
        }
        if(req.session.user){
            let user = req.session.user;
            res.render('index', {products: catProducts, user: user.first_name, id: user.id});
            
        } else {
            res.render('index', {products: catProducts});
        }
        
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