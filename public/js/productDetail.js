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
}