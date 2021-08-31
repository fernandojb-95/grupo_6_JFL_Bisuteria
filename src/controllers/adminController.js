const adminController = {
    addProduct: (req,res) => {
        res.render('./admin/addProduct');
    },
    editProduct: (req,res) => {
        res.render('./admin/editProduct');
    }
}

module.exports = adminController;