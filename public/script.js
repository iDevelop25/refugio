// ===== ELEMENTOS DEL DOM =====
const botonesEmocion = document.querySelectorAll(".emocion-btn");
const tarjetaSeccion = document.getElementById("tarjeta-seccion");
const tarjetaVersiculo = document.getElementById("tarjeta-versiculo");
const tarjetaTexto = document.getElementById("tarjeta-texto");
const tarjetaAliento = document.getElementById("tarjeta-aliento");
const btnOtroMensaje = document.getElementById("btn-otro-mensaje");
const formComentario = document.getElementById("form-comentario");
const listaComentarios = document.getElementById("lista-comentarios");

let emocionActual = null;

// ===== CARGAR COMENTARIOS AL INICIAR =====
document.addEventListener("DOMContentLoaded", cargarComentarios);

// ===== SELECCIONAR EMOCION =====
botonesEmocion.forEach(function (btn) {
  btn.addEventListener("click", function () {
    // Quitar clase activo de todos
    botonesEmocion.forEach(function (b) {
      b.classList.remove("activo");
    });

    // Activar el seleccionado
    btn.classList.add("activo");

    // Guardar emocion actual
    emocionActual = btn.getAttribute("data-emocion");

    // Pedir mensaje al backend
    obtenerMensaje(emocionActual);
  });
});

// ===== OBTENER MENSAJE DEL BACKEND =====
function obtenerMensaje(emocion) {
  fetch("/api/mensaje?emocion=" + emocion)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      // Llenar la tarjeta
      tarjetaVersiculo.textContent = data.versiculo;
      tarjetaTexto.textContent = '"' + data.texto + '"';
      tarjetaAliento.textContent = data.aliento;

      // Mostrar la tarjeta con animacion
      tarjetaSeccion.classList.remove("tarjeta-oculta");
      tarjetaSeccion.classList.add("tarjeta-visible");

      // Scroll suave hacia la tarjeta
      tarjetaSeccion.scrollIntoView({ behavior: "smooth", block: "center" });
    })
    .catch(function (error) {
      console.error("Error al obtener mensaje:", error);
    });
}

// ===== BOTON OTRO MENSAJE =====
btnOtroMensaje.addEventListener("click", function () {
  if (emocionActual) {
    obtenerMensaje(emocionActual);
  }
});

// ===== ENVIAR COMENTARIO =====
formComentario.addEventListener("submit", function (e) {
  e.preventDefault();

  var nombre = document.getElementById("nombre").value.trim();
  var mensaje = document.getElementById("mensaje").value.trim();

  if (!nombre || !mensaje) {
    alert("Por favor completa todos los campos");
    return;
  }

  fetch("/api/comentarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre: nombre, mensaje: mensaje })
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      // Limpiar formulario
      formComentario.reset();

      // Recargar comentarios
      cargarComentarios();

      // Scroll al listado
      listaComentarios.scrollIntoView({ behavior: "smooth" });
    })
    .catch(function (error) {
      console.error("Error al enviar comentario:", error);
    });
});

// ===== CARGAR COMENTARIOS DESDE EL BACKEND =====
function cargarComentarios() {
  fetch("/api/comentarios")
    .then(function (res) {
      return res.json();
    })
    .then(function (comentarios) {
      if (comentarios.length === 0) {
        listaComentarios.innerHTML =
          '<p class="sin-comentarios">Aun no hay testimonios. Se el primero en compartir!</p>';
        return;
      }

      var html = "";
      comentarios.forEach(function (c) {
        html +=
          '<div class="comentario">' +
          '  <div class="comentario-header">' +
          '    <span class="comentario-nombre">' + escapeHTML(c.nombre) + "</span>" +
          '    <span class="comentario-fecha">' + c.fecha + "</span>" +
          "  </div>" +
          '  <p class="comentario-mensaje">' + escapeHTML(c.mensaje) + "</p>" +
          "</div>";
      });

      listaComentarios.innerHTML = html;
    })
    .catch(function (error) {
      console.error("Error al cargar comentarios:", error);
    });
}

// ===== FUNCION PARA EVITAR XSS =====
function escapeHTML(str) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
