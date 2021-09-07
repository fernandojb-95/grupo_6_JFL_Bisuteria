const productController = {
    productDetail: (req,res) => {
        res.render('./products/productDetail');
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
    finalizaCompra : (req, res) => {
        res.render('./products/finalizaCompra');
    }
}

module.exports = productController;