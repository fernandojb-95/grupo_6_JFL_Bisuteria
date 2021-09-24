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
        res.render('./admin/editProduct', {product: productToEdit});
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
        //res.send('Borrando artículos con delete');
        const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

        //Lógica para borrar producto
         let id = req.params.id;
        let finalProducts = products.filter(product => product.id != id);
        fs.writeFileSync(productsPath, JSON.stringify(finalProducts, null, ' '));
        res.redirect('/');

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