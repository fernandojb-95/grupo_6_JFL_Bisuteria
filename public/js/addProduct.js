
window.onload = () => {
    const preview = [...document.querySelectorAll('.img-preview')];
    const files = [...document.querySelectorAll(".image-file")];
    const deleteButton = [...document.querySelectorAll(".delete")];
    const form = document.querySelector("#productForm");
    
const verifyNumber = ( n, input, errors) => {
    if(n.value === '' || isNaN(n.value)){
        const errorMsg = {
            msg: `Formato de ${input.id} inválido`,
            name: `${input.name}-error` 
        }
        errors.push(errorMsg)
    }
}
const verifyString = ( s, input, length, errors) => {
    const chain = s.value.replace(/ /g, '')
    if(chain.length === 0 || s.value.length< length){
        const errorMsg = {
            msg: `Formato de ${input.id} inválido`,
            name: `${input.name}-error`
        }
        errors.push(errorMsg)
    }
}
    
    files.forEach( (file, i) => {
        file.addEventListener('change', function(e) {
            let filePath = file.value;
            let allowedExtensions = /(.jpg|.jpeg|.png|.gif)$/i;
            if(!allowedExtensions.exec(filePath)){
                if(document.querySelector('#errorImg'))
                document.querySelector('#errorImg').remove();
                const imgError = document.querySelector('.agregar-img')
                let errorMsg = document.createElement('p')
                errorMsg.innerText = 'Por favor, carga un archivo con alguna de las siguientes extensiones: .jpeg/.jpg/.png/.gif.'
                errorMsg.classList.add('error-msg')
                errorMsg.id = 'errorImg'
                imgError.insertAdjacentElement('beforeend', errorMsg)
                file.value = '';
                preview[i].innerHTML = '';
            } else {
                if(document.querySelector('#errorImg'))
                document.querySelector('#errorImg').remove();

                let reader = new FileReader();
                reader.readAsDataURL(e.target.files[0]);
                reader.addEventListener('load', function(){
                    let image = document.createElement('img');
                    image.src = reader.result;
                    image.id = `pre-image${i+1}`;
                    deleteButton[i].style.display = 'block';
                    preview[i].innerHTML = '';
                    preview[i].append(image);
                    preview[i].append(deleteButton[i])  
                    })
            }
      }) 
    })

    deleteButton.forEach((button, i) => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            files[i].value = ""
            if(document.getElementById(`pre-image${i+1}`)){
                document.getElementById(`pre-image${i+1}`).remove();
                button.style.display = 'none';
            }
        }) 
    })

    form.addEventListener('submit', (e) => {
        const errorsDiv = [...document.querySelectorAll('.error-container')]
        console.log(errorsDiv)
        e.preventDefault()
        const errors = []
        let errorsContainer;
        const name = e.target.name,
            description = e.target.description,
            price = e.target.price,
            discount = e.target.discount,
            category = e.target.category,
            material = e.target.material,
            quantityS = e.target.quantityS,
            quantityM = e.target.quantityM,
            quantityL = e.target.quantityL;

        verifyString(name, name, 2, errors)
        verifyString(description, description, 20, errors)

        verifyNumber(price, price, errors)
        verifyNumber(discount, discount, errors)
        verifyNumber(quantityS, quantityS, errors)
        verifyNumber(quantityM, quantityM, errors)
        verifyNumber(quantityL, quantityL, errors)

        if(category.value !== '1' && category.value !== '2' && category.value !== '3'){
            const errorMsg = {
                msg: 'Formato de categoría inválido',
                name: 'category-error'
            }
            errors.push(errorMsg)
        }
        if(material.value !== '1' && material.value !== '2' && material.value !== '3'){
            const errorMsg = {
                msg: 'Formato de material inválido',
                name: 'material-error'
            }
            errors.push(errorMsg)
        }
        console.log(errors)

        errorsContainer = document.createElement('ul');
        errorsContainer.id = 'errorsList'
        errorsContainer.classList.add('errors-list')
        if(document.getElementById('errorsList'))
            document.getElementById('errorsList').remove()
        errors.forEach(error => {
            errorsContainer.innerHTML += `<li class="error-msg">${error.msg}</li>` 
        })
        form.insertAdjacentElement('beforebegin',errorsContainer)

        if(errors.length == 0){
            form.submit();
        }
    })
}