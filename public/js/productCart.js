window.onload = () => {
    if(sessionStorage.getItem('cart') != null && sessionStorage.getItem('subtotal') != 0 ){
        const temp = document.getElementById('template'),
        cartTemp = temp.content.cloneNode(true);
        const productsCart = cartTemp.querySelector('.cuadro-productos');
        const products = JSON.parse(sessionStorage.getItem('cart'));
        products.forEach(product => {
            const singleProduct = document.createElement('div');
            singleProduct.classList.add('visualizacion-productos')
            singleProduct.innerHTML = `
            <div class="imagen-producto">
                <img class= "img" src="${product.image}" alt="imagen-producto" />
            </div>
            <div  class="final-product-form">
                <div class="resumen">
                    <h3 class="title">${product.name}</h3>
                    <div class="size-opc">
                        <label for="product-cart-size">Talla: </label>
                        <select name="size" class="select-size">
                            <option value="1" ${product.size == 'S' ? 'selected': ''}>S</option>
                            <option value="2" ${product.size == 'M' ? 'selected': ''}>M</option>
                            <option value="3" ${product.size == 'L' ? 'selected': ''}>L</option>
                        </select>
                    </div>
                        <div class="cantidad_car">
                            <p>Cantidad:</p>
                            <div class="quant-control">
                                <button id="substract"><i class="fas fa-minus-circle"></i></button>
                                    <input type="number" value="${product.quantity}" class="quant-input" name="quantity">
                                <button id="add"><i class="fas fa-plus-circle"></i></button>
                            </div>
                        </div>
                </div>
                <div class="total">
                    <p>Precio:$ <span>${product.price}</span></p>
                    <button type="submit" class="delete">Borrar artículo <i class="fas fa-trash"></i></button>
                </div>
            </div>`  
            productsCart.appendChild(singleProduct)
        })

        const subtotalSpan = cartTemp.getElementById('subtotalPrice');
        const totalSpan = cartTemp.getElementById('totalPrice');
        const subtotalPrice = parseFloat(sessionStorage.getItem('subtotal')).toFixed(2);
        subtotalSpan.innerText = subtotalPrice;
        const finalPrice = parseFloat(subtotalPrice)+50;
        totalSpan.innerText = finalPrice.toFixed(2);
        const main = document.querySelector('main');
        main.appendChild(cartTemp)
    }

    if(document.querySelector('.purchase-form')){
        let quantityInputs = [...document.querySelectorAll('.quant-input')];
        const productPrice = [...document.querySelectorAll('.total span')];
        const deleteButtons = [...document.querySelectorAll('.delete')];
        quantityInputs.forEach((input,i) => {
            input.id = `quantInput${i}`
        })
        let minusButton = [...document.querySelectorAll('.fa-minus-circle')]
        minusButton.forEach((button,i) => {
            button.id = `minus${i}`
            button.addEventListener('click', (e) => {
                e.preventDefault();
                quantityInputs[i].value = quantityInputs[i].value == 1 ?  1 : quantityInputs[i].value -1;
                const products = JSON.parse(sessionStorage.getItem('cart'));
                const productCartPrice = parseFloat(products[i].indPrice)*parseInt(quantityInputs[i].value);
                products[i].price =  productCartPrice.toFixed(2);
                products[i].quantity = parseInt(quantityInputs[i].value);
                productPrice[i].innerText = products[i].price;
                const initialValue = 0;
                let sum = products.reduce(function (total, currentValue) {
                return total + parseFloat(currentValue.price);
            }, initialValue); 
            sessionStorage.setItem('cart', JSON.stringify(products));
            sessionStorage.setItem('subtotal', sum);
            const subtotalSpan = document.getElementById('subtotalPrice');
            const totalSpan = document.getElementById('totalPrice');
            const subtotalPrice = parseFloat(sessionStorage.getItem('subtotal')).toFixed(2);
            subtotalSpan.innerText = subtotalPrice;
            const finalPrice = parseFloat(subtotalPrice)+50;
            totalSpan.innerText = finalPrice.toFixed(2);
            })
        })
        let plusButton = [...document.querySelectorAll('.fa-plus-circle')]
        plusButton.forEach((button,i) => {
            button.id = `plus${i}`;
            button.addEventListener('click', (e) => {
                e.preventDefault()
                quantityInputs[i].value = parseInt(quantityInputs[i].value) + 1;
                const products = JSON.parse(sessionStorage.getItem('cart'));
                const productCartPrice = parseFloat(products[i].indPrice)*parseInt(quantityInputs[i].value);
                products[i].price =  productCartPrice.toFixed(2);
                products[i].quantity = parseInt(quantityInputs[i].value);
                productPrice[i].innerText = products[i].price;
                const initialValue = 0;
                let sum = products.reduce(function (total, currentValue) {
                return total + parseFloat(currentValue.price);
            }, initialValue); 
            sessionStorage.setItem('cart', JSON.stringify(products));
            sessionStorage.setItem('subtotal', sum);
            const subtotalSpan = document.getElementById('subtotalPrice');
            const totalSpan = document.getElementById('totalPrice');
            const subtotalPrice = parseFloat(sessionStorage.getItem('subtotal')).toFixed(2);
            subtotalSpan.innerText = subtotalPrice;
            const finalPrice = parseFloat(subtotalPrice)+50;
            totalSpan.innerText = finalPrice.toFixed(2);
            })
        })

        //Eliminando productos
        deleteButtons.forEach((button, i) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const products = JSON.parse(sessionStorage.getItem('cart'));
                const newProducts = products.filter(product => product !== products[i])
                const initialValue = 0;
                let sum = newProducts.reduce(function (total, currentValue) {
                return total + parseFloat(currentValue.price);
            }, initialValue);
                sessionStorage.setItem('cart', JSON.stringify(newProducts));
                sessionStorage.setItem('subtotal', sum);
                document.location.reload(true);
            })
        })

        //Ir a pagos- finalizar compra
        const payButton = document.getElementById('submit');
        payButton.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.clear();
            window.location.href = '/products/finalizaCompra';
        })

    } else{
        const main = document.querySelector('main');
        const message = document.createElement('h3');
        message.innerText = 'No hay productos en tu carrito';
        main.appendChild(message);
    }
}