const express = require('express')
const path = require('path');

const app = express();

app.use(express.static(path.resolve(__dirname , './public')))
app.listen(3000, () => {
    console.log("Server running at port 3000")
})

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './views/index.html'))
} )

app.get('/register', (req, res) => {
    res.sendFile(path.resolve(__dirname, './views/register.html'))
} )

app.get('/login', (req, res) => {
    res.sendFile(path.resolve(__dirname, './views/login.html'))
})

app.get('/productDetail', (req, res) => {
    res.sendFile(path.resolve(__dirname, './views/productDetail.html'))
})

app.get('/productCart', (req, res) => {
    res.sendFile(path.resolve(__dirname, './views/productCart.html'))
})