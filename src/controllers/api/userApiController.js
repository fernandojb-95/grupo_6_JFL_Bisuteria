const path = require('path');
const db = require('../../database/models');

const userController = {
    list: (req,res) => {
        res.send('Hola user')
    }
}

module.exports = userController