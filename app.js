const express = require('express')
const path = require('path');
const app = express();
const methodOverride = require('method-override');

//Solicitando las rutas
const mainRoutes = require('./src/routes/mainRoutes');
const userRoutes = require('./src/routes/userRoutes');
const productRoutes = require('./src/routes/productRoutes');

//Configuracion del motor de vistas
app.set('views', path.join(__dirname, '/src/views'));
app.set('view engine', 'ejs');

// Configuracion de archivos estáticos
app.use(express.static(path.resolve(__dirname , './public')))

//Configuracion de métodos para formulario
app.use(methodOverride('_method'));

//Recibir datos en formato JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Levantando el servidor
app.listen(3000, () => {
    console.log("Server running at port 3000")
})

//Rutas principales
app.use('/', mainRoutes);

//Rutas de usuarios
app.use('/user', userRoutes);

//Rutas de productos
app.use('/products', productRoutes);

//Ruta 404
// app.use((req,res,next) =>{
//     res.status(404).render('not-found');
// })