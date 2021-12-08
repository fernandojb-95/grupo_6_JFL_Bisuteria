window.onload = () => {
    let preview = document.querySelector('.img-preview');
    const file = document.getElementById("file");
    let deleteButton = document.getElementById("delete");
    let formulario = document.getElementById('register-form');

    const verifyString = ( s, input, length, errors) => {
        const chain = s.value.replace(/ /g, '')
        if(chain.length === 0 || s.value.length < length){
            const errorMsg = {
                msg: `Formato de ${input.id} inválido`,
                name: `${input.name}-error`
            }
            errors.push(errorMsg)
        }
    }

    const validateEmail = (email,errors) => {
        if(!String(email.value).match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
            {
                const errorMsg = {
                    msg: `Formato de ${email.id} inválido`,
                    name: `${email.name}-error`
                }
                errors.push(errorMsg)
            }
      };

    
    file.addEventListener('change', function(e) {
        // Creamos el objeto de la clase FileReader
        let reader = new FileReader();
        // Leemos el archivo subido y se lo pasamos a nuestro fileReader
        reader.readAsDataURL(e.target.files[0]);
        // Le decimos que cuando este listo ejecute el código interno
        reader.addEventListener('load', function(){
            let image = document.createElement('img');
            image.src = reader.result;
            image.id = 'pre-image';
            deleteButton.style.display = 'block'
            preview.innerHTML = '';
            preview.append(image);
            preview.append(deleteButton)  
            }) 
      }) 
      
    deleteButton.addEventListener('click', function (e) {
        e.preventDefault()
        document.getElementById("file").value = ""
        if(document.getElementById('pre-image')){
            document.getElementById('pre-image').remove();
            deleteButton.style.display = 'none';
        }
    }) 

    formulario.addEventListener('submit', function (e){
        e.preventDefault();
        const name = e.target.user,
            lastname = e.target.lastname,
            email = e.target.email,
            password = e.target.password
            ;

        const errors = [];
        
        let errorsContainer;

        verifyString(name, name, 2, errors);
        verifyString(lastname, lastname, 2, errors);
        validateEmail(email,errors);
        verifyString(password, password, 8, errors);

        errorsContainer = document.createElement('ul');
        errorsContainer.id = 'errorsList'
        errorsContainer.classList.add('errors-list')
        if(document.getElementById('errorsList'))
            document.getElementById('errorsList').remove()
        errors.forEach(error => {
            errorsContainer.innerHTML += `<li class="error-msg">${error.msg}</li>` 
        })
        formulario.insertAdjacentElement('beforebegin',errorsContainer);

        if(errors.length == 0){
            formulario.submit();
        }

    })
}