window.onload = () => {
    let borrarCuenta = document.querySelector('#borrar-cuenta');
    let cancelar = document.querySelector('#cancelar');
    let ventanaEmergente = document.querySelector('.ventana');
      
    borrarCuenta.addEventListener('click', function () {
        ventanaEmergente.style.visibility = 'visible';
    }) 

    cancelar.addEventListener('click', function () {
        ventanaEmergente.style.visibility = 'hidden';
    }) 
}