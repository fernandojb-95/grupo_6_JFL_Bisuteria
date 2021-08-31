const express = require('express')
const path = require('path');
const app = express();

//Solicitando las rutas
const mainRoutes = require('./src/routes/mainRoutes');
const userRoutes = require('./src/routes/userRoutes');
const productRoutes = require('./src/routes/productRoutes');
const adminRoutes = require('./src/routes/adminRoutes')

//Configuracion del motor de vistas
app.set('views', path.join(__dirname, '/src/views'));
app.set('view engine', 'ejs');

// Configuracion de archivos estáticos
app.use(express.static(path.resolve(__dirname , './public')))

//Levantando el servidor
app.listen(3000, () => {
    console.log("Server running at port 3000")
})

//Rutas principales
app.use('/', mainRoutes);

//Rutas de usuarios
app.use('/user', userRoutes);

//Rutas de productos
app.use('/product', productRoutes);

//Rutas de administrador
app.use('/admin', adminRoutes);

//Ruta 404

app.use((req,res,next) =>{
    res.status(404).render('not-found');
})