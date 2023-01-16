//================ Variables ===============

const carrito = document.querySelectorAll("div.carrito")[0];
const cliente = document.querySelectorAll("div.cliente")[0];
const mercado = document.querySelectorAll("div.mercado")[0];
const total = document.querySelectorAll("#total")[0];
const total2 = document.querySelectorAll("#total")[1];
const pagar = document.getElementById("pagar");
const notificacion = document.querySelectorAll(".notificacion")[0];
const recivo = document.getElementById("recivo");

//=============== EventListeners ===============

cargarEventListeners();

function cargarEventListeners(e) {


    mercado.addEventListener("click", articuloTomado);
    cliente.addEventListener("click", sacarDeCarrito);
    pagar.addEventListener("click", function () {
        let articulosDeCliente = obtenerProductoLocalStorage();
        if (articulosDeCliente.length == 0 ) {
            alert("Seleccione productos para comprar.");
        }else {
            varciarLocalStorage();
            alert("Gracias por su compra!!");
            location.reload();
        }
    });


    carrito.addEventListener("DOMSubtreeModified", calcularTotal, true);
}

//================= Funciones ==============



function articuloTomado(e) {
    e.preventDefault();   

    let articulo;
    if ( e.target.classList.contains("llevar-articulo") ) {


        articulo = e.target.parentElement.parentElement;
        leerDatosDeArticulo(articulo);
    }
}


function leerDatosDeArticulo(articulo) {


    const infoArticulo = {
        articulo: articulo.querySelector("p").textContent,
        precio: articulo.querySelector("span").textContent,
        id: articulo.querySelector("a").getAttribute("data-id"),
        cantidad: 1
    };
    
    ponerEnCarrito(infoArticulo);
}



function ponerEnCarrito(producto) {


    let template = `
        <p class="font-weight-bold m-1" data-id="${producto.id}">
            <i class="quitar fas fa-minus-circle text-danger"></i> ${producto.articulo} <span class="precio text-info">${producto.precio}</span>
            <i class="fas fa-tag"></i>
        </p>
    `;



    notificar("success");
    guardarProductoLocalStorage(producto);
    carrito.innerHTML += template;
}



function sacarDeCarrito(e) {
    e.preventDefault();

    let producto, productoId;
 


    if (e.target.classList.contains("quitar")) {


        producto = e.target.parentElement;
        productoId = producto.getAttribute("data-id");
        borrarProductoLocalStorage(productoId);


        producto.remove();
        notificar("deleted");
    }
    
    if( e.target.classList.contains("vaciar-carrito") ) {

 
        carrito.innerHTML = "";
        varciarLocalStorage();
        notificar("deleted");
        total.textContent = "0.00$";
    }

    if (e.target.classList.contains("comprar-productos")) {


        crearFactura();
    }
}



function notificar(tipo) {


    notificacion.classList.add(tipo);
    setTimeout(() => {
        notificacion.classList.remove(tipo);
    }, 800);
}



function  guardarProductoLocalStorage(producto){


    let productosLS = obtenerProductoLocalStorage();


    producto.precio = Number( producto.precio.substring(0, producto.precio.length - 1) ); 

    productosLS.forEach(function (productoLS, index) {


        if (productoLS.articulo == producto.articulo) {


            producto.precio = productoLS.precio + producto.precio;
            producto.cantidad = productoLS.cantidad + 1;

    
            productosLS.splice(index, 1);
        }
    })
    


    productosLS.push(producto);    
    localStorage.setItem("productos", JSON.stringify(productosLS));
}


function obtenerProductoLocalStorage() {
    let productos;
    if (localStorage.getItem("productos") === null) {
 

        productos = [];
    }else {


        productos = JSON.parse( localStorage.getItem("productos") );
    }



    return productos;
}



imprimirProductorLocalStorage();

function imprimirProductorLocalStorage() {
    articulos = obtenerProductoLocalStorage();

    articulos.forEach(articulo => {
        if (articulo.cantidad !== 1) {


            for (let i = 0; i < articulo.cantidad; i++) {
                let template = `
                <p class="font-weight-bold m-1" data-id="${articulo.id}">
                <i class="quitar fas fa-minus-circle text-danger"></i> ${articulo.articulo} <span class="precio text-info">${parseFloat(articulo.precio/articulo.cantidad).toFixed(2)}$</span>
                <i class="fas fa-tag"></i>
                </p>
                `;
                
                carrito.innerHTML += template;             
            }
        }else {

            let template = `
            <p class="font-weight-bold m-1" data-id="${articulo.id}">
            <i class="quitar fas fa-minus-circle text-danger"></i> ${articulo.articulo} <span class="precio text-info">${articulo.precio}$</span>
            <i class="fas fa-tag"></i>
            </p>
            `;
            
            carrito.innerHTML += template;
        }
    });
}


function crearFactura() {


    recivo.innerHTML = "";
    let articulos = obtenerProductoLocalStorage();
    calcularTotal(1);

    articulos.forEach(function (articulo) {
       let template = `
        <div class="font-weight-bold m-1">
            <p class="m-0">                
                (${articulo.cantidad}) ${articulo.articulo} <span class="precio text-info">${parseFloat(articulo.precio).toFixed(2)}$</span>
                <i class="fas fa-tag"></i>
            </p>
            <span class="font-weight-light">($ por unidad: ${parseFloat(articulo.precio/articulo.cantidad).toFixed(2)})</span>
        </div>
        `;
        recivo.innerHTML += template;
    });
}



function borrarProductoLocalStorage(producto) {
    let productosLS = obtenerProductoLocalStorage();


    productosLS.forEach(function(productoLS, index) {
        if (productoLS.id == producto ) {
            if (productoLS.cantidad !== 1) {


                productoLS.precio = productoLS.precio - (productoLS.precio/productoLS.cantidad);
                productoLS.cantidad = productoLS.cantidad - 1;
            }else {

      
                productosLS.splice(index, 1);
            }
        }
    });



    localStorage.setItem("productos", JSON.stringify(productosLS));
}



function varciarLocalStorage() {
    localStorage.clear();
}



function calcularTotal(pagar) {
    let precioTotal = 0;
    productos = obtenerProductoLocalStorage();



    productos.forEach(function (producto) {
        precio = Number( producto.precio );
        precioTotal = precioTotal + precio;
    });


    if (pagar === 1) {
        total2.textContent = precioTotal.toFixed(2) + "$";
    } else{
        total.textContent = precioTotal.toFixed(2) + "$";
    }
}