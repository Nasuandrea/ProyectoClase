// generar funcion para enviar mail de contacto
// los datos del mail se recogen en la base de datos
// comprobar que este todo correcto y que se envie el mail
// asociado a la base de datos para que se envie el mail al usuario correcto

// corregir ruta del enpoint para obtener datos del usuario
const urlEndPoint = "obtener_info.php";

async function contactar(userId) {
  const catchForm = document.querySelector("modal-contacto");
  const emailDestinatario = document.querySelector("email-destinatario");
  const nombreDestinatario = document.querySelector("nombre-destinatario");
  // const emailRemitente = document.querySelector('email-remitente');

  if (!catchForm || !nombreDestinatario.value) {
    console.error("Formulario o campos no encontrados");
    return;
  }
  try {
    //limpiar fomularios previos
    limpiarFormularioContacto();

    //obtener datos del usuario desde endpoint
    const response = await fetch(`${urlEndPoint}?id=${userId}`);

    // error de respuesta
    if (!response.ok) {
      throw new Error("Error al obtener datos del usuario");
    }
    const resultado = await response.json();

    //comprobar que se han obtenido los datos correctamente
    if (!resultado.success) {
      throw new Error(resultado.error || "Error al obtener datos del usuario");
      return;
    }
    const usuario = resultado.data;
    // configurar email y nombre de destinatario
    emailDestinatario.value = usuario.email;

    if (nombreDestinatario) {
      nombreDestinatario.textContent = usuario.nombre;
    }
  } catch (error) {
    console.error("Error en la función contactar:", error);

    if (nombreDestinatario) {
      nombreDestinatario.textContent = "Error al cargar datos del usuario";
    }
  }
}

function limpiarFormularioContacto() {
    const form = document.querySelector('#form-contacto');
    const mensajeRespuesta = document.querySelector('#mensaje-respuesta');
    
}
