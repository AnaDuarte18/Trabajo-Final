// Clase Comentario
class Comentario {
    constructor(usuario, comentario) {
        this.usuario = usuario;
        this.comentario = comentario;
    }

    getUsuario() {
        return this.usuario;
    }

    getComentario() {
        return this.comentario;
    }
}

// Clase Libro
class Libro {
    constructor(nombre, autor, capitulos, texto, kudos = 0) {
        this.nombre = nombre;
        this.autor = autor;
        this.capitulos = capitulos;
        this.texto = texto;
        this.kudos = kudos;
        this.comentarios = [];  // Aquí guardamos las instancias de Comentario
    }

    getNombre() {
        return this.nombre;
    }

    getAutor() {
        return this.autor;
    }

    getKudos() {
        return this.kudos;
    }

    getCapitulos() {
        return this.capitulos;
    }

    getTexto() {
        return this.texto;
    }

    getComentarios() {
        return this.comentarios;
    }

    agregarComentario(usuario, comentario) {
        if (comentario.length > 0 && comentario.length <= 200) {
            const nuevoComentario = new Comentario(usuario, comentario);
            this.comentarios.push(nuevoComentario);
        } else {
            console.error("El comentario debe tener entre 1 y 200 caracteres.");
        }
    }

    darKudos() {
        this.kudos++;
    }
}

// Clase Biblioteca
class Biblioteca {
    constructor() {
        this.listaLibro = [];
    }

    getTodo() {
        return this.listaLibro;
    }

    crearLibro(nuevoLibro) {
        this.listaLibro.push(nuevoLibro);
    }
}

var biblioteca = new Biblioteca();

// Función para mostrar la información de todos los libros
function mostrarInfo() {
    var lista = biblioteca.getTodo();
    var contenedor = document.getElementById("contenedor");
    contenedor.innerHTML = ""; // Limpiar el contenedor antes de agregar los libros

    if (lista.length > 0) {
        lista.forEach(function(Libro, index) {
            var tarjeta = document.createElement("div");
            tarjeta.classList.add("tarjeta");

            // Información básica del libro
            var nombre = document.createElement("h3");
            nombre.innerHTML = Libro.getNombre();

            var autor = document.createElement("p");
            autor.innerHTML = "Autor: " + Libro.getAutor();

            var capitulos = document.createElement("p");
            capitulos.innerHTML = "Capítulos: " + Libro.getCapitulos();

            var kudos = document.createElement("p");
            kudos.innerHTML = "Kudos: " + Libro.getKudos();

            // Información adicional (inicialmente oculta)
            var infoAdicional = document.createElement("div");
            infoAdicional.classList.add("info-adicional");
            infoAdicional.style.display = "none";

            var textoCompleto = document.createElement("p");
            textoCompleto.innerHTML = "Texto completo: " + Libro.getTexto();
            infoAdicional.appendChild(textoCompleto);

            // Botón para mostrar/ocultar información adicional
            var botonAmpliar = document.createElement("button");
            botonAmpliar.innerHTML = "Ampliar información";
            botonAmpliar.onclick = function() {
                var tarjetas = document.querySelectorAll(".tarjeta");
                tarjetas.forEach(function(tarjeta) {
                    tarjeta.style.display = "none";
                });

                if (infoAdicional.style.display === "none") {
                    infoAdicional.style.display = "block";
                    botonAmpliar.innerHTML = "Ocultar información";
                } else {
                    infoAdicional.style.display = "none";
                    botonAmpliar.innerHTML = "Ampliar información";
                }

                tarjeta.style.display = "block";
            };

            // Contenedor para los comentarios
            var comentarios = document.createElement("div");
            comentarios.classList.add("comentarios");
            comentarios.style.display = "none";

            // Mostrar los comentarios
            function actualizarComentarios() {
                comentarios.innerHTML = "Comentarios:<br>";
                Libro.getComentarios().forEach(function(comentario) {
                    comentarios.innerHTML += `${comentario.getUsuario()}: ${comentario.getComentario()}<br>`;
                });
            }

            // Botón para ver/ocultar comentarios
            var botonComentarios = document.createElement("button");
            botonComentarios.innerHTML = "Ver Comentarios";
            botonComentarios.onclick = function() {
                if (comentarios.style.display === "none") {
                    comentarios.style.display = "block";
                    botonComentarios.innerHTML = "Ocultar Comentarios";
                    comentariosFormulario.style.display = "block";
                    actualizarComentarios();
                } else {
                    comentarios.style.display = "none";
                    botonComentarios.innerHTML = "Ver Comentarios";
                    comentariosFormulario.style.display = "none";
                }
            };

            // Formulario para agregar un nuevo comentario
            var comentariosFormulario = document.createElement("div");
            comentariosFormulario.style.display = "none";
            comentariosFormulario.innerHTML = `
                <label for="usuario">Nombre de usuario:</label>
                <input type="text" id="usuario" placeholder="Tu nombre" required>
                <br>
                <label for="comentario">Comentario:</label>
                <textarea id="comentario" placeholder="Escribe tu comentario aquí" required></textarea>
                <br>
                <button id="agregarComentario">Agregar Comentario</button>
            `;

            var agregarComentarioBtn = comentariosFormulario.querySelector("#agregarComentario");
            agregarComentarioBtn.onclick = function() {
                var usuario = document.getElementById("usuario").value;
                var comentario = document.getElementById("comentario").value;
                if (usuario && comentario) {
                    // Agregar el comentario
                    Libro.agregarComentario(usuario, comentario);

                    // Actualizar la vista de comentarios
                    actualizarComentarios();
                } else {
                    alert("Por favor, ingresa un nombre de usuario y un comentario.");
                }
            };

            // Añadir el formulario de comentarios debajo del botón
            tarjeta.appendChild(comentariosFormulario);
            tarjeta.appendChild(botonComentarios);
            tarjeta.appendChild(comentarios);
            
            // Añadir los elementos a la tarjeta
            tarjeta.appendChild(nombre);
            tarjeta.appendChild(autor);
            tarjeta.appendChild(capitulos);
            tarjeta.appendChild(kudos);
            tarjeta.appendChild(infoAdicional);
            tarjeta.appendChild(botonAmpliar);

            // Añadir la tarjeta al contenedor
            contenedor.appendChild(tarjeta);
        });
    } else {
        alert("No hay libros");
    }
}

function mostrarLibro() {
    document.getElementById("formulario").style.display = "block";
}

function IngresarLibro() {
    var nuevoLibro = new Libro(
        document.getElementById("nombre").value,
        document.getElementById("autor").value,
        document.getElementById("capitulos").value,
        document.getElementById("texto").value
    );
    biblioteca.crearLibro(nuevoLibro);

    document.getElementById("formulario").style.display = "none";
    mostrarInfo();
}
