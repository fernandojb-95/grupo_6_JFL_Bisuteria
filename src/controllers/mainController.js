const fs = require('fs');
const path = require('path');
const db = require('../database/models');

const productsPath = path.join(__dirname, '../data/products.json');

const mainController = {
    index: (req, res) => {
        // const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
        // let catProducts =[];
        // for(let i = 0; i<=3; i++){
        //     catProducts[i]= products[i]
        // }
        db.Product.findAll(
            {
            include: ['category'],
            limit: 4,
            order: [['sold', 'DESC']]
            }
        )
            .then(products => {
                res.render('index', {products: products, user: req.session.user ? req.session.user : undefined});
            })
        // res.render('index', {products: catProducts, user: req.session.user ? req.session.user : undefined});        
    },
    aboutUs: (req, res) => {
        res.render('about-us', {user: req.session.user ? req.session.user : undefined});
    },
    contact: (req, res) => {
        res.render('contact', {user: req.session.user ? req.session.user : undefined});
    },
    service: (req, res) => {
        res.render('service', {user: req.session.user ? req.session.user : undefined});
    },
    privacy: (req, res) => {
        res.render('privacy', {user: req.session.user ? req.session.user : undefined});
    }
}

module.exports = mainController;