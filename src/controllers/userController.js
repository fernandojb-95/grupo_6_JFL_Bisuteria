const fs = require('fs');
const path = require('path');
const usersPath = path.join(__dirname, '../data/users.json');
const bcrypt = require('bcrypt');

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
        pass = bcrypt.hashSync(req.body.password,10);

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

    },
    logUser: (req, res) => {
        let email = req.body.email;
        let password = req.body.password;
        const users = JSON.parse(fs.readFileSync(usersPath,'utf-8')); 
        const user = users.find(user => user.email == email);
        if(user === undefined || user.password != password){
            res.render('./users/login', {msg: 'Tu correo o tu contraseña son incorrectos'})
        }
        else {
            req.session.user = user;
            res.redirect('/');
        }
    },
    profile: (req,res) => {
        res.render('./users/profile');
    }
}
module.exports = userController;