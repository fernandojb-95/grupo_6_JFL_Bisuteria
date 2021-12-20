window.onload = () => {
    if(document.querySelector('.purchase-form')){
        console.log('Hay productos')
        let quantityInputs = [...document.querySelectorAll('.quant-input')]
        quantityInputs.forEach((input,i) => {
            input.id = `quantInput${i}`
        })
        let minusButton = [...document.querySelectorAll('.fa-minus-circle')]
        minusButton.forEach((button,i) => {
            button.id = `minus${i}`
            button.addEventListener('click', (e) => {
                e.preventDefault();
                quantityInputs[i].value = quantityInputs[i].value == 0 ?  0 : quantityInputs[i].value -1;
            })
        })
        let plusButton = [...document.querySelectorAll('.fa-plus-circle')]
        plusButton.forEach((button,i) => {
            button.id = `plus${i}`;
            button.addEventListener('click', (e) => {
                e.preventDefault()
                quantityInputs[i].value = parseInt(quantityInputs[i].value) + 1;
            })
        })

        let prices = [...document.querySelectorAll('.total p')]
        
    } else{
        console.log('No hay productos')
    }
}