const fs = require('fs');
const path = require('path');
const {validationResult} = require('express-validator');
const db = require('../database/models');
const { Op } = require("sequelize");
const { sequelize } = require('../database/models');

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
                 res.render('./products/productDetail', {product: product, comments: comments,user: req.session.user ? req.session.user : undefined });     
            })
    },
    productCart : (req, res) => {
        res.render('./products/productCart', {user: req.session.user ? req.session.user : undefined});
    },
    anillos : (req, res) => {
        // const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
        // const rings = products.filter(product => product.category == 'anillos')
        // res.render('./products/anillos', {products: rings, user: req.session.user ? req.session.user : undefined});
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
        // const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
        // const braceletes = products.filter(product => product.category == 'brazaletes');
        // res.render('./products/brazaletes', {products: braceletes, user: req.session.user ? req.session.user : undefined });
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
        // const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
        // const necklaces = products.filter(product => product.category == 'collares');
        // res.render('./products/collares', {products: necklaces, user: req.session.user ? req.session.user : undefined });
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
            db.Product.create({
                name: req.body.name,
                description: req.body.description,
                price: parseFloat(req.body.price),
                discount: parseFloat(req.body.discount) || 0,
                quantity_S: parseInt(req.body.quantityS) || 0,
                quantity_M: parseInt(req.body.quantityM) || 0,
                quantity_L: parseInt(req.body.quantityL) || 0,
                image_1: req.files.length > 0 ? req.files[0].filename : undefined,
                image_2: req.files.length > 1 ? req.files[1].filename : undefined,
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
        // const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
        // const productToEdit = products.find( product => product.id == productID)
        const productID = req.params.id;
        db.Product.findByPk(productID, {
            include: ['category', 'material']
        })
        .then(old => {
            console.log(old.category.name)
            res.render('./admin/addProduct', {old: old, edit: true, user: req.session.user ? req.session.user : undefined });
        })
        .catch(error => console.log(error))
    },
    update: (req,res) => {
        // // const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
        // const productID = req.params.id;
        // let productToEdit = products.find( product => product.id == productID)
        // let productImages;
        const productId = req.params.id
        // // Ordenamos la info recibida en el formulario
        const productName = req.body.name,
                productDescription = req.body.description,
                productPrice = parseFloat(req.body.price),
                productDiscount = parseFloat(req.body.discount) ||0,
                productCategory = parseInt(req.body.category),
                productMaterial = parseInt(req.body.material),
                productQuantS = parseInt(req.body.quantityS) || 0,
                productQuantM = parseInt(req.body.quantityM) || 0,
                productQuantL = parseInt(req.body.quantityL) || 0;
        
        // switch(req.files.length){
        //     case 0:
        //         productImages = productToEdit.images;
        //         break;
        //     case 1:
        //         if(req.files[0].fieldname == "image1"){
        //             productImages = [req.files[0].filename, productToEdit.images[1]];
        //         } else {
        //             productImages = [productToEdit.images[0], req.files[0].filename];
        //         }
        //         break;
        //     case 2:
        //         productImages = [req.files[0].filename, req.files[1].filename];
        //         break;
        // }

        // //Lógica para almacenar informacion y editar producto
        // productToEdit ={
        //     id: productToEdit.id,
        //     name: productName,
        //     description: productDescription,
        //     price: productPrice,
        //     discount: productDiscount,
        //     category: productCategory,
        //     size: {
        //         S: productToEdit.size.S + productQuantS,
        //         M: productToEdit.size.M + productQuantM,
        //         L: productToEdit.size.L + productQuantL
        //     },
        //     images: productImages,
        //     material: productMaterial
        // }
        // const newProducts = products.map( product => {
        //     if(product.id === productToEdit.id) {
        //         return product = {...productToEdit}
        //     } else {
        //         return product
        //     }
        // })

        // //Reescribiendo productos
        // fs.writeFileSync(productsPath, JSON.stringify(newProducts, null, ' '));
        const updating = db.Product.update({
            name: req.body.name,
                description: productDescription,
                price: productPrice,
                discount: productDiscount,
                image_1: req.files.length > 0 ? req.files[0].filename : undefined,
                image_2: req.files.length > 1 ? req.files[1].filename : undefined,
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
		
    },
    delete: (req,res) => {
        // const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

        //Lógica para borrar producto
        // let id = req.params.id;
        // let finalProducts = products.filter(product => product.id != id);
        // fs.writeFileSync(productsPath, JSON.stringify(finalProducts, null, ' '));

        //Borrado de productos con Sequelize
        let id = req.params.id;
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
        // const allProducts = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
        // res.render('./products/products', { products: allProducts, user: req.session.user ? req.session.user : undefined });
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
    }
}

module.exports = productController;