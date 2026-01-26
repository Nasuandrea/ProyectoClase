const boton = document.getElementById("boton");

    boton.addEventListener("click", ()=>{
        evento1(),
        evento2();
    });

    function evento1(){
        const mostrar = document.querySelector(".con");
        if (mostrar.style.display === "flex"){
            mostrar.style.display = "none";
        } else {
            mostrar.style.display = "flex";
        }
    }

    function evento2(){
        const avatar = document.querySelector(".avatar-container");
        if (avatar.style.display === "none"){
            avatar.style.display = "block";
        } else {
            avatar.style.display = "none";
        }

    }

 const botonCerrar = document.querySelector("#botonCerrar");
 botonCerrar.addEventListener("click", ()=>{
    cerrarModal();
 });
   
    function cerrarModal(){
        const cerrar = document.querySelector(".con");
        const abrir = document.querySelector(".avatar-container");

        if (cerrar.style.display ==="flex"){
            cerrar.style.display = "none";
            abrir.style.display = "block";
            console.log("funciona");
        } else {
            
            cerrar.style.display === "flex";{
                abrir.style.display = "none";
                console.log("no funciona");
            }
        }
    }


document.addEventListener('DOMContentLoaded', function() {
        const contenedores = document.querySelectorAll('.contenedor1');
        contenedores.forEach((elemento, index) => {
            elemento.style.animationDelay = `${(index + 1) * 0.3}s`;
        });
    });