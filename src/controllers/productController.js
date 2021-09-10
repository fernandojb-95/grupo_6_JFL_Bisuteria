const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '../data/products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
const productController = {
    productDetail: (req,res) => {
        const IdProduct = req.params.id;
        const product = products.find(article => article.id == IdProduct)
        res.render('./products/productDetail', {product: product});
    },
    productCart : (req, res) => {
        res.render('./products/productCart');
    },
    anillos : (req, res) => {
        res.render('./products/anillos');
    },
    brazaletes : (req, res) => {
        res.render('./products/brazaletes');
    },
    collares : (req, res) => {
        res.render('./products/collares');
    },
    create: (req,res) => {
        res.render('./admin/addProduct');
    },
    store: (req,res) =>{
        res.send('Creando articulo con post');

        //Lógica para almacenar informacion y crear producto

    },
    edit: (req,res) => {
        res.render('./admin/editProduct');
    },
    update: (req,res) => {
        res.send('Actualizando articulo con patch');

        //Lógica para almacenar informacion y editar producto
    },
    delete: (req,res) => {
        res.send('Borrando artículos con delete')

        //Lógica para borrar producto

    },
    finalizaCompra : (req, res) => {
        res.render('./products/finalizaCompra');
    },
    productos: (req,res) => {
        res.render('./products/products');
    }
}

module.exports = productController;