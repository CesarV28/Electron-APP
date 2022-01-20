const { ipcRenderer } = require('electron');

const addUserForm = document.querySelector('#addUserForm');
const inputNombre = document.querySelector('#nombre');
const inputCorreo = document.querySelector('#correo');
const inputTestimonial = document.querySelector('#testimonial');
const testimonialesContainer = document.querySelector('.testimoniales-container');
const testimonialesList = document.querySelector('.testimoniales-list');
const inputBuscar = document.querySelector('.input-buscar');
const btnBuscar = document.querySelector('.btn-buscar');
const buttonSave = document.querySelector('.save');


const cargarEvents = () => {
    // Mustra los testimoniales cunado este cargada la pagina
    document.addEventListener('DOMContentLoaded', () => {
        testimonialesRender();
   });
}

cargarEvents();
// captura el objeto que se ha creado en la base de datos en forma de 
// string
ipcRenderer.on('testimonial:created', (e, args) => {
    const testimonial = JSON.parse(args)
});


// enviamos el evento para consultar los testimoniales desde la ventana
// al proceso de electron
ipcRenderer.send('testimonial:get');

// recivimos el evento de obtener los testimoniales de la base de datos

const testimonialesRender = () => {
    ipcRenderer.on('testimonial:get', (e, args) => {
        const testimoniales = JSON.parse(args);
        getTestimoniales(testimoniales);
    });
};

const limpiarInput = () => {
    inputNombre.value = '';
    inputCorreo.value = '';
    inputTestimonial.value = '';
}

addUserForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newTestimonial = {
        nombre: inputNombre.value,
        correo: inputCorreo.value,
        mensaje: inputTestimonial.value
    }

    // Enviamos la informacion
    ipcRenderer.send('testimonial:add', newTestimonial);

    limpiarInput();
});


// Input para buscar un testimonial por el nombre de quien lo escribio
btnBuscar.addEventListener('click', () => {
    const query = inputBuscar.value;
    ipcRenderer.send('nombre:find', query);
    limpiarHTML();
    ipcRenderer.on('nombre:find', (e, args) => {
        const query = JSON.parse(args);
        getTestimoniales(query);
    });

    inputBuscar.value = '';
});

const getTestimoniales = ( testimoniales = [] ) => {
    
    testimonialesList.innerHTM = '';

    testimoniales.map( ( {id, nombre, correo, mensaje } ) => {
        testimonialesList.innerHTML += `
            <div id="ID_${id}" class="info-tes-container" onclick="editTest('${id}')">
                <li><h4>Nombre: ${nombre}</h4></li>
                <li>Correo: ${correo}</li>
                <li class="testimonial-mensaje mb-4">Mensaje: <span>${mensaje}</span></li>
            </div>
       `;
    });

};

const limpiarHTML = () => {
    while(testimonialesList.firstChild){
        testimonialesList.removeChild(testimonialesList.firstChild);
    }
}

const editTest = (id) => {

    buttonSave.classList.add('hidden');
    crearBoton('edit', id);
 
    ipcRenderer.send('test:find', id);

    ipcRenderer.on('test:find', (e, args) => {

        const {nombre, correo, mensaje} = JSON.parse(args);
        inputNombre.value = nombre;
        inputCorreo.value = correo;
        inputTestimonial.value = mensaje;

    });

}

const crearBoton = (type, id) => {

    const btnExist = document.querySelector(`#btn${type}`);

    if(btnExist){
        btnExist.remove();
    }

    const btn = document.createElement('button');
    btn.onclick = () => editarTestimonial(id); // añade la opción 
    btn.classList.add('btn', 'btn-info', 'mr-2');
    btn.id = `btn${type}`;
    btn.innerHTML = `${type}`;
    addUserForm.appendChild(btn);

}

const editarTestimonial = (id) => {

    console.log(id);
    const newTestimonial = {
        id,
        nombre: inputNombre.value,
        correo: inputCorreo.value,
        mensaje: inputTestimonial.value
    }
    ipcRenderer.send('test:edit', newTestimonial);
    const btnExist = document.querySelector(`#btnedit`);
    btnExist.remove();
    limpiarInput();
    buttonSave.classList.remove('hidden');
    
}

ipcRenderer.on('test:edit-success', (e, args) => {
    console.log(args);
});


