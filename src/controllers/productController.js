const fs = require('fs');
const path = require('path');
const db = require('../database/models')
const { Op } = require("sequelize");

const productsPath = path.join(__dirname, '../data/products.json');

const productController = {
    productDetail: (req,res) => {
      //  const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
      //  const product = products.find(article => article.id == IdProduct);
      //  res.render('./products/productDetail', {product: product, user: req.session.user ? req.session.user : undefined });     
        const IdProduct = req.params.id;
        db.Product.findByPk(IdProduct,
            {
                include: ['category', 'material']
        })
            .then(product => {
                 res.render('./products/productDetail', {product: product, user: req.session.user ? req.session.user : undefined });     
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
        //Lógica para almacenar informacion y crear producto
        const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
        let productImages;
        const productName = req.body.name,
        productDescription = req.body.description,
        productPrice = parseFloat(req.body.price),
        productDiscount = parseFloat(req.body.discount),
        productCategory = req.body.category,
        productMaterial = req.body.materials,
        productQuantS = parseInt(req.body.quantityS) || 0,
        productQuantM = parseInt(req.body.quantityM) || 0,
        productQuantL = parseInt(req.body.quantityL) || 0;

        switch(req.files.length){
            case 0:
                productImages = ["default-image.svg","default-image.svg"];
                break;
            case 1:
                if(req.files[0].fieldname == "image1"){
                    productImages = [req.files[0].filename, "default-image.svg"];
                } else {
                    productImages = ["default-image.svg", req.files[0].filename];
                }
                break;
            case 2:
                productImages = [req.files[0].filename, req.files[1].filename];
                break;
        }

        const newProduct ={
            id: products[products.length -1].id + 1,
            name: productName,
            description: productDescription,
            price: productPrice,
            discount: productDiscount,
            category: productCategory,
            size: {
                S: productQuantS,
                M: productQuantM,
                L: productQuantL
            },
            images: productImages,
            material: productMaterial
        }
        products.push(newProduct)
                //Reescribiendo productos
                fs.writeFileSync(productsPath, JSON.stringify(products, null, ' '));
                res.redirect('/products');
    },
    edit: (req,res) => {
        const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
        const productID = req.params.id;
        const productToEdit = products.find( product => product.id == productID)
        res.render('./admin/editProduct', {product: productToEdit, user: req.session.user ? req.session.user : undefined });
    },
    update: (req,res) => {
        const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
        const productID = req.params.id;
        let productToEdit = products.find( product => product.id == productID)
        let productImages;

        // Ordenamos la info recibida en el formulario
        const productName = req.body.name,
                productDescription = req.body.description,
                productPrice = parseFloat(req.body.price),
                productDiscount = parseFloat(req.body.discount),
                productCategory = req.body.category,
                productMaterial = req.body.materials,
                productQuantS = parseInt(req.body.quantityS) || 0,
                productQuantM = parseInt(req.body.quantityM) || 0,
                productQuantL = parseInt(req.body.quantityL) || 0;
        
        switch(req.files.length){
            case 0:
                productImages = productToEdit.images;
                break;
            case 1:
                if(req.files[0].fieldname == "image1"){
                    productImages = [req.files[0].filename, productToEdit.images[1]];
                } else {
                    productImages = [productToEdit.images[0], req.files[0].filename];
                }
                break;
            case 2:
                productImages = [req.files[0].filename, req.files[1].filename];
                break;
        }

        //Lógica para almacenar informacion y editar producto
        productToEdit ={
            id: productToEdit.id,
            name: productName,
            description: productDescription,
            price: productPrice,
            discount: productDiscount,
            category: productCategory,
            size: {
                S: productToEdit.size.S + productQuantS,
                M: productToEdit.size.M + productQuantM,
                L: productToEdit.size.L + productQuantL
            },
            images: productImages,
            material: productMaterial
        }
        const newProducts = products.map( product => {
            if(product.id === productToEdit.id) {
                return product = {...productToEdit}
            } else {
                return product
            }
        })

        //Reescribiendo productos
        fs.writeFileSync(productsPath, JSON.stringify(newProducts, null, ' '));
		res.redirect('/products');
    },
    delete: (req,res) => {
        const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

        //Lógica para borrar producto
         let id = req.params.id;
        let finalProducts = products.filter(product => product.id != id);
        fs.writeFileSync(productsPath, JSON.stringify(finalProducts, null, ' '));
        res.redirect('/');

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
    }
}

module.exports = productController;