let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let eliminados = JSON.parse(localStorage.getItem("eliminados")) || [];
let editIndex = null;

// ID
function generarID(rol) {
  let letra = rol === "Administrador" ? "A" : "U";
  let lista = usuarios.filter(u => u.rol === rol);
  let numero = lista.length + 1;
  return letra + numero.toString().padStart(3, "0");
}

// VALIDACIÓN
function validarFormulario(nombre, edad, rol) {
  if (!nombre || !edad || !rol) return false;
  if (!/^[a-zA-Z\s]+$/.test(nombre)) return false;
  if (edad < 20) return false;
  return true;
}

// GUARDAR
function guardarUsuario() {
  let nombre = document.getElementById("nombre").value;
  let edad = parseInt(document.getElementById("edad").value);
  let rol = document.getElementById("rol").value;

  if (!validarFormulario(nombre, edad, rol)) return;

  if (editIndex !== null) {
    usuarios[editIndex].nombre = nombre;
    usuarios[editIndex].edad = edad;
    usuarios[editIndex].rol = rol;
    editIndex = null;
  } else {
    usuarios.push({
      id: generarID(rol),
      nombre,
      edad,
      rol,
      activo: true
    });
  }

  guardarDatos();
  limpiarFormulario();
  mostrarUsuarios();
}

// MOSTRAR
function mostrarUsuarios(lista = usuarios) {
  let contenedor = document.getElementById("listaUsuarios");
  contenedor.innerHTML = "";

  lista.forEach((u, i) => {
    let fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${u.id}</td>
      <td>${u.nombre}</td>
      <td>${u.edad}</td>
      <td><span class="badge ${u.rol === 'Administrador' ? 'bg-primary' : 'bg-secondary'}">${u.rol}</span></td>
      <td><span class="badge ${u.activo ? 'bg-success' : 'bg-danger'}">${u.activo ? "Activo" : "Inactivo"}</span></td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="cambiarEstado(${i})">🔄</button>
        <button class="btn btn-info btn-sm" onclick="editarUsuario(${i})">✏️</button>
        <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${i})">🗑</button>
      </td>
      <td>-</td>
    `;

    contenedor.appendChild(fila);
  });

  contarUsuarios();
}

// ELIMINAR
function eliminarUsuario(index) {
  let u = usuarios[index];
  u.fechaEliminacion = new Date().toLocaleString();
  eliminados.push(u);

  usuarios.splice(index, 1);

  guardarDatos();
  localStorage.setItem("eliminados", JSON.stringify(eliminados));

  mostrarUsuarios();
}

// ELIMINADOS
function mostrarEliminados() {
  let contenedor = document.getElementById("listaUsuarios");
  contenedor.innerHTML = "";

  eliminados.forEach(u => {
    let fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${u.id}</td>
      <td>${u.nombre}</td>
      <td>${u.edad}</td>
      <td>${u.rol}</td>
      <td><span class="badge bg-danger">Eliminado</span></td>
      <td>-</td>
      <td>${u.fechaEliminacion}</td>
    `;

    contenedor.appendChild(fila);
  });
}

// RESTO
function cambiarEstado(i) {
  usuarios[i].activo = !usuarios[i].activo;
  guardarDatos();
  mostrarUsuarios();
}

function editarUsuario(i) {
  let u = usuarios[i];
  nombre.value = u.nombre;
  edad.value = u.edad;
  rol.value = u.rol;
  editIndex = i;
}

function buscarUsuario(txt) {
  mostrarUsuarios(usuarios.filter(u =>
    u.nombre.toLowerCase().includes(txt.toLowerCase())
  ));
}

function filtrarUsuarios(tipo) {
  if (tipo === "todos") return mostrarUsuarios();
  mostrarUsuarios(usuarios.filter(u => u.rol === tipo));
}

function ordenarPorEdad() {
  usuarios.sort((a, b) => a.edad - b.edad);
  mostrarUsuarios();
}

function contarUsuarios() {
  let activos = usuarios.filter(u => u.activo).length;
  let inactivos = usuarios.length - activos;

  document.getElementById("activos").innerText = activos;
  document.getElementById("inactivos").innerText = inactivos;
}

function guardarDatos() {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function limpiarFormulario() {
  nombre.value = "";
  edad.value = "";
  rol.value = "";
}

// FECHA Y HORA
function actualizarFechaHora() {
  let ahora = new Date();
  let fecha = ahora.toLocaleDateString();
  let hora = ahora.toLocaleTimeString();
  document.getElementById("fechaHora").innerText = `${fecha} - ${hora}`;
}

setInterval(actualizarFechaHora, 1000);
actualizarFechaHora();

// INICIO
mostrarUsuarios();