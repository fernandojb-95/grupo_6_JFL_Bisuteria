window.onload = () => {
    if(document.querySelector('.user-options')){
        let borrarCuenta = document.querySelector('#borrar-producto');
        let cancelar = document.querySelector('#cancelar');
        let ventanaEmergente = document.querySelector('.ventana');
          
        borrarCuenta.addEventListener('click', function () {
            ventanaEmergente.style.visibility = 'visible';
        }) 
    
        cancelar.addEventListener('click', function () {
            ventanaEmergente.style.visibility = 'hidden';
        })
    }
    
    //Controles para cantidad de artículos
    const quantity = document.querySelector('#quantInput');
    const add = document.querySelector('#add');
    const substract = document.querySelector('#substract');

    add.addEventListener('click', (e) =>{
        e.preventDefault();
        let q = parseInt(quantity.value)
       q = q + 1
       quantity.value = q
    })

    substract.addEventListener('click', (e) =>{
        e.preventDefault();
        let q = parseInt(quantity.value)
       q = q - 1
       q < 0 ? q = 0 : q
       quantity.value = q
    })

    //Imagenes de producto
    let imagenSec = document.querySelector('.imagen-sec')
    imagenSec.addEventListener('click', e => {
        let imagenPrim = document.querySelector('.imagen-principal')
        const trim = imagenPrim.src.indexOf('/img')
        const newPrim = imagenSec.src.slice(trim);
        const newSec = imagenPrim.src.slice(trim);
        imagenPrim.src = newPrim
        imagenSec.src = newSec
    })
    //Agregando producto al carrito
    let form = document.querySelector('#addToCart');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let query = form.action.slice(35);
        fetch('http://localhost:3001/api/products/'+query)
            .then(result => result.json())
            .then(data => {
                const price = parseFloat(data.data.price)*(1-(parseFloat(data.data.discount*0.01)))* parseInt(form.quantity.value);
                const indPrice = parseFloat(data.data.price)*(1-(parseFloat(data.data.discount*0.01)));
                const category = data.data.category.name;
                const product = {
                    image: '/img/' + category + '/' + data.data.image_1,
                    name: data.data.name,
                    size: form.size.value,
                    quantity: form.quantity.value,
                    price: price.toFixed(2),
                    indPrice : indPrice.toFixed(2)
                }
                if(sessionStorage.getItem('cart') === null){
                    const cart = [];
                    cart.push(product);
                    const cartJson = JSON.stringify(cart)
                    sessionStorage.setItem('cart', cartJson)
                } else{
                    const cart = JSON.parse(sessionStorage.getItem('cart'))
                    cart.push(product)
                    const cartJson = JSON.stringify(cart)
                    sessionStorage.setItem('cart', cartJson)
                }
                const cart = JSON.parse(sessionStorage.getItem('cart'))
                const initialValue = 0;
            let sum = cart.reduce(function (total, currentValue) {
                return total + parseFloat(currentValue.price);
            }, initialValue); 
            sessionStorage.setItem('subtotal', sum);
            window.location.href = '/products/productCart';
            })
            .catch(error => console.log(error))
    })
}