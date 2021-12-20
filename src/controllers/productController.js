const fs = require('fs');
const path = require('path');
const {validationResult} = require('express-validator');
const db = require('../database/models');
const { Op } = require("sequelize");
const { sequelize } = require('../database/models');
const { IncomingMessage } = require('http');

const productsPath = path.join(__dirname, '../data/products.json');

const productController = {
    productDetail: (req,res) => {
        const IdProduct = req.params.id;
        const product = db.Product.findByPk(IdProduct,
            {
                include: ['category', 'material']
        })
        const comments = db.Comment.findAll({ 
            attributes: ['title', 'content', [sequelize.fn('date_format', sequelize.col('created_at'), '%d-%m-%Y'), 'created_at'], 'user_id', 'product_id'],
            include: ['products', 'users'],
            where: {
                '$products.id$': IdProduct
            }
        });
        Promise 
            .all([product, comments])
            .then(([product, comments]) => {
                let newPrice;
                if(product.discount > 0) {
    
                    newPrice = parseFloat(product.price)*(1-(parseFloat(product.discount*0.01))).toFixed(2)
                }
                 res.render('./products/productDetail', {product: product, newPrice: newPrice, comments: comments,user: req.session.user ? req.session.user : undefined });     
            })
    },
    productCart : (req, res) => {
        // let sum = 0;
        // if(req.session.products){
        //     const initialValue = 0;
        //     sum = req.session.products.reduce(function (total, currentValue) {
        //         return total + currentValue.finalPrice;
        //     }, initialValue);
        // }
        res.render('./products/productCart', { user: req.session.user ? req.session.user : undefined});
    },
    anillos : (req, res) => {
        const count = db.Product.count({
            include: ['category'],
            where: {
                '$category.name$': 'anillos'
            }
        })
        const page = parseInt(req.params.page) || 1;
        const limit = 8;
        const products = db.Product.findAll(
            {
                include: ['category'],
                limit: limit,
                offset: (page-1) * limit,
                where: {
                    '$category.name$': 'anillos'
                },
            }
        )
        Promise
            .all([count,products])
            .then(([count, products]) =>{
            res.render('./products/products', {products: products, count: count, limit: limit, category: 'anillos', user: req.session.user ? req.session.user : undefined});
        })
    },
    brazaletes : (req, res) => {
        const count = db.Product.count({
            include: ['category'],
            where: {
                '$category.name$': 'brazaletes'
            }
        })
        const page = parseInt(req.params.page) || 1;
        const limit = 8;
        const products = db.Product.findAll(
            {
                include: ['category'],
                limit: limit,
                offset: (page-1) * limit,
                where: {
                    '$category.name$': 'brazaletes'
                }
            }
        )
        Promise
            .all([count,products])
            .then(([count, products]) =>{
            res.render('./products/products', {products: products, count: count, limit: limit, category: 'brazaletes' ,user: req.session.user ? req.session.user : undefined});
        })
    },
    collares : (req, res) => {
        const count = db.Product.count({
            include: ['category'],
            where: {
                '$category.name$': 'anillos'
            }
        })
        const page = parseInt(req.params.page) || 1;
        const limit = 8;
        const products = db.Product.findAll(
            {
                include: ['category'],
                limit: limit,
                offset: (page-1) * limit,
                where: {
                    '$category.name$': 'collares'
                }
            }
        )
        Promise
            .all([count, products])
        .then(([count, products]) =>{
            res.render('./products/products', {products: products, count: count, limit: limit, category: 'collares', user: req.session.user ? req.session.user : undefined});
        })
    },
    create: (req,res) => {
        res.render('./admin/addProduct', {user: req.session.user ? req.session.user : undefined });
    },
    store: (req,res) =>{
        const errorsList = validationResult(req),
            errors = errorsList.array();
            if(req.fileValidationError){
                errors.push(req.fileValidationError)
            }
        if(errors.length == 0) {
            const image1 = req.files.find(image => image.fieldname == 'image1')
            const image2 = req.files.find(image => image.fieldname == 'image2')
            db.Product.create({
                name: req.body.name,
                description: req.body.description,
                price: parseFloat(req.body.price),
                discount: parseFloat(req.body.discount) || 0,
                quantity_S: parseInt(req.body.quantityS) || 0,
                quantity_M: parseInt(req.body.quantityM) || 0,
                quantity_L: parseInt(req.body.quantityL) || 0,
                image_1: image1 !== undefined ? image1.filename : undefined,
                image_2: image2 !== undefined ? image2.filename : undefined,
                category_id: parseInt(req.body.category),
                material_id: parseInt(req.body.material)
            })
            .then(product =>{
                console.log(product);
                res.redirect('/');
            }).catch(error => console.log(error))
        } else{
            if(req.files){
                const category = req.body.category;
                db.Category.findByPk(category)
                    .then(category => {
                        req.files.forEach(file => {
                            const imgPath = path.join(__dirname, `../../public/img/${category.name}/${file.filename}`)
                            fs.unlink(imgPath, error => {
                                if (error) console.log(error);
                            })
                        })
                    }
                    )
                    .catch(error => console.log(error))
            }               
            res.render('./admin/addProduct', {errors: errors, user: req.session.user ? req.session.user : undefined, old: req.body})
        }
    },
    edit: (req,res) => {
        const productID = req.params.id;
        db.Product.findByPk(productID, {
            include: ['category', 'material']
        })
        .then(old => {
            res.render('./admin/addProduct', {old: old, edit: true, user: req.session.user ? req.session.user : undefined });
        })
        .catch(error => console.log(error))
    },
    update: (req,res) => {
        const productId = req.params.id
        const errorsList = validationResult(req),
            errors = errorsList.array();
            if(errors.length == 0){
                let image1, image2;
                let image1Full = req.files.find(image => image.fieldname == 'image1');
                let image2Full = req.files.find(image => image.fieldname == 'image2');
                if(image1Full !== undefined)  {
                    image1 = image1Full.filename;
                }
                if(image2Full !== undefined)  {
                    image2 = image2Full.filename;
                }
                db.Product.findByPk(productId, {
                    include : ['material', 'category']
                })
                    .then(product => {
                        if(product.image_1 !== 'default-user.png' && image1 === undefined ){
                            image1 = product.image_1
                        } else{
                            if(product.image_1 !== 'default-user.png'){
                                const imgPath = path.join(__dirname, `../../public/img/${product.category.name}/${product.image_1}`)
                                fs.unlink(imgPath, error => {
                                    if (error) console.log(error);
                                })
                            }
                        }
                        if(product.image_2 !== 'default-user.png' && image2 === undefined){
                            image2 = product.image_2
                        } else{
                            if(product.image_2 !== 'default-user.png'){
                                const imgPath = path.join(__dirname, `../../public/img/${product.category.name}/${product.image_2}`)
                                fs.unlink(imgPath, error => {
                                    if (error) console.log(error);
                                })
                            }
                        }
                    })
                    .catch(error => console.log(error))
// Ordenamos la info recibida en el formulario
        const productName = req.body.name,
                productDescription = req.body.description,
                productPrice = parseFloat(req.body.price),
                productDiscount = parseFloat(req.body.discount) ||0,
                productCategory = parseInt(req.body.category),
                productMaterial = parseInt(req.body.material),
                productQuantS = parseInt(req.body.quantityS) || 0,
                productQuantM = parseInt(req.body.quantityM) || 0,
                productQuantL = parseInt(req.body.quantityL) || 0;

        //Almacenando valores mediante Sequelize
        const updating = db.Product.update({
            name: productName,
                description: productDescription,
                price: productPrice,
                discount: productDiscount,
                image_1: image1,
                image_2: image2,
                category_id: productCategory,
                material_id: productMaterial 
        },{
            where: {
                id: productId
            }
        })
        const quantities = db.Product.increment({
            quantity_S : + productQuantS,
            quantity_M : + productQuantM,
            quantity_L : + productQuantL,
        }, {
            where: {
                id: productId
            }
        });
        Promise
            .all([updating, quantities])
            .then( ([product]) => {
                res.redirect('/products/detail/' + productId);
            }).catch(error => console.log(error))
            } else{
                const old = req.body;
                db.Product.findByPk(productId, {
                    include: ['material', 'category']
                })
                    .then(product => {
                        if(req.files) {
                            req.files.forEach(file => {
                                const imgPath = path.join(__dirname, `../../public/img/${product.category.name}/${file.filename}`)
                                fs.unlink(imgPath, error => {
                                    if (error) console.log(error);
                                })
                            })
                        }
                        res.render('./admin/addProduct', {product: product, errors: errors, old: old, edit: true, user: req.session.user ? req.session.user : undefined})
                    })
                    .catch(error => console.log(error))
            }
    },
    delete: (req,res) => {
        //Borrado de productos con Sequelize
        let id = req.params.id;
        db.Product.findByPk(id, {
            include: ['category', 'material']
        })
            .then(product => {
                const files = [];
                if(product.image_1 != 'default-image.svg'){
                   files.push(product.image_1)
                }
                if(product.image_2 != 'default-image.svg'){
                   files.push(product.image_2)
                }
                if(files.length > 0){
                   files.forEach(file => {
                        const imgPath = path.join(__dirname, `../../public/img/${product.category.name}/${file}`)
                        fs.unlink(imgPath, error => {
                            if (error) console.log(error);
                        })
                    })
                }
            })
        db.Product.destroy({
            where: {id : id}
        }).then(()=>{
            res.redirect('/');
        }).catch(error => console.log(error))
    },
    finalizaCompra : (req, res) => {
        res.render('./products/finalizaCompra', {user: req.session.user ? req.session.user : undefined});
    },
    productos: (req,res) => {
        const page = parseInt(req.params.page) || 1;
        const limit = 8;
        const count = db.Product.count()
        const products = db.Product.findAll({
            include: ['category'],
            limit: limit,
            offset: (page-1) * limit,
            order:[['name', 'ASC']]
        })
        Promise
            .all([count,products])
            .then(([count,products]) => {
                res.render('./products/products', { products: products, count: count, limit: limit, user: req.session.user ? req.session.user : undefined });
            })
            .catch(error => console.log(error))
    },
    search: (req,res) => {
        
        const search = req.query.search;
        db.Product.findAll({
            include : ['category'],
            where: {
                name: {
                    [Op.substring]: search
                }
            }
        })
        .then(products => {
            console.log(products)
            res.render('./products/search', {search: search, products: products, user: req.session.user ? req.session.user : undefined})
        })
    },
    postComment: (req, res) => {
        const productId = req.params.id;
        db.Comment.create({
            title: req.body.title,
            content: req.body.comment,
            user_id: parseInt(req.session.user.id),
            product_id: parseInt(productId)
        })
        .then(comment => {
            res.redirect('/products/detail/'+ productId)
        })
    },
    add: (req,res) => {
        const errorsList = validationResult(req).array()

        const id = req.params.id;
        const quantity = parseInt(req.body.quantity);
        const size = req.body.size;

        if(errorsList.length == 0){
            db.Product.findByPk(id,{
                include: ['material', 'category']
            })
                .then(product => {
                    const newProduct = {
                        image: `/img/${product.category.name}/${product.image_1}`,
                        name: product.name,
                        quantity: quantity,
                        size: size,
                        finalPrice: parseFloat(product.price)*(1-(parseFloat(product.discount*0.01))).toFixed(2)
                    }
                    if(!req.session.products){
                        productsCart =[];
                        newProduct.id = 1;
                        productsCart.push(newProduct);
                        req.session.products = productsCart;
                    } else {
                        const id = req.session.products[req.session.products.length-1].id + 1;
                        newProduct.id = id;
                        req.session.products.push(newProduct);
                    }
                    res.redirect('/products/productCart');
                })
                .catch(error => console.log(error))
        } else {
            // res.render('./products/productDetail')
        }
    }
}

module.exports = productController;