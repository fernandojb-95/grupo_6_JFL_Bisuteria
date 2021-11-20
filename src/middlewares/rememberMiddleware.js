const fs = require('fs');
const path = require('path');
const usersPath = path.join(__dirname, '../data/users.json');
const db = require('../database/models')

const remember = (req, res, next) => {
    if(req.cookies.remember != undefined && req.session.user == undefined) {
        const email = req.cookies.remember;
        db.User.findOne({
            where: {
                email: email
            }
        })
        .then(user => {
            req.session.user = user;
        })
        .catch(error => console.log(error))
    }
    next();
}

module.exports = remember
