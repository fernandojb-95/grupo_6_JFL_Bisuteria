const productController = {
    productDetail: (req,res) => {
        res.render('./products/productDetail');
    },
    productCart : (req, res) => {
        res.render('./products/productCart');
    }
}

module.exports = productController;