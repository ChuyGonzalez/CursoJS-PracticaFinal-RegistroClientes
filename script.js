console.log("Practica Final");
/** Variables Globales */
const _forms = document.getElementById("form");
const error = document.getElementById("error");

let arrayErrores = [];
let arrayClientes = [];
/** Nombre completo */
let nombreCliente = document.getElementById("txtNombre");
let aPaterno = document.getElementById("txtAPaterno");
let aMaterno = document.getElementById("txtAMaterno");
/** Generales */
let edad = document.getElementById("txtEdad");
let rfc = document.getElementById("txtRFC");
let correos = document.getElementById("txtCorreos");
let telefonos = document.getElementById("txtTelefonos");
/** Generales */
let calle = document.getElementById("txtCalle");
let numExterior = document.getElementById("txtNExterior");
let municipio = document.getElementById("txtMunicipio");
let estado = document.getElementById("txtEstado");
let cp = document.getElementById("txtCP");
/** Coordenadas */
let latitud = document.getElementById("txtLat");
let longitud = document.getElementById("txtLng");
/** Controles */
let btnRegistrar = document.getElementById("btnRegistrar");
let btnEliminar = document.getElementById("btnEliminar");

let map;
let marcadoresArray = [];
let markersArray = [];
let lat = 18.8690435;
let lng = -97.0984946;

let nombreCoordenada = "";
const colors = ["blue", "red", "black", "green", "orange"];
let colorIndex = 0;

/** Clase global para los valores de Latitud y Longitud. */
let myLatLng = { lat: lat, lng: lng };

/** Opciones iniciales del mapa. */
let mapOptions = {
  center: myLatLng,
  zoom: 8,
};

//#region Funciones
function submit(event) {
  console.log("entro submit");
  // For this example, don't actually submit the form
  event.preventDefault(false);
}

/** Registra Cliente. */
function registrar() {

  /** Obtener todos los controles del formulario a los que queremos aplicar 
   * estilos de validación personalizados de Bootstrap */
  var forms = document.querySelectorAll(".needs-validation");

  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity() || arrayErrores.length > 0) {
          event.preventDefault();
          event.stopPropagation();
          console.log("invalid");
          forms.onsubmit = submit;         
        } else {
          forms.onsubmit = submit(event);
        }
        form.classList.add("was-validated");
      },
      false
    );
  });

  document.getElementById("divErrores").innerHTML = "";
  document.getElementById("divTablaClientes").innerHTML = "";
  arrayErrores = [];

  /** Se ejecutan las validaciones. */
  validacionesNegocio();

  /** Se muestran errores */
  if (arrayErrores.length > 0) {
    mostrarErrores(arrayErrores);
  } else {
    /** Se limpian los errores */
    agregarMarcadores();
  }
}

/** Inicializá GoogleMaps. */
function iniciarMap() {
  map = new google.maps.Map(document.getElementById("map"), mapOptions);

  let marker = new google.maps.Marker({
    position: myLatLng,
    animation: google.maps.Animation.DROP,
    icon:
      "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
    title: "Universidad del Valle de Orizaba",
  });

  marker.setMap(map);

  let infowindow = new google.maps.InfoWindow();
  infowindow.setContent(
    "<strong>" +
      marker.title +
      "</strong><br /><strong> Coordenadas:</strong>" +
      marker.position
  );

  marker.addListener("click", () => {
    infowindow.open(map, marker);
  });
}

/** Agregar Marcador. */
function agregarMarcadores() {
  document.getElementById("divTablaClientes").innerHTML = "";
  let txtLat = document.getElementById("txtLat").value;
  let txtLng = document.getElementById("txtLng").value;
  let txtNombre = document
    .getElementById("txtNombre")
    .value.trim()
    .toUpperCase();
  let txtAPaterno = document
    .getElementById("txtAPaterno")
    .value.trim()
    .toUpperCase();
  let txtAMaterno = document
    .getElementById("txtAMaterno")
    .value.trim()
    .toUpperCase();

  lat = txtLat;
  lng = txtLng;
  nombreCompleto = txtNombre + " " + txtAPaterno + " " + txtAMaterno;
  direccion =
    calle.value +
    ", Nº " +
    numExterior.value +
    ", " +
    municipio.value +
    ", " +
    estado.value +
    ", " +
    cp.value;
  myLatLng = { lat: parseFloat(lat), lng: parseFloat(lng) };

  const svgMarker = {
    path:
      "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: colors[colorIndex++ % colors.length],
    fillOpacity: 1.0,
    strokeWeight: 0,
    rotation: 0,
    scale: 2,
    anchor: new google.maps.Point(15, 30),
  };

  let marker = new google.maps.Marker({
    position: myLatLng,
    animation: google.maps.Animation.DROP,
    icon: svgMarker,
    title: nombreCompleto,
    direccion: direccion,
  });

  marker.setMap(map);

  let infowindow = new google.maps.InfoWindow();
  infowindow.setContent(
    "<strong>" +
      marker.title +
      "</strong><br /><strong> Dirección: </strong>" +
      marker.direccion +
      "</strong><br /><strong> Coordenadas: </strong>" +
      marker.position
  );

  marker.addListener("click", () => {
    infowindow.open(map, marker);
  });

  /** Agregar Marcador */
  markersArray.push(marker);
  agregarMarcador();
  mostrarTablaResultados();
  //limpiarInputs();
}

/** Convertir string a número. */
function convertirNumero(numero) {
  return parseFloat(numero);
}

function esVacio(entrada) {
  return entrada === "" || entrada === null;
}

/** Función para validar un RFC */
function validarRFC(_rfc) {
  let rfc = _rfc.trim().toUpperCase();

  var re = /^(([ÑA-Z|ña-z|&]{3}|[A-Z|a-z]{4})\d{2}((0[1-9]|1[012])(0[1-9]|1\d|2[0-8])|(0[13456789]|1[012])(29|30)|(0[13578]|1[02])31)(\w{2})([A|a|0-9]{1}))$|^(([ÑA-Z|ña-z|&]{3}|[A-Z|a-z]{4})([02468][048]|[13579][26])0229)(\w{2})([A|a|0-9]{1})$/;
  validado = rfc.match(re);

  /** Validar con el formato general */
  if (!validado) {
    /** CURP NO Válido */
    return false;
  } else {
    /** CURP Válido */
    return true;
  }
}

/** Limpia tabla de resultados y elimina los marcadores del mapa. */
function limpiar() {
  markersArray.forEach((e) => {
    e.setMap(null);
  });
  markersArray = [];
  marcadoresArray = [];
  arrayClientes = [];
  arrayErrores = [];
  document.getElementById("divTablaClientes").innerHTML = "";
}

/** Arma el arreglo de marcadores. */
function agregarMarcador() {
  marcadoresArray.push({
    _nombre: nombreCliente.value + " " + aPaterno.value + " " + aMaterno.value,
    _direccion:
      calle.value +
      ", Nº " +
      numExterior.value +
      ", " +
      municipio.value +
      ", " +
      estado.value +
      ", " +
      cp.value,
    _lat: lat,
    _lng: lng,
  });
}

/** Muestra tabla de clientes registrados. */
function mostrarTablaResultados() {
  let resultado =
    "<table><thead> <tr> <th>Nombre</th> <th>Correo(s)</th> <th>Teléfono(s)</th> <th>Dirección</th> <th>Latitud</th> <th>Longitud</th> </tr> </thead>";
  resultado += "<tbody>";
  marcadoresArray.forEach((e) => {
    resultado += "<tr>";
    resultado +=
      "<td>" +
      nombreCliente.value +
      " " +
      aPaterno.value +
      " " +
      aMaterno.value +
      "</td>";
    resultado += "<td>" + correos.value + "</td>";
    resultado += "<td>" + telefonos.value + "</td>";
    resultado += "<td>" + e._direccion + "</td>";
    resultado += "<td>" + e._lat + "</td>";
    resultado += "<td>" + e._lng + "</td>";
    resultado += "</tr>";
  });
  resultado += "</tbody> </table>";
  document.getElementById("divTablaClientes").innerHTML =
    "<h2>Clientes Registrados</h2>" + resultado;
}

/** Limpia los inputs del formularios. */
function limpiarInputs() {
  document.getElementById("txtNombre").value = "";
  document.getElementById("txtAPaterno").value = "";
  document.getElementById("txtAMaterno").value = "";
  /** Generales */
  document.getElementById("txtEdad").value = "";
  document.getElementById("txtRFC").value = "";
  document.getElementById("txtCorreos").value = "";
  document.getElementById("txtTelefonos").value = "";
  /** Direccion */
  document.getElementById("txtCalle").value = "";
  document.getElementById("txtNExterior").value = "";
  document.getElementById("txtMunicipio").value = "";
  document.getElementById("txtEstado").value = "";
  document.getElementById("txtCP").value = "";
  /** Coordenadas */
  document.getElementById("txtLng").value = "";
  document.getElementById("txtLat").value = "";
}

/** Ejecuta las validaciones necesarias. */
function validacionesNegocio() {
  /** Se validan que los datos no sean vacíos */
  if (esVacio(nombreCliente.value)) {
    arrayErrores.push("- Nombre es obligatorio.");
  }

  if (esVacio(aPaterno.value)) {
    arrayErrores.push("- Apellido Paterno es obligatorio.");
  }

  if (esVacio(aMaterno.value)) {
    arrayErrores.push("- Apellido Materno es obligatorio.");
  }

  if (esVacio(edad.value)) {
    arrayErrores.push("- Edad es obligatorio.");
  } else {
    /** Validar que la edad sea mayor a 18 años */
    if (edad.value < 18 || edad.value > 100) {
      arrayErrores.push(
        "- Edad del cliente debe estar entre los 18 a 100 años."
      );
    }
  }

  if (esVacio(rfc.value)) {
    arrayErrores.push("- RFC es obligatorio.");
  } else {
    /** Se comprueba que la RFC sea válida. */
    if (!validarRFC(rfc.value)) {
      arrayErrores.push("- RFC del cliente debe ser correcto.");
    }
  }

  if (esVacio(correos.value)) {
    arrayErrores.push("- Correo electrónico es obligatorio.");
  }

  if (esVacio(calle.value)) {
    arrayErrores.push("- Calle es obligatorio.");
  }

  if (esVacio(numExterior.value)) {
    arrayErrores.push("- Número exterior es obligatorio.");
  }

  if (esVacio(municipio.value)) {
    arrayErrores.push("- Municipio es obligatorio.");
  }

  if (esVacio(estado.value)) {
    arrayErrores.push("- Estado es obligatorio.");
  }

  if (esVacio(cp.value)) {
    arrayErrores.push("- Código postal es obligatorio.");
  }

  if (esVacio(telefonos.value)) {
    arrayErrores.push("- Teléfono(s) es obligatorio.");
  }

  if (esVacio(longitud.value)) {
    arrayErrores.push("- Longitud es obligatorio.");
  }

  if (esVacio(latitud.value)) {
    arrayErrores.push("- Latitud es obligatorio.");
  }
}

/** Arma el output de errores para mostrarlos. */
function mostrarErrores(arrayErrores) {
  let out = "";
  for (let i = 0; i < arrayErrores.length; i++) {
    out += `<b>${arrayErrores[i]}</b><br>`;
    document.getElementById("divErrores").innerHTML =
      "<h2>Errores de validación:</h2> " + out;
  }
}

//#endregion
