window.onload = () => {
    let preview = document.querySelector('.img-preview');
    const file = document.getElementById("file");
    let deleteButton = document.getElementById("delete");
    
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
}