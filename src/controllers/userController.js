const fs = require('fs');
const path = require('path');
const usersPath = path.join(__dirname, '../data/users.json');

const userController = {
    login: (req, res) => {
        res.render('./users/login');
    },
    register: (req, res) => {
        res.render('./users/register');
    },
    procesarRegistro: (req,res)=> {
        //Lógica para almacenar usuarios nuevos
        const products = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
        const userName = req.body.user,
        lastNameUser = req.body.lastname,
        correo = req.body.email;

    }
}

module.exports = userController;