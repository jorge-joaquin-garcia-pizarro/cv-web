// Animaciones al hacer scroll
document.addEventListener('DOMContentLoaded', function() {
    
    // Observador de intersección para animaciones fade-up
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Opcional: dejar de observar después de animar
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar todas las secciones con clase 'seccion'
    const secciones = document.querySelectorAll('.seccion');
    secciones.forEach(seccion => {
        observer.observe(seccion);
    });
    
    // También observar proyectos y jobs individualmente para efectos adicionales
    const cards = document.querySelectorAll('.job, .proyecto-item');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    cardObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        cardObserver.observe(card);
    });
    
    // Efecto de typing para el título (opcional)
    const tituloElement = document.querySelector('.titulo span');
    if (tituloElement) {
        const originalText = tituloElement.textContent;
        tituloElement.style.opacity = '0';
        
        setTimeout(() => {
            let i = 0;
            tituloElement.textContent = '';
            tituloElement.style.opacity = '1';
            
            function typeWriter() {
                if (i < originalText.length) {
                    tituloElement.textContent += originalText.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50);
                }
            }
            
            typeWriter();
        }, 500);
    }
    
    // Efecto hover avanzado para enlaces
    const allLinks = document.querySelectorAll('.link-item, .btn-link');
    allLinks.forEach(link => {
        link.addEventListener('mouseenter', function(e) {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        // Ripple effect al hacer click
        link.addEventListener('click', function(e) {
            if (!this.hasAttribute('data-no-ripple')) {
                const ripple = document.createElement('span');
                ripple.classList.add('ripple-effect');
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.backgroundColor = 'rgba(44, 125, 160, 0.3';
                ripple.style.pointerEvents = 'none';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple 0.6s linear';
                
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${e.clientX - rect.left - size/2}px`;
                ripple.style.top = `${e.clientY - rect.top - size/2}px`;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            }
        });
    });
    
    // Garantizar que TODOS los enlaces externos abran en nueva pestaña
    const todosLosEnlaces = document.querySelectorAll('a[href^="http"], a[href^="https"]');
    todosLosEnlaces.forEach(link => {
        if (!link.hasAttribute('target') || link.getAttribute('target') !== '_blank') {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        } else {
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
    
    // Tooltip personalizado para enlaces (opcional)
    const crearTooltip = (element, texto) => {
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.textContent = texto;
        tooltip.style.position = 'absolute';
        tooltip.style.backgroundColor = '#0f2b3d';
        tooltip.style.color = 'white';
        tooltip.style.padding = '4px 8px';
        tooltip.style.borderRadius = '4px';
        tooltip.style.fontSize = '12px';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.opacity = '0';
        tooltip.style.transition = 'opacity 0.3s ease';
        tooltip.style.zIndex = '1000';
        
        element.style.position = 'relative';
        element.appendChild(tooltip);
        
        element.addEventListener('mouseenter', (e) => {
            tooltip.style.opacity = '1';
            tooltip.style.top = '-30px';
            tooltip.style.left = '0';
        });
        
        element.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    };
    
    // Añadir tooltips a los enlaces principales (opcional, descomentar si se quiere)
    // const githubLink = document.querySelector('.link-item i.fa-github')?.parentElement;
    // if (githubLink) crearTooltip(githubLink, 'Abrir GitHub');
    
    // Contador de estadísticas (efecto visual)
    const crearContador = (elemento, valorFinal, duracion = 2000) => {
        let inicio = 0;
        const incremento = valorFinal / (duracion / 16);
        const intervalo = setInterval(() => {
            inicio += incremento;
            if (inicio >= valorFinal) {
                elemento.textContent = valorFinal;
                clearInterval(intervalo);
            } else {
                elemento.textContent = Math.floor(inicio);
            }
        }, 16);
    };
    
    // Si hubiera elementos con clase 'contador', los animaría
    const contadores = document.querySelectorAll('.contador');
    if (contadores.length > 0) {
        const contadorObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const valor = parseInt(entry.target.getAttribute('data-valor') || '100');
                    crearContador(entry.target, valor);
                    contadorObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        contadores.forEach(contador => contadorObserver.observe(contador));
    }
    
    // Efecto parallax suave en header (opcional)
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.cv-header');
        if (header) {
            const scrolled = window.pageYOffset;
            header.style.transform = `translateY(${scrolled * 0.3}px)`;
            header.style.opacity = `${1 - scrolled * 0.002}`;
        }
    });
    
    // Animación de carga inicial
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    });
    
    console.log('✅ CV interactivo cargado - Animaciones y enlaces listos');
});

// Añadir estilos dinámicos para el efecto ripple
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 0.6;
        }
        100% {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(44, 125, 160, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    .custom-tooltip {
        position: absolute;
        white-space: nowrap;
        z-index: 1000;
        font-size: 0.75rem;
        pointer-events: none;
    }
    
    /* Scroll reveal mejorado */
    .seccion {
        transition-delay: 0.1s;
    }
    
    /* Mejoras de accesibilidad */
    a:focus-visible, button:focus-visible {
        outline: 2px solid #2c7da0;
        outline-offset: 2px;
    }
    
    /* Efecto glassmorph en hover de tarjetas */
    .card-hover:hover {
        background: linear-gradient(135deg, #ffffff, #fafcfd);
    }
`;

document.head.appendChild(style);