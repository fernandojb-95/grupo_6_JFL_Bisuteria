const productController = {
    productDetail: (req,res) => {
        res.render('./products/productDetail');
    },
    productCart : (req, res) => {
        res.render('./products/productCart');
    },
    editProduct : (req, res) => {
        res.render('./products/editProduct');
    },
    anillos : (req, res) => {
        res.render('./products/anillos');
    },
    brazaletes : (req, res) => {
        res.render('./products/brazaletes');
    },
    collares : (req, res) => {
        res.render('./products/collares');
    }
}

module.exports = productController;