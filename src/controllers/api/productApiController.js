const path = require('path');
const db = require('../../database/models');

const productController = {
    list: (req,res) => {
        const count = db.Product.count({
            include : [
                {
                association: 'category'
            }
        ],
            group: ['category.name']
        })
        const products = db.Product.findAll({
            include: ['category', 'material']
        })
        Promise
            .all([count,products])
            .then(([count,products]) => {
                const total = products.map( product => {
                    return {
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        category: product.category,
                        material: product.material,
                        detail: '/api/products/'+ product.id
                    }
                })
                const response = {
                    count: {
                        count: products.length,
                        countByCategory: count,
                        url: '/api/products'
                    },
                    data: total
                }
                res.json(response)
            })
            .catch( error => console.log(error))
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
    }
}

module.exports = productController