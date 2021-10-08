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
        const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
        const userName = req.body.user,
        lastNameUser = req.body.lastname,
        email = req.body.email,
        pass = req.body.password;

        //Creamos el JSON con los datos del nuevo usuario
        const newUser ={
            id: users[users.length -1].id + 1,
            first_name: userName,
            last_name: lastNameUser,
            email: email,
            password: pass,
            category: "user",
            images: "imagenusuario",
        }

        users.push(newUser);

        //Reescribiendo usuarios
        fs.writeFileSync(usersPath, JSON.stringify(users, null, ' '));

        res.redirect('/');

    }
}

module.exports = userController;