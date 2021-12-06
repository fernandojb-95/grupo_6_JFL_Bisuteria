window.onload = () => {
    let preview = [...document.querySelectorAll('.img-preview')];
    const files = [...document.querySelectorAll(".image-file")];
    let deleteButton = [...document.querySelectorAll(".delete")];
    
    console.log(files, preview)
    files.forEach( (file, i) => {
        file.addEventListener('change', function(e) {
        // Creamos el objeto de la clase FileReader
        let reader = new FileReader();
        // Leemos el archivo subido y se lo pasamos a nuestro fileReader
        reader.readAsDataURL(e.target.files[0]);
        // Le decimos que cuando este listo ejecute el código interno
        reader.addEventListener('load', function(){
            let image = document.createElement('img');
            image.src = reader.result;
            image.id = `pre-image${i+1}`;
            deleteButton[i].style.display = 'block'
            preview[i].innerHTML = '';
            preview[i].append(image);
            preview[i].append(deleteButton[i])  
            }) 
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
}