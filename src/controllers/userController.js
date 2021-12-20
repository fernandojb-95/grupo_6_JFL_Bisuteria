const fs = require('fs');
const path = require('path');
const usersPath = path.join(__dirname, '../data/users.json');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const db = require('../database/models');

const userController = {
    login: (req, res) => {
        res.render('./users/login'); 
    },
    register: (req, res) => {
        res.render('./users/register'); 
    },
    procesarRegistro: (req,res)=> {

        //Logica para validar los campos recibidos
        let errorsList = validationResult(req);
        let errors = errorsList.array();
        console.log(errors)
        if(req.fileValidationError) 
            errors.push((req.fileValidationError))
        if(errors.length === 0 && !req.fileValidationError){
            //Lógica para almacenar usuarios nuevos
            const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
            let userName = req.body.user,
                lastNameUser = req.body.lastname,
                email = req.body.email,
                userImage = "",
                password = bcrypt.hashSync(req.body.password,10);

            //Asignamos el nombre del archivo o la imagen por default
            req.file ? userImage =  req.file.filename : userImage = "default-user.png";

            //Condicion para diferenciar usuarios o administradores
            let isAdmin = email.search('@jflbisuteria.com.mx') != -1 ? 1 : 0;

            db.User.create({
                first_name: userName,
                last_name: lastNameUser,
                email: email,
                password: password,
                isAdmin: isAdmin,
                image: userImage
            })
            .then(user => {
                res.redirect('/');
            }).catch(error => console.log(error))
        }
        else{
            if(req.file){
                const imgPath = path.join(__dirname, `../../public/img/users/${req.file.filename}`)
                fs.unlink(imgPath, error => {
                    if (error) console.log(error);
                })
            }
            res.render('./users/register',{errors: errors, old:req.body});
        }
    },
    logUser: (req, res) => {
        let email = req.body.email;
        let password = req.body.password;
        db.User.findOne({
            where: {
                email: email
            }
        })
        .then(user => {            
            if(user === null){
                res.render('./users/login', {msg: 'Tu correo o tu contraseña son incorrectos'})
            }
            else {
                const comparison = bcrypt.compareSync(password,user.password);
                if(!comparison){
                    res.render('./users/login', {msg: 'Tu correo o tu contraseña son incorrectos'})
                }
                else{
                    req.session.user = user;
                    if(req.body.remember != undefined){
                        res.cookie('remember', user.email, {maxAge: 600000000})
                    }
                    res.redirect('/');
                }
            }
        })
        .catch(error => console.log(error))
    },
    profile: (req,res) => {
        if(req.session.user) {
            db.User.findByPk(req.params.id
            ).then(usu => {
                res.render('./users/profile', {usu, user: req.session.user ? req.session.user : undefined});
            })    
        }  
    },
    editUser: (req,res) => {
        const id = req.params.id;
        const user = req.session.user;
        res.render('./users/userForm', {user})
    },
    confirmEdit: (req,res) => {
        let userId = req.params.id;
        const user = req.session.user;
        
        let errorsList = validationResult(req).array();
        if(req.body.password === '' && req.body.passwordConfirm === ''){
            errorsList = errorsList.filter(error => {
                if(error.param !== 'password' && error.param !== 'passwordConfirm' && error.param != 'authorized'){
                 return error
                } 
             })
        }
        if(req.fileValidationError) 
        errorsList.push((req.fileValidationError))
        errorsList = errorsList.filter(error => error.param !== 'authorized')
        console.log(errorsList);
        if(errorsList.length === 0 && !req.fileValidationError){
            let userName = req.body.user,
                lastNameUser = req.body.lastname,
                userImage = "",
                email = req.body.email,
                password = req.body.password != '' ? bcrypt.hashSync(req.body.password,10) : user.password;
            
            //Asignamos el nombre del archivo o la imagen por default
            req.file ? userImage =  req.file.filename : userImage = undefined;
            
            if(user.image !== 'default-user.png' && req.body.delete){
                const imgPath = path.join(__dirname, `../../public/img/users/${user.image}`)
                fs.unlink(imgPath, error => {
                    if (error) console.log(error);
                })
                if(req.body.delete){
                    userImage = 'default-user.png'
                }
            }

            //Condicion para diferenciar usuarios o administradores
            let isAdmin = email.search('@jflbisuteria.com.mx') != -1 ? 1 : 0;

            db.User.update({
                first_name: userName,
                last_name: lastNameUser,
                email: email,
                password: password,
                isAdmin: isAdmin,
                image: userImage
            },{
                where: {
                    id: userId
                }
            }).then( () => {
                db.User.findByPk(userId)
                    .then(user => {
                        req.session.user = user;
                        res.render( './users/profile', { user, msg: '¡Tu perfil se ha actualizado con éxito!'});
                    })
                    .catch(error => console.log(error))
            })
            .catch(error => console.log(error))
        }else{
            if(req.file){
                const imgPath = path.join(__dirname, `../../public/img/users/${req.file.filename}`)
                fs.unlink(imgPath, error => {
                    if (error) console.log(error);
                })
            }
            res.render('./users/userForm',{errors: errorsList, old:req.body, user});
        }
    },
    delete: (req,res) => {

        //Borrado de usuarios con Sequelize
        let id = req.params.id;
        let user = req.session.user;
        if(user.image !== 'default-user.png'){
            const imgPath = path.join(__dirname, `../../public/img/users/${user.image}`)
            fs.unlink(imgPath, error => {
                if (error) console.log(error);
            })
        }
        db.User.destroy({
            where: {id : id}
        }).then(()=>{
            req.session.destroy();
            res.clearCookie('remember');
            res.redirect('/');
        }).catch(error => console.log(error))
    },
    logoff: (req, res) => {
        req.session.destroy();
        res.clearCookie('remember');
        res.redirect('/')
        
    }
}
module.exports = userController;