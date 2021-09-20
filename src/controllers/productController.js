const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '../data/products.json');

const productController = {
    productDetail: (req,res) => {
        const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
        const IdProduct = req.params.id;
        const product = products.find(article => article.id == IdProduct)
        res.render('./products/productDetail', {product: product});
    },
    productCart : (req, res) => {
        res.render('./products/productCart');
    },
    anillos : (req, res) => {
        const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
        const rings = products.filter(product => product.category == 'anillos')
        res.render('./products/anillos', {products: rings});
    },
    brazaletes : (req, res) => {
        const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
        const braceletes = products.filter(product => product.category == 'brazaletes')
        res.render('./products/brazaletes', {products: braceletes});
    },
    collares : (req, res) => {
        const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
        const necklaces = products.filter(product => product.category == 'collares')
        res.render('./products/collares', {products: necklaces});
    },
    create: (req,res) => {
        res.render('./admin/addProduct');
    },
    store: (req,res) =>{
        res.send('Creando articulo con post');
        //Lógica para almacenar informacion y crear producto

    },
    edit: (req,res) => {
        const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
        const productID = req.params.id;
        const productToEdit = products.find( product => product.id == productID)
        res.render('./admin/editProduct', {product: productToEdit});
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
        const allProducts = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
        res.render('./products/products', {products: allProducts} );
    }
}

module.exports = productController;