async function fetchData() {
    try {
        const response = await fetch('./JSON/productos.json');
        const data = await response.json();

        const productContainer = document.getElementById('product-container');

        data.forEach(producto => {
            const card = document.createElement('div');
            card.classList.add('card');

            card.innerHTML = `
                <img src="${producto.url}" alt="${producto.nombre}" class="product-image">
                <div class="product-info">
                    <h2>${producto.nombre}</h2>
                    <p><strong>Autor:</strong> ${producto.autor}</p>
                    <p><strong>Precio:</strong> $${producto.precio}</p>
                    <p><strong>Código:</strong> ${producto.codigo}</p>
                    <button class="add-to-cart-btn" data-id="${producto.codigo}">Agregar al Carrito</button>
                </div>
            `;

            productContainer.appendChild(card);
        });

        setupAddToCartButtons(data);

    } catch (error) {
        setTimeout(() => {
            Swal.fire({
                icon: 'error',
                title: 'Error al cargar los productos',
                text: 'Hubo un problema al cargar los productos. Por favor, int�ntelo de nuevo m�s tarde.',
                confirmButtonText: 'OK'
            });
        }, 2000);
    }
}

fetchData();
