class Usuario
{
    constructor(usuario, password, Idpais)
    {
        this.usuario = usuario
        this.password = password
        this.Idpais = Idpais
    }
}

class UsuarioLoged
{
    constructor(usuario, password)
    {
        this.usuario = usuario
        this.password = password
    }
}

class Actividad
{
    constructor(idRegistro,idUsuario,tiempo,fecha)
    {
        this.idRegistro = idRegistro
        this.idUsuario = idUsuario
        this.tiempo = tiempo
        this.fecha = fecha
    }
}

const URLBASE = "https://movetrack.develotion.com/"

const menu = document.querySelector("#menu")
const router = document.querySelector("#ruteo")
const home = document.querySelector("#pantalla-home")
const login = document.querySelector("#pantalla-login")
const register = document.querySelector("#pantalla-register")
const registerActivity = document.querySelector("#pantalla-registerAct")
const listAct = document.querySelector("#pantalla-listAct")



inicio()
function inicio ()
{
    
    cargarPaises()
    router.addEventListener("ionRouteDidChange", navegar)
    document.querySelector("#btnRegistrar").addEventListener("click", previaRegistroUsuario)
    document.querySelector("#btnLogin").addEventListener("click", previaLogin)
    document.querySelector("#btnMenuLogout").addEventListener("click", logout)
    chekearSesion()
    document.querySelector("#btnRegistrarActividad").addEventListener("click", previaRegistroActividad)
}

function chekearSesion() {
    ocultarMenu();
    const apiKey = localStorage.getItem("apiKey");
    const idUsuario = localStorage.getItem("idUsuario");

    if (apiKey && idUsuario) {
        mostrarMenuLogeado();
        cargarActividades();
        previaListado(); // Cargar las actividades si la sesión está activa
    } else {
        mostrarMenuInicio();
    }
}

function cerrarMenu ()
{
  menu.close();
}



function navegar(evt)
{
    let destino = evt.detail.to
    ocultarPantallas()
    if(destino == "/") home.style.display = "block"
    if(destino == "/login") login.style.display = "block"
    if(destino == "/register") register.style.display = "block"
    if(destino == "/registrarEjercicio") registerActivity.style.display = "block"
    if(destino == "/listAct") listAct.style.display = "block"
}


function ocultarPantallas()
{   
    home.style.display = "none"
    login.style.display = "none"
    register.style.display = "none"
    registerActivity.style.display="none"
    listAct.style.display="none"
}





function previaRegistroUsuario()
{
    let usuario = document.querySelector("#txtRegistroUsuario").value
    let password = document.querySelector("#txtRegistroContraseña").value
    let idPais = document.querySelector("#slcPaises").value

    let nuevoUsuario = new Usuario(usuario, password, idPais)
    hacerRegistroUsuario(nuevoUsuario)

}


function hacerRegistroUsuario(nuevoUsuario)
{
    fetch (`${URLBASE}usuarios.php`,{
        method:'POST',
        headers:{
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoUsuario)
        })
        .then(function (response){
        return response.json()
        })
        .then(function(informacion){
            if(informacion.codigo == 200)
            {
                mostrarMensaje("SUCCESS", "Registro exitoso", "Puedes usar la App", 2500)
                ocultarPantallas()
                home.style.display = "block"
                localStorage.setItem("idUsuario",informacion.id)
                localStorage.setItem("apiKey", informacion.apiKey)
                ocultarMenu()
                mostrarMenuLogeado()  
                cargarActividades()
                previaListado()
            }
            else{
                mostrarMensaje("ERROR", informacion.mensaje, "Verifique los datos", 2500)
            }
          
        })
        .catch(function(error){
        console.log(error)
        })
}


function previaLogin()
{
    let usuario = document.querySelector("#txtUsuario").value
    let password = document.querySelector("#txtContraseña").value

    let nuevoUsuarioConectado = new Usuario(usuario, password)
    hacerLogin(nuevoUsuarioConectado)

}



function hacerLogin(nuevoUsuario)
{
    fetch (`${URLBASE}login.php`,{
        method:'POST',
        headers:{
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoUsuario)
        })
        .then(function (response){
        return response.json()
        })
        .then(function(informacion){
        if(informacion.codigo == 200)
            {
                mostrarMensaje("SUCCESS", "Login exitoso", "Puedes usar la App", 3000)
                ocultarPantallas()
                home.style.display = "block"
                localStorage.setItem("idUsuario",informacion.id)
                localStorage.setItem("apiKey", informacion.apiKey)
                ocultarMenu()
                mostrarMenuLogeado()  
                cargarActividades() 
                previaListado()
            }
            else
            {
                mostrarMensaje("ERROR", informacion.mensaje, "Verifique sus datos", 2500)
            }
 
        })
        .catch(function(error){
        console.log(error)
        })

       
}


function ocultarMenu()
{
    document.querySelector("#btnMenuLogin").style.display= "none"
    document.querySelector("#btnMenuRegistrar").style.display= "none"
    document.querySelector("#btnMenuLogout").style.display= "none"
    document.querySelector("#btnMenuRegistrarEjercicio").style.display= "none"
    document.querySelector("#btnListadoAct").style.display= "none"
}

function mostrarMenuInicio()
{
    document.querySelector("#btnMenuLogin").style.display= "block"
    document.querySelector("#btnMenuRegistrar").style.display= "block"
}



function mostrarMenuLogeado()
{
    document.querySelector("#btnMenuRegistrarEjercicio").style.display= "block"
    document.querySelector("#btnMenuLogout").style.display= "block"
    document.querySelector("#btnListadoAct").style.display = "block "
 
}


function logout()
{
    ocultarPantallas()
    home.style.display="block"
    ocultarMenu()
    mostrarMenuInicio()
    localStorage.removeItem("apiKey")
    localStorage.removeItem("idUsuario")
    mostrarMensaje("SUCCESS", "Se ha cerrado sesión","Que tenga un buen dia", 2000)
}

function mostrarMensaje(tipo, titulo, texto, duracion) {
    const toast = document.createElement('ion-toast');
    toast.header = titulo;
    toast.message = texto;
    if (!duracion) {
    duracion = 2000;
    }
    toast.duration = duracion;
    if (tipo === "ERROR") {
    toast.color = "danger";
    toast.icon = "alert-circle-outline";
    } else if (tipo === "WARNING") {
    toast.color = 'warning';
    toast.icon = "warning-outline";
    } else if (tipo === "SUCCESS") {
    toast.color = "success";
    toast.icon = "checkmark-circle-outline";
    }
    document.body.appendChild(toast);
    toast.present();
    }




    function cargarPaises()
    {
        obtenerPaises()
    }


    function obtenerPaises()
    {

        fetch (`${URLBASE}paises.php`)
            .then(function (response){
            return response.json()
            })
            .then(function(informacion){
               cargarSelectPaises(informacion.paises)
            })
            .catch(function(error){
            console.log(error)
            })
    
    }


    function cargarSelectPaises(listaPaises)
    {
        let miSelect = ""
        for(let unP of listaPaises)
            {
                miSelect+= `<ion-select-option value=${unP.id}>${unP.name}</ion-select-option>` 
              
            }
        document.querySelector("#slcPaises").innerHTML=miSelect
    }



  function cargarActividades()
  {
    obtenerActividades()
  }

  function obtenerActividades()
  {
    
  fetch (`https://movetrack.develotion.com/actividades.php`,{
    method:'GET',
    headers:{
    'Content-Type': 'application/json',
    'iduser': localStorage.getItem("idUsuario"),
    'apikey':localStorage.getItem("apiKey")
    },
    })
    .then(function (response){
    return response.json()
    })
    .then(function(informacion){
        cargarSelectActividades(informacion.actividades)
    })
    .catch(function(error){
    console.log(error)
    })

  }


  function cargarSelectActividades(listaActividades)
  {
    let otroSelect = ""
    for(let a of listaActividades)
    {
        otroSelect += `<ion-select-option value=${a.id}>${a.nombre}</ion-select-option>`
    }

    document.querySelector("#slcActividad").innerHTML = otroSelect
  }



function previaRegistroActividad()
{
    let actividad = document.querySelector("#slcActividad").value
    let usuario = localStorage.getItem("idUsuario")
    let tiempo = document.querySelector("#txtTiempo").value
    let fecha = document.querySelector("#txtFecha").value

    let unaActividad = new Actividad(actividad, usuario, tiempo, fecha)

    registrarActividad(unaActividad)
}   


function registrarActividad(unaActividad)
{
    fetch (`https://movetrack.develotion.com/registros.php`,{
        method:'POST',
        headers:{
        'Content-Type': 'application/json',
        'iduser': localStorage.getItem("idUsuario"),
        'apikey':localStorage.getItem("apiKey")
        },
        body: JSON.stringify(unaActividad)
        })
        .then(function (response){
        return response.json()
        })
        .then(function(informacion){
            if(informacion.codigo > 199 && informacion.codigo < 300)
            {
                mostrarMensaje("SUCCESS", "Se ha agregado con éxtio", "Puede continuar usando la app", 2500)
                previaListado()
                hacerListado()
                
                ocultarPantallas()
                listAct.style.display = "block";
            }
            else
            {
                mostrarMensaje("ERROR", "Error al agregar la actividad", informacion.mensaje, 2500)
            }
        })
        .catch(function(error){
        console.log(error)
        })
}



function previaListado()
{
    fetch (`${URLBASE}registros.php?idUsuario=${localStorage.getItem("idUsuario")}`,{
        method:"GET",
        headers:{
        'Content-Type': 'application/json',
        'apikey':localStorage.getItem("apiKey"),
        'iduser': localStorage.getItem("idUsuario")
        },
        })
        .then(function (response){
        return response.json()
        })
        .then(function(informacion){
            hacerListado(informacion.registros)    
        })
        .catch(function(error){
        console.log(error)
        })
}


function hacerListado(registros)
{
    let verActividades = ""

    for(let a of registros)
    {
        verActividades +=
            `<ion-item>
                <ion-label>
                    <h3>Id registro: ${a.id}</h3>
                    <h3>Id actividad: ${a.idActividad}</h3>
                    <h3>Id usuario: ${a.idUsuario}</h3>
                    <h3>Tiempo: ${a.tiempo}</h3>
                    <h3>Fecha: ${a.fecha}</h3>
                </ion-label>
                <ion-button id="idbtnn" onclick="eliminarActividad(${a.id})">Eliminar</ion-button>
            </ion-item>`
    }

    document.querySelector("#divLista").innerHTML = verActividades
}

document.querySelector("#btnRegistrarActividad").addEventListener("click", cerrar)
function cerrar()
{
    ocultarPantallas()
    listAct.style.display = "block"
}
document.querySelector("#btnMenuRegistrarEjercicio").addEventListener("click", redireccionar)
function redireccionar(){
    ocultarPantallas()
    registerActivity.style.display = "block"
}


function eliminarActividad(idRegistro) {
    fetch(`${URLBASE}registros.php?idRegistro=${idRegistro}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'apikey': localStorage.getItem("apiKey"),
            'iduser': localStorage.getItem("idUsuario")
        },
        body: ({ "idRegistro": idRegistro })
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (informacion) {
        if (informacion.codigo > 199 && informacion.codigo < 300) {
            mostrarMensaje("SUCCESS", "Actividad eliminada con éxito", "Puede seguir usando la app", 2000);
            previaListado() 
            hacerListado();  
            ocultarPantallas()

        } else {
            mostrarMensaje("ERROR", informacion.mensaje, "Intente de nuevo", 2000);
        }
    })
    .catch(function (error) {
        console.log(error);
    });
}
