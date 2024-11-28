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

class Libro {
    constructor(nombre, autor, capitulos, texto, kudos = 0) {
        this.nombre = nombre;
        this.autor = autor;
        this.capitulos = capitulos;
        this.texto = texto;
        this.kudos = kudos;
        this.kudosDado = false;
        this.comentarios = [];
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
        if (!this.kudosDado) { 
            this.kudos++;
            this.kudosDado = true;
        }
    }

    toJSON() {
        return {
            nombre: this.nombre,
            autor: this.autor,
            capitulos: this.capitulos,
            texto: this.texto,
            kudos: this.kudos,
            comentarios: this.comentarios,
            kudosDado: this.kudosDado,
        };
    }

    static fromJSON(data) {
        const libro = new Libro(data.nombre, data.autor, data.capitulos, data.texto, data.kudos);
        libro.kudosDado = data.kudosDado;
        libro.comentarios = data.comentarios.map(comentario => new Comentario(comentario.usuario, comentario.comentario));
        return libro;
    }
}

class Biblioteca {
    constructor() {
        this.listaLibro = this.cargarLibros(); 
    }

    cargarLibros() {
        const librosData = localStorage.getItem('libros');
        if (librosData) {
            const libros = JSON.parse(librosData);
            return libros.map(libroData => Libro.fromJSON(libroData));
        }
        return [];
    }

    guardarLibros() {
        const librosData = JSON.stringify(this.listaLibro.map(Libro => Libro.toJSON()));
        localStorage.setItem('libros', librosData);
    }

    getTodo() {
        return this.listaLibro;
    }

    crearLibro(nuevoLibro) {
        this.listaLibro.push(nuevoLibro);
        this.guardarLibros(); 
    }

    borrarLibros() {
        this.listaLibro = [];
        localStorage.removeItem('libros');
    }
}

var biblioteca = new Biblioteca();

function mostrarInfo() {
    var lista = biblioteca.getTodo();
    var contenedor = document.getElementById("contenedor");
    contenedor.innerHTML = "";

    if (lista.length > 0) {
        lista.forEach(function(Libro, index) {
            var tarjeta = document.createElement("div");
            tarjeta.classList.add("tarjeta");

            var nombre = document.createElement("h3");
            nombre.innerHTML = Libro.getNombre();

            var autor = document.createElement("p");
            autor.innerHTML = "Autor: " + Libro.getAutor();

            var capitulos = document.createElement("p");
            capitulos.innerHTML = "Capítulos: " + Libro.getCapitulos();

            var kudos = document.createElement("p");
            kudos.innerHTML = "Kudos: " + Libro.getKudos();

            var infoAdicional = document.createElement("div");
            infoAdicional.classList.add("info-adicional");
            infoAdicional.style.display = "none";

            var textoCompleto = document.createElement("p");
            textoCompleto.innerHTML = "Texto completo: " + Libro.getTexto();
            infoAdicional.appendChild(textoCompleto);

            var botonAmpliar = document.createElement("button");
            botonAmpliar.innerHTML = "Ampliar información";
            botonAmpliar.onclick = function() {
                if (infoAdicional.style.display === "none") {
                    var tarjetas = document.querySelectorAll(".tarjeta");
                    tarjetas.forEach(function(tarjeta) {
                        tarjeta.style.display = "none";
                    });
                    tarjeta.style.display = "block";
                    infoAdicional.style.display = "block";
                    botonAmpliar.innerHTML = "Ocultar información";
                } else {
                    infoAdicional.style.display = "none";
                    botonAmpliar.innerHTML = "Ampliar información";
                }
            };

            var botonKudos = document.createElement("button");
            botonKudos.innerHTML = "Kudos <3";
            botonKudos.onclick = function() {
                if (!Libro.kudosDado) {
                    Libro.darKudos();
                    kudos.innerHTML = "Kudos: " + Libro.getKudos();
                    biblioteca.guardarLibros();
                } else {
                    alert("Ya dejaste kudos!!");
                }
            };
            infoAdicional.appendChild(botonKudos);

            var comentarios = document.createElement("div");
            comentarios.classList.add("comentarios");
            comentarios.style.display = "none";
            function actualizarComentarios() {
                comentarios.innerHTML = "Comentarios:<br>";
                Libro.getComentarios().forEach(function(comentario) {
                    comentarios.innerHTML += `${comentario.getUsuario()}: ${comentario.getComentario()}<br>`;
                });
            }

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

            var comentariosFormulario = document.createElement("div");
            comentariosFormulario.style.display = "none";
            comentariosFormulario.innerHTML = `
                <label for="usuario">Nombre de usuario:</label>
                <input type="text" id="usuario-${index}" placeholder="Tu nombre" required>
                <br>
                <label for="comentario">Comentario:</label>
                <textarea id="comentario-${index}" placeholder="Escribe tu comentario aquí" required></textarea>
                <br>
                <button id="agregarComentario-${index}">Agregar Comentario</button>
            `;

            var agregarComentarioBtn = comentariosFormulario.querySelector(`#agregarComentario-${index}`);
            agregarComentarioBtn.onclick = function() {
                var usuario = document.getElementById(`usuario-${index}`).value;
                var comentario = document.getElementById(`comentario-${index}`).value;
                if (usuario && comentario) {
                    Libro.agregarComentario(usuario, comentario);
                    actualizarComentarios();
                    biblioteca.guardarLibros();
                } else {
                    alert("Por favor, ingresa un nombre de usuario y un comentario.");
                }
            };

            tarjeta.appendChild(nombre);
            tarjeta.appendChild(autor);
            tarjeta.appendChild(capitulos);
            tarjeta.appendChild(kudos);
            tarjeta.appendChild(infoAdicional);
            tarjeta.appendChild(comentarios);
            tarjeta.appendChild(comentariosFormulario);
            tarjeta.appendChild(botonComentarios);
            tarjeta.appendChild(botonAmpliar);

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

function borrar() {
        if (confirm("Estás seguro de que deseas limpiar todos los libros?")) {
            biblioteca.limpiarLibros();
}}