window.onload = () => {
    let formulario = document.getElementById('login-form');
    let passwordEye = document.getElementById('passEye');
    let passwordInput = document.getElementById('login-password');

    const validateEmail = (email,errors) => {
        if(!String(email.value).match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
            {
                const errorMsg = {
                    msg: `Formato de email inválido`,
                    name: `${email.name}-error`
                }
                errors.push(errorMsg)
            }
      };

      const validatePassword = (password,errors) => {
        if(!String(password.value).match("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})")){
            const errorMsg = {
                msg: `Formato de contraseña inválido`,
                name: `${password.name}-error`
            }
            errors.push(errorMsg)
        }
      };

      passwordEye.addEventListener('click', () =>{
        if(passwordInput.type == 'password')
            passwordInput.type = 'text'
        else
        passwordInput.type = 'password'
    })

    formulario.addEventListener('submit', function (e){
        e.preventDefault();
        const email = e.target.email,
                password = e.target.password;

        const errors = [];
        
        let errorsContainer;

        validateEmail(email,errors);
        validatePassword(password,errors);

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