const productController = {
    productDetail: (req,res) => {
        res.render('./products/productDetail');
    },
    productCart : (req, res) => {
        res.render('./products/productCart');
    },
    editProduct : (req, res) => {
        res.render('./products/editProduct');
    }
}

module.exports = productController;