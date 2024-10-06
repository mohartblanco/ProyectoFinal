
// Agregar producto al carrito
function addToCart(productId, data) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const product = data.find(item => item.codigo === productId);
    const existingProduct = cart.find(item => item.codigo === productId);

    if (existingProduct) {
        Swal.fire({
            icon: 'info',
            title: 'Ya está en el carrito',
            showConfirmButton: false,
            timer: 1000
            
        });
    } else {
        cart.push({ ...product, cantidad: 1 });
        localStorage.setItem('cart', JSON.stringify(cart));
        
        Swal.fire({
            icon: 'success',
            title: 'Producto agregado',
            showConfirmButton: false,
            timer: 1000
        });

        // Actualizar el botón
        document.querySelector(`button[data-id="${productId}"]`).textContent = 'Agregado';

        // Actualizar el contador del carrito
        updateCartCount();
    }
}

// Actualizar el número de productos en el carrito
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cart.length;
}

// Cambiar la cantidad de un producto
function changeQuantity(productId, amount) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = cart.find(item => item.codigo === productId);

    if (product) {
        product.cantidad += amount;
        if (product.cantidad <= 0) {
            confirmRemoveFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            document.getElementById('cart-icon').click(); // Reabrir el carrito
        }
    }
}

// Confirmar eliminación de producto del carrito
function confirmRemoveFromCart(productId) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Este producto será eliminado del carrito.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        confirmButtonColor: "#0048FF",
        cancelButtonText: 'No, cancelar',
        cancelButtonColor: "#F13057"
    }).then((result) => {
        if (result.isConfirmed) {
            removeFromCart(productId);
            // Restaurar el botón de "Agregar al Carrito"
            document.querySelector(`button[data-id="${productId}"]`).textContent = 'Agregar al Carrito';
        }
        else {
            document.getElementById('cart-icon').click() // Reabrir el carrito
            }
    });
}

// Remover producto del carrito
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.codigo !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    document.getElementById('cart-icon').click(); // Reabrir el carrito
}

// Vaciar carrito
function clearCart() {
    localStorage.removeItem('cart');
    updateCartCount();
    Swal.fire({
        icon: 'success',
        title: 'Carrito vaciado',
        showConfirmButton: false,
        timer: 1000
    });
}

// Función para restaurar los botones de "Agregar al Carrito"
function setupAddToCartButtons(data) {
    const buttons = document.querySelectorAll('.add-to-cart-btn');

    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-id');
            addToCart(productId, data);
        });
    });
}

// Mostrar el contenido del carrito
document.getElementById('cart-icon').addEventListener('click', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        Swal.fire({
            title: 'Carrito de Compras',
            text: 'No hay productos en el carrito.',
            icon: 'info',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: "#0048FF"
        });
    } else {
        let cartItemsHtml = '';
        cart.forEach(item => {
            cartItemsHtml += `
                <div class="cart-item">
                    <img src="${item.url}" class="cart-item-image">
                    <div class="cart-quantity align-items-center ms-2">
                        <button class="decrease-qty me-2" data-id="${item.codigo}">-</button>
                        <span>${item.cantidad}</span>
                        <button class="increase-qty ms-2" data-id="${item.codigo}">+</button>
                     </div>
                    <div class="cart-item-info text-start">
                        <h5>${item.nombre}</h5>
                    </div>
                    <div class="align-items-center pt-3"><p><strong>Precio:</strong> $${item.precio}</p></div>
                    <div class="align-items-start"><button class="remove-item-btn btn btn-outline-danger ms-3" data-id="${item.codigo}">X</button></div>
                </div>
            `;
        });

        Swal.fire({
            title: 'Carrito de Compras',
            width: 980,
            html: `
                <div class="cart-items-container">
                    ${cartItemsHtml}
                </div>
                <div class="cart-summary">
                    <p><strong>Total:</strong> $${calculateTotal(cart)}</p>
                    <button id="checkout-btn" class="cart-btn btn btn-outline-success me-2">Proceder al Pago</button>
                    <button id="clear-cart-btn" class="cart-btn btn btn-outline-danger">Vaciar Carrito</button>
                </div>
            `,
            showConfirmButton: false,
            showCloseButton: true,
            didOpen: () => {
                // Eventos para aumentar y disminuir la cantidad de productos
                document.querySelectorAll('.increase-qty').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const productId = e.target.getAttribute('data-id');
                        changeQuantity(productId, 1);
                    });
                });

                document.querySelectorAll('.decrease-qty').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const productId = e.target.getAttribute('data-id');
                        changeQuantity(productId, -1);
                    });
                });

                // Evento para eliminar productos del carrito
                document.querySelectorAll('.remove-item-btn').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const productId = e.target.getAttribute('data-id');
                        confirmRemoveFromCart(productId);
                    });
                });

                // Evento para vaciar el carrito
                document.getElementById('clear-cart-btn').addEventListener('click', () => {
                    Swal.fire({
                        title: '¿Estás seguro?',
                        text: 'El carrito será vaciado.',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: "#0048FF",
                        confirmButtonText: 'Sí, vaciar',
                        cancelButtonColor: "#F13057",
                        cancelButtonText: 'No, cancelar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            clearCart();
                            // Restaurar todos los botones de "Agregar al Carrito"
                            const buttons = document.querySelectorAll('.add-to-cart-btn');
                            buttons.forEach(button => {
                                button.textContent = 'Agregar al Carrito';
                            });
                        }
                        else {
                            document.getElementById('cart-icon').click() // Reabrir el carrito
                        }
                    });
                });

                // Proceder al pago
                document.getElementById('checkout-btn').addEventListener('click', () => {
                    Swal.fire({
                        title: 'Procesar el Pago',
                        text: '¿Quieres realizar el pago?',
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonColor: "#0048FF",
                        confirmButtonText: 'Sí, proceder',
                        cancelButtonColor: "#F13057",
                        cancelButtonText: 'No, cancelar'
                    }).then((result) => {
                        if (result.isConfirmed){
                            clearCart();
                            // Restaurar todos los botones de "Agregar al Carrito"
                            const buttons = document.querySelectorAll('.add-to-cart-btn');
                            buttons.forEach(button => {
                                button.textContent = 'Agregar al Carrito';
                            });
                            Swal.fire({
                                title: 'Pago confirmado',
                                text: 'Tu compra se ha realizado con éxito, recibirás un email con tu numero de pedido y guía de rastreo.',
                                icon: 'success',
                                confirmButtonColor: "#0048FF",
                            })
                        }
                        else {document.getElementById('cart-icon').click() // Reabrir el carrito
                        }
                    });
                });
            }
        });
    }
});

// Calcular el total de productos en el carrito
function calculateTotal(cart) {
    return cart.reduce((total, item) => total + (item.precio * item.cantidad), 0);
}

// Actualizar el contador del carrito al cargar la página
updateCartCount();
