// Configuración WhatsApp
window.whatsappNumber = "542235278090"; 
const mensajeAuto = "Quiero el catálogo";

function getWhatsAppLink() {
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensajeAuto)}`;
}

// Botón flotante WhatsApp
const floatBtn = document.getElementById("whatsappFloat");
if (floatBtn) {
    floatBtn.href = getWhatsAppLink();
    floatBtn.setAttribute('target', '_blank');
    floatBtn.setAttribute('rel', 'noopener noreferrer');
}

// Botones de consulta por WhatsApp
document.querySelectorAll(".producto-wa").forEach(btn => {
    btn.addEventListener("click", function(e) {
        e.preventDefault();
        window.open(getWhatsAppLink(), "_blank");
    });
});

// ========== MERCADO PAGO - VERSIÓN SIMPLIFICADA ==========
// ⚠️ REEMPLAZÁ CON TU ACCESS TOKEN
const ACCESS_TOKEN = 'APP_USR-2563267037152499-052209-d5b70c4b31b3e98393868f409640c268-3253933638';

async function comprarConMercadoPago(producto) {
    try {
        const btn = event.target;
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Redirigiendo...';
        btn.disabled = true;

        // Crear la preferencia - VERSIÓN MÍNIMA (sin back_urls)
        const requestBody = {
            items: [
                {
                    title: producto.name,
                    quantity: 1,
                    unit_price: producto.price,
                    currency_id: "ARS"
                }
            ]
        };

        console.log('Enviando preferencia:', requestBody);

        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        console.log('Respuesta completa:', data);

        if (response.ok && data.init_point) {
            // Redirigir a Mercado Pago
            window.location.href = data.init_point;
        } else {
            // Mostrar error detallado
            let errorMsg = 'Error al crear la preferencia.\n';
            if (data.message) errorMsg += `Mensaje: ${data.message}\n`;
            if (data.cause && data.cause.length > 0) {
                errorMsg += `Detalle: ${data.cause[0].description}`;
            }
            alert(errorMsg);
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    } catch (error) {
        console.error('Error de red:', error);
        alert('Error de conexión. Verificá tu internet y Access Token.');
        const btn = event.target;
        if (btn) {
            btn.innerHTML = '<i class="fas fa-credit-card"></i> Comprar';
            btn.disabled = false;
        }
    }
}

// Agregar evento a los botones de compra
document.querySelectorAll('.product-buy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const producto = {
            name: btn.getAttribute('data-name'),
            price: parseInt(btn.getAttribute('data-price'))
        };
        comprarConMercadoPago(producto);
    });
});

// Newsletter
const newsletterForm = document.getElementById("newsletterForm");
const newsMessage = document.getElementById("newsMessage");

if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("newsEmail").value.trim();
        if (email && email.includes("@")) {
            newsMessage.textContent = "✅ ¡Suscripto! Revisá tu email.";
            newsMessage.style.color = "#E0BC80";
            newsletterForm.reset();
            setTimeout(() => { newsMessage.textContent = ""; }, 3000);
        } else {
            newsMessage.textContent = "❌ Ingresá un email válido.";
            newsMessage.style.color = "#BD8B49";
            setTimeout(() => { newsMessage.textContent = ""; }, 3000);
        }
    });
}

// Animaciones
document.querySelectorAll('.nav-links a, .btn-outline').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Intersection Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.product-card, .attr-card, .mosaic-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Error de imágenes
document.querySelectorAll('.product-image-real').forEach(img => {
    img.addEventListener('error', function() {
        this.style.display = 'none';
        const parent = this.parentElement;
        const icon = document.createElement('i');
        icon.className = 'fas fa-perfume';
        icon.style.fontSize = '3rem';
        icon.style.color = '#BD8B49';
        parent.appendChild(icon);
    });
});

console.log("✅ Pizarro Storee - Listo para pagar con Mercado Pago");