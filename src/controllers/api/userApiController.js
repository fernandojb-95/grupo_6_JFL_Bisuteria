const path = require('path');
const db = require('../../database/models');

const userController = {
    list: (req,res) => {
        const count = db.User.count({
            group: ['isAdmin']
        })
        const users = db.User.findAll({
        })
        Promise
        .all([count,users])
        .then(([count,users]) => {
            const total = users.map( user => {
                return {
                    id: user.id,
                    name: user.first_name,
                    lastName: user.last_name,
                    email: user.email,
                    detail: '/api/users/'+ user.id
                }
            })
            const response = {
                count: users.length,
                title: 'Usuarios',
                data: total,
                icon: 'fa-user-check'
            }
            res.json(response)
        })
        .catch( error => console.log(error))
    },
    detail: (req,res) => {
        const id = req.params.id
        db.User.findByPk(id, {
            attributes: { exclude: ['password','isAdmin', 'image'] }
        })
        .then(user => {
            const response = {
                data: user
            }
            res.json(response)
        })
        .catch(error => console.log(error))
}
}

module.exports = userController