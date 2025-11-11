// JavaScript para funcionalidades de la página
document.addEventListener('DOMContentLoaded', function() {
    // Navegación por iconos
    const iconItems = document.querySelectorAll('.icon-item');
    const sections = document.querySelectorAll('.section');
    
    iconItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            
            // Ocultar todas las secciones
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Mostrar la sección objetivo
            document.getElementById(targetId).classList.add('active');
            
            // Desplazamiento suave a la sección
            document.getElementById(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Navegación por menú
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Ocultar todas las secciones
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Mostrar la sección objetivo
            document.getElementById(targetId).classList.add('active');
            
            // Desplazamiento suave a la sección
            document.getElementById(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Funcionalidad del carrito
    const cartIcon = document.getElementById('cartIcon');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    const overlay = document.getElementById('overlay');
    const continueShopping = document.getElementById('continueShopping');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.querySelector('.cart-count');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    // Funcionalidad del pago con QR
    const paymentModal = document.getElementById('paymentModal');
    const closePayment = document.getElementById('closePayment');
    const paymentTotal = document.getElementById('paymentTotal');
    const paymentConfirm = document.getElementById('paymentConfirm');
    const paymentCancel = document.getElementById('paymentCancel');
    
    // Funcionalidad de la factura
    const invoiceModal = document.getElementById('invoiceModal');
    const closeInvoice = document.getElementById('closeInvoice');
    const invoiceNumber = document.getElementById('invoiceNumber');
    const invoiceDate = document.getElementById('invoiceDate');
    const invoiceCustomer = document.getElementById('invoiceCustomer');
    const invoiceItemsTable = document.getElementById('invoiceItemsTable').querySelector('tbody');
    const invoiceSubtotal = document.getElementById('invoiceSubtotal');
    const invoiceTax = document.getElementById('invoiceTax');
    const invoiceTotal = document.getElementById('invoiceTotal');
    const invoicePrint = document.getElementById('invoicePrint');
    const invoiceDownload = document.getElementById('invoiceDownload');
    const invoiceClose = document.getElementById('invoiceClose');
    
    // Funcionalidad del icono de ubicación
    const locationIcon = document.getElementById('locationIcon');
    const directionsBtn = document.getElementById('directionsBtn');
    
    // Funcionalidad de la galería
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryModal = document.getElementById('galleryModal');
    const galleryModalImage = document.getElementById('galleryModalImage');
    const galleryModalDescription = document.getElementById('galleryModalDescription');
    const closeGallery = document.getElementById('closeGallery');
    
    // Funcionalidad del buscador
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    let cart = [];
    let currentOrder = {};
    
    // Abrir carrito
    cartIcon.addEventListener('click', function() {
        cartModal.classList.add('active');
        overlay.classList.add('active');
    });
    
    // Cerrar carrito
    function closeCartModal() {
        cartModal.classList.remove('active');
        overlay.classList.remove('active');
    }
    
    closeCart.addEventListener('click', closeCartModal);
    overlay.addEventListener('click', closeCartModal);
    continueShopping.addEventListener('click', closeCartModal);
    
    // Añadir productos al carrito
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            const image = this.getAttribute('data-image');
            
            // Verificar si el producto ya está en el carrito
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id,
                    name,
                    price,
                    image,
                    quantity: 1
                });
            }
            
            updateCart();
            
            // Animación de confirmación
            this.textContent = '¡Añadido!';
            this.style.backgroundColor = '#4CAF50';
            
            setTimeout(() => {
                this.textContent = 'Añadir al Carrito';
                this.style.backgroundColor = '';
            }, 1500);
        });
    });
    
    // Actualizar carrito
    function updateCart() {
        cartItems.innerHTML = '';
        let total = 0;
        let count = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            count += item.quantity;
            
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
            
            cartItems.appendChild(cartItemElement);
        });
        
        cartTotal.textContent = `$${total.toFixed(2)}`;
        cartCount.textContent = count;
        
        // Agregar event listeners a los botones de cantidad y eliminar
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const item = cart.find(item => item.id === id);
                
                if (item.quantity > 1) {
                    item.quantity -= 1;
                    updateCart();
                }
            });
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const item = cart.find(item => item.id === id);
                
                item.quantity += 1;
                updateCart();
            });
        });
        
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function() {
                const id = this.getAttribute('data-id');
                const item = cart.find(item => item.id === id);
                const newQuantity = parseInt(this.value);
                
                if (newQuantity > 0) {
                    item.quantity = newQuantity;
                    updateCart();
                } else {
                    this.value = item.quantity;
                }
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                cart = cart.filter(item => item.id !== id);
                updateCart();
            });
        });
    }
    
    // Abrir modal de pago
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Tu carrito está vacío. Agrega algunos productos antes de proceder al pago.');
            return;
        }
        
        // Calcular total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Actualizar total en el modal
        paymentTotal.textContent = `$${total.toFixed(2)}`;
        
        // Mostrar modal de pago
        paymentModal.classList.add('active');
        overlay.classList.add('active');
        cartModal.classList.remove('active');
    });
    
    // Cerrar modal de pago
    function closePaymentModal() {
        paymentModal.classList.remove('active');
        overlay.classList.remove('active');
    }
    
    closePayment.addEventListener('click', closePaymentModal);
    paymentCancel.addEventListener('click', closePaymentModal);
    
    // Confirmar pago y generar factura
    paymentConfirm.addEventListener('click', function() {
        // Guardar información de la orden actual
        currentOrder = {
            items: [...cart],
            date: new Date(),
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            number: 'F-' + new Date().getFullYear() + '-' + (Math.floor(Math.random() * 1000) + 1)
        };
        
        // Generar factura
        generateInvoice();
        
        // Cerrar modal de pago
        closePaymentModal();
        
        // Mostrar modal de factura
        invoiceModal.classList.add('active');
        overlay.classList.add('active');
    });
    
    // Generar factura
    function generateInvoice() {
        // Limpiar tabla de items
        invoiceItemsTable.innerHTML = '';
        
        // Actualizar información de la factura
        invoiceNumber.textContent = currentOrder.number;
        invoiceDate.textContent = currentOrder.date.toLocaleDateString();
        invoiceCustomer.textContent = 'Cliente';
        
        let subtotal = 0;
        
        // Agregar items a la factura
        currentOrder.items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${itemTotal.toFixed(2)}</td>
            `;
            invoiceItemsTable.appendChild(row);
        });
        
        // Calcular impuestos y total
        const tax = subtotal * 0.13; // 13% de IVA
        const total = subtotal + tax;
        
        // Actualizar totales
        invoiceSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        invoiceTax.textContent = `$${tax.toFixed(2)}`;
        invoiceTotal.textContent = `$${total.toFixed(2)}`;
    }
    
    // Cerrar modal de factura
    function closeInvoiceModal() {
        invoiceModal.classList.remove('active');
        overlay.classList.remove('active');
        
        // Limpiar carrito después de completar la compra
        cart = [];
        updateCart();
    }
    
    closeInvoice.addEventListener('click', closeInvoiceModal);
    invoiceClose.addEventListener('click', closeInvoiceModal);
    
    // Imprimir factura
    invoicePrint.addEventListener('click', function() {
        window.print();
    });
    
    // Descargar factura como PDF (simulación)
    invoiceDownload.addEventListener('click', function() {
        alert('La factura se ha descargado como PDF. En una implementación real, esto generaría un archivo PDF.');
        // En una implementación real, aquí se usaría una librería como jsPDF
    });
    
    // Funcionalidad del icono de ubicación
    function openDirections() {
        // URL para abrir en Google Maps
        const address = "Ruta Nacional-27, Cosapa";
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
        
        // Abrir en una nueva pestaña
        window.open(mapsUrl, '_blank');
    }
    
    locationIcon.addEventListener('click', openDirections);
    directionsBtn.addEventListener('click', openDirections);
    
    // Efecto adicional al hacer clic en el icono
    locationIcon.addEventListener('click', function() {
        this.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.style.transform = 'scale(1.1)';
        }, 300);
    });
    
    // Funcionalidad de la galería
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imageSrc = this.getAttribute('data-image');
            const description = this.getAttribute('data-description');
            
            galleryModalImage.src = imageSrc;
            galleryModalDescription.textContent = description;
            
            galleryModal.classList.add('active');
            overlay.classList.add('active');
        });
    });
    
    function closeGalleryModal() {
        galleryModal.classList.remove('active');
        overlay.classList.remove('active');
    }
    
    closeGallery.addEventListener('click', closeGalleryModal);
    overlay.addEventListener('click', closeGalleryModal);
    
    // Funcionalidad del buscador
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            alert('Por favor, ingresa un término de búsqueda.');
            return;
        }
        
        // Buscar en productos
        const products = document.querySelectorAll('.product-card');
        let foundProducts = [];
        
        products.forEach(product => {
            const productName = product.querySelector('h3').textContent.toLowerCase();
            const productDescription = product.querySelector('p').textContent.toLowerCase();
            
            if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
                foundProducts.push(product);
            }
        });
        
        if (foundProducts.length > 0) {
            // Mostrar sección de catálogo
            sections.forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById('catalogo').classList.add('active');
            
            // Resaltar productos encontrados
            products.forEach(product => {
                product.style.opacity = '0.5';
            });
            
            foundProducts.forEach(product => {
                product.style.opacity = '1';
                product.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
            
            // Restaurar opacidad después de 3 segundos
            setTimeout(() => {
                products.forEach(product => {
                    product.style.opacity = '1';
                });
            }, 3000);
            
            alert(`Se encontraron ${foundProducts.length} productos que coinciden con "${searchTerm}".`);
        } else {
            alert(`No se encontraron productos que coincidan con "${searchTerm}".`);
        }
        
        searchInput.value = '';
    }
    
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Formularios
    const contactForm = document.getElementById('contactForm');
    const reservationForm = document.getElementById('reservationForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('¡Gracias por tu mensaje! Te contactaremos pronto.');
        contactForm.reset();
    });
    
    reservationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('¡Gracias por tu reserva! Te contactaremos para confirmar los detalles.');
        reservationForm.reset();
    });
    
    // Mostrar la sección de inicio por defecto
    document.getElementById('inicio').classList.add('active');
});