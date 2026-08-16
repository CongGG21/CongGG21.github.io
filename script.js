/* ==========================================================================
   FROXIMPORT - script.js
   ========================================================================== */

// Número de WhatsApp Business de Froximport.
// Formato: código de país + número, SIN "+" ni espacios.
const WHATSAPP_NUMBER = "51991657904";
const WHATSAPP_MENSAJE = "¡Hola, Frox Import! Estoy interesado/a en importar unos productos y quisiera más información sobre el servicio.";
const TARIFA_POR_KILO = 12.00;

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- 1. CALCULADORA DE FLETE ---------- */
    const inputPeso = document.getElementById('inputPeso');
    const txtResultado = document.getElementById('resultado');

    function calcularFlete() {
        const peso = parseFloat(inputPeso.value);
        if (isNaN(peso) || peso <= 0) {
            txtResultado.textContent = '$0.00 USD';
        } else {
            const costoTotal = peso * TARIFA_POR_KILO;
            txtResultado.textContent = `$${costoTotal.toFixed(2)} USD`;
        }
    }

    if (inputPeso && txtResultado) {
        calcularFlete();
        inputPeso.addEventListener('input', calcularFlete);
    }

    /* ---------- 2. MENÚ HAMBURGUESA (MÓVIL) ---------- */
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navLinks = document.getElementById('navLinks');

    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('nav-open');
            hamburgerBtn.classList.toggle('active', isOpen);
            hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Cierra el menú al tocar cualquier link (mejora UX en móvil)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav-open');
                hamburgerBtn.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ---------- 3. BOTONES DE WHATSAPP (mensajes prellenados) ---------- */
    function actualizarLinksWhatsapp() {
        document.querySelectorAll('.wa-link').forEach(link => {
            let mensaje = WHATSAPP_MENSAJE;

            // El botón "Cotizar Envío" dentro del hero manda el peso y el precio ya calculados
            if (link.classList.contains('btn-whatsapp') && txtResultado && inputPeso) {
                const peso = inputPeso.value || '1';
                mensaje = `Hola Froximport, quiero cotizar mi envío de ${peso} kg (aprox. ${txtResultado.textContent}). ¿Me ayudan con el proceso?`;
            }

            link.setAttribute('href', `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`);
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener');
        });
    }

    actualizarLinksWhatsapp();
    if (inputPeso) inputPeso.addEventListener('input', actualizarLinksWhatsapp);

    /* ---------- 4. CARRUSEL PRINCIPAL DEL HERO (fondo + titular, flechas + autoplay 7s) ---------- */
    const heroSlideEls = document.querySelectorAll('.hero-slide-bg');
    const heroDotEls = document.querySelectorAll('.hero-dot');
    const heroHeadline = document.getElementById('heroHeadline');
    const heroSubtext = document.getElementById('heroSubtext');
    const heroPrev = document.getElementById('heroPrev');
    const heroNext = document.getElementById('heroNext');

    const heroSlidesData = [
        {
            headline: 'Tu Casillero Internacional<br>Seguro en Lima',
            subtext: 'Te damos una dirección postal física en Miami. Consolidamos tus compras y las traemos a Lima sin sorpresas en la aduana.'
        },
        {
            headline: 'Consolidamos Compras<br>y Envíos',
            subtext: 'Compra en Miami o China cuando quieras. Consolidamos todo en un solo envío y pagas un único flete sin cargos extra.'
        },
        {
            headline: 'Del Almacén en Miami<br>a Tu Puerta en Lima',
            subtext: 'Seguimos tu carga en cada etapa del viaje. Te avisamos por WhatsApp, sin sistemas de rastreo confusos ni esperas eternas.'
        }
    ];

    if (heroSlideEls.length && heroHeadline && heroSubtext) {
        let heroIndex = 0;
        let heroAutoplayTimer = null;

        function renderHeroSlide(index) {
            heroIndex = (index + heroSlidesData.length) % heroSlidesData.length;

            // Fondo: crossfade entre capas
            heroSlideEls.forEach((el, i) => el.classList.toggle('active', i === heroIndex));

            // Puntos indicadores
            heroDotEls.forEach((dot, i) => dot.classList.toggle('active', i === heroIndex));

            // Texto: fade-out, cambio de contenido, fade-in
            heroHeadline.style.opacity = 0;
            heroSubtext.style.opacity = 0;
            setTimeout(() => {
                heroHeadline.innerHTML = heroSlidesData[heroIndex].headline;
                heroSubtext.textContent = heroSlidesData[heroIndex].subtext;
                heroHeadline.style.opacity = 1;
                heroSubtext.style.opacity = 1;
            }, 350);
        }

        function startHeroAutoplay() {
            clearInterval(heroAutoplayTimer);
            heroAutoplayTimer = setInterval(() => renderHeroSlide(heroIndex + 1), 7000);
        }

        if (heroNext) heroNext.addEventListener('click', () => { renderHeroSlide(heroIndex + 1); startHeroAutoplay(); });
        if (heroPrev) heroPrev.addEventListener('click', () => { renderHeroSlide(heroIndex - 1); startHeroAutoplay(); });
        heroDotEls.forEach((dot, i) => dot.addEventListener('click', () => { renderHeroSlide(i); startHeroAutoplay(); }));

        startHeroAutoplay();
    }

    /* ---------- 5. ANIMACIÓN REVEAL AL HACER SCROLL ---------- */
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length && 'IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealEls.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback: si el navegador no soporta IntersectionObserver, muestra todo directo
        revealEls.forEach(el => el.classList.add('visible'));
    }

});
