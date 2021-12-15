const path = require('path');
const db = require('../../database/models');

const productController = {
    list: (req,res) => {
        const count = db.Product.count({
            include : ['category'],
            group: ['category.name']
        })
        const products = db.Product.findAll({
            include: ['category', 'material'],
            attributes : {exclude: ['price', 'discount','quantity_S', 'quantity_M', 'quantity_L', 'image_1', 'image_2', 'sold', 'material_id', 'category_id']}
        })
        Promise
            .all([count,products])
            .then(([count,products]) => {
                const total = products.map( product => {
                    return {
                        ...product.dataValues,
                        detail: '/api/products/'+ product.id
                    }
                })
                const response = {
                    count: products.length,
                    countByCategory: count,
                    title: 'Products',
                    data: total
                }
                res.json(response)
            })
            .catch(error => console.log(error))
    },
    detail: (req,res) => {
        const id = req.params.id
        db.Product.findByPk(id, {
            include: ['material', 'category'],
            attributes: { exclude: ['category_id', 'material_id'] }
        })
            .then(product => {
                const response = {
                    data: product
                }
                res.json(response)
            })
            .catch(error => console.log(error))
    },
    products: (req,res) => {

        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = limit * (page - 1);

        const count = db.Product.count();
        const products = db.Product.findAll({
            include: ['category', 'material'],
            limit : limit,
            offset: offset,
            attributes : {exclude: ['price', 'discount','quantity_S', 'quantity_M', 'quantity_L', 'image_1', 'image_2', 'sold', 'material_id', 'category_id']}
        })
        const lastProduct = db.Product.findOne({
            order: [['id', 'DESC']]
        })
        Promise
            .all([count, products, lastProduct])
            .then(([count, products, lastProduct]) => {
                const total = products.map( product => {
                    return {
                        ...product.dataValues,
                        detail: '/api/products/'+ product.id
                    }
                })
               const last = products.find(product => product.id == lastProduct.id)
            const response = {
                count: count,
                next: products.length < limit || last != undefined ? null : `/api/products/all/?page=${page + 1}`,
                previous: parseInt(products[0].id) === 1 ? null : `/api/products/all/?page=${page - 1}`,
                data: total
            }
            res.json(response)
        })
        .catch(error => console.log(error))
    },
    categories: (req,res) => {
        db.Category.findAll()
            .then(data => {
                const response = {
                    count: data.length,
                    title:"Categories",
                    data: data
                }
                res.json(response)
            })
    }
}

module.exports = productController